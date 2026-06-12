import { storage } from './storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

type AnyRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const emptyAnalytics = () => ({
  calories_consumed: 0,
  protein_total: 0,
  carbs_total: 0,
  fats_total: 0,
  hydration_score: 0,
  nutrition_score: 0,
  productivity_score: 0,
  macro_distribution: { protein: 0, carbs: 0, fats: 0 },
  meal_consistency: 0,
  ai_insights: [],
  weekly_calories: [0, 0, 0, 0, 0, 0, 0],
  weekly_hydration: [0, 0, 0, 0, 0, 0, 0],
});

const fallbackMacros = () => ({
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  protein_goal: 150,
  carbs_goal: 250,
  fats_goal: 70,
  calories: 0,
  calories_goal: 2200,
});

const mapPath = (path: string): string => {
  if (path === '/api/v1/foods') return '/api/v1/foods?limit=100';
  return path;
};

const normalizeAnalytics = (data: unknown) => {
  if (!isRecord(data) || 'message' in data) return emptyAnalytics();
  const calories = Number(data.calories_consumed ?? data.calories_total ?? 0);
  const protein = Number(data.protein_total ?? 0);
  const carbs = Number(data.carbs_total ?? 0);
  const fats = Number(data.fats_total ?? 0);
  const hydrationTotal = Number(data.hydration_total ?? data.hydration_total_ml ?? 0);
  const hydrationScore = Number(data.hydration_score ?? Math.min(100, hydrationTotal / 25));

  return {
    calories_consumed: calories,
    protein_total: protein,
    carbs_total: carbs,
    fats_total: fats,
    hydration_score: hydrationScore,
    nutrition_score: Number(data.nutrition_score ?? 0),
    productivity_score: Number(data.productivity_score ?? 0),
    macro_distribution: { protein, carbs, fats },
    meal_consistency: Number(data.meal_consistency ?? 0),
    ai_insights: Array.isArray(data.ai_insights) ? data.ai_insights : [],
    weekly_calories: Array.isArray(data.weekly_calories) ? data.weekly_calories : [0, 0, 0, 0, 0, 0, calories],
    weekly_hydration: Array.isArray(data.weekly_hydration) ? data.weekly_hydration : [0, 0, 0, 0, 0, 0, hydrationTotal],
  };
};

const normalizeHydrationAnalytics = (data: unknown) => {
  const record = isRecord(data) ? data : {};
  const total = Number(record.total_today ?? record.total_water ?? 0);
  const goal = Number(record.goal ?? 2500);
  return {
    total_today: total,
    goal,
    percentage: goal ? Math.min(100, Math.round((total / goal) * 100)) : 0,
    streak_days: Number(record.streak_days ?? 0),
    weekly_average: Number(record.weekly_average ?? total),
    logs: Array.isArray(record.logs) ? record.logs : [],
  };
};

const normalizeRecommendation = (data: unknown) => {
  if (!isRecord(data)) return data;
  if (Array.isArray(data.recommendations) || Array.isArray(data.insights)) return data;
  const summary = typeof data.summary === 'string' ? data.summary : '';
  return {
    ...data,
    recommendations: summary ? [summary] : [],
    insights: summary ? [summary] : [],
  };
};

const normalizeLatest = (data: unknown, valueKey: string, responseKey: string) => {
  const latest = Array.isArray(data)
    ? data[data.length - 1]
    : isRecord(data)
      ? data[valueKey] ?? data.latest
      : undefined;
  if (latest === undefined || latest === null) return {};
  return { [responseKey]: latest, latest: { [responseKey]: latest } };
};

const normalizeData = (path: string, data: unknown): unknown => {
  if (path.endsWith('/api/v1/analytics')) return normalizeAnalytics(data);
  if (path.endsWith('/api/v1/macro-analysis')) return data || fallbackMacros();
  if (path.endsWith('/api/v1/hydration/analytics')) return normalizeHydrationAnalytics(data);
  if (path.endsWith('/api/v1/recommendations')) return normalizeRecommendation(data);
  if (path.endsWith('/api/v1/energy-analytics')) return normalizeLatest(data, 'energy_level', 'level');
  if (path.endsWith('/api/v1/mood-analytics')) return normalizeLatest(data, 'mood', 'mood');
  if (path.endsWith('/api/v1/sleep-analytics')) return normalizeLatest(data, 'avg_sleep_hours', 'sleep_hours');
  return data;
};

const normalizeBody = (path: string, body: unknown): unknown => {
  if (!isRecord(body)) return body;
  if (path.endsWith('/api/v1/energy-level') && 'level' in body) {
    return { energy_level: body.level };
  }
  if ((path.endsWith('/api/v1/reminders') || path.endsWith('/api/v1/user/preferences')) && Array.isArray(body.allergies)) {
    return { ...body, allergies: body.allergies.join(', ') };
  }
  if (path.endsWith('/api/v1/onboarding') && Array.isArray(body.allergies)) {
    return { ...body, allergies: body.allergies.join(', ') };
  }
  return body;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(isFormData = false): HeadersInit {
    const token = storage.getToken();
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  private async handleResponse<T>(res: Response, originalPath: string): Promise<ApiResponse<T>> {
    const status = res.status;
    if (status === 401) {
      storage.clearAll();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return { data: null, error: 'Session expired. Please log in again.', status };
    }
    if (status === 204) return { data: null, error: null, status };
    try {
      const json = await res.json();
      if (!res.ok) {
        const msg =
          typeof json?.detail === 'string'
            ? json.detail
            : Array.isArray(json?.detail)
              ? json.detail.map((d: { msg: string }) => d.msg).join(', ')
              : json?.message || `Error ${status}`;
        return { data: null, error: msg, status };
      }
      const payload = isRecord(json) && 'success' in json && 'data' in json ? json.data : json;
      return { data: normalizeData(originalPath, payload) as T, error: null, status };
    } catch {
      return { data: null, error: res.ok ? null : `Error ${status}`, status };
    }
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Network error - is the backend running?', status: 0 };
    }
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body !== undefined ? JSON.stringify(normalizeBody(path, body)) : undefined,
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Network error - is the backend running?', status: 0 };
    }
  }

  async postForm<T>(path: string, body: URLSearchParams): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const token = storage.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'POST',
        headers,
        body,
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Network error - is the backend running?', status: 0 };
    }
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body !== undefined ? JSON.stringify(normalizeBody(path, body)) : undefined,
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Network error - is the backend running?', status: 0 };
    }
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Network error - is the backend running?', status: 0 };
    }
  }

  async uploadFile<T>(path: string, file: File): Promise<ApiResponse<T>> {
    const mappedPath = mapPath(path);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = storage.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return this.handleResponse<T>(res, path);
    } catch {
      return { data: null, error: 'Upload failed - network error', status: 0 };
    }
  }

  async stream(
    path: string,
    body: unknown,
    onChunk: (word: string) => void,
    onDone: () => void,
    onError: (err: string) => void
  ): Promise<void> {
    const mappedPath = mapPath(path);
    try {
      const token = storage.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${this.baseUrl}${mappedPath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(normalizeBody(path, body)),
      });

      if (!res.ok || !res.body) {
        onError(`Error ${res.status}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const word = trimmed.slice(6);
            if (word === '[DONE]') { onDone(); return; }
            if (word) onChunk(`${word} `);
          }
        }
      }
      onDone();
    } catch {
      onError('Streaming failed - network error');
    }
  }
}

export const api = new ApiClient(BASE_URL);
export { BASE_URL };
