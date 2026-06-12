// ===================== AUTH =====================
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ===================== FOOD & NUTRITION =====================
export interface Food {
  id: number;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  serving_size: string;
  food_category: string;
  meal_type: string;
  diet_type: string;
  hydration_score: number;
  satiety_score: number;
  health_benefits: string;
  image_path?: string;
}

export interface NutritionLog {
  id: number;
  food_name: string;
  quantity: number;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  meal_time: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface NutritionLogPayload {
  food_name: string;
  quantity: number;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  meal_time: string;
}

// ===================== HYDRATION =====================
export interface HydrationLog {
  id: number;
  water_amount: number;
  logged_at: string;
}

export interface HydrationAnalytics {
  total_today: number;
  goal: number;
  percentage: number;
  streak_days: number;
  weekly_average: number;
  logs: HydrationLog[];
}

// ===================== ANALYTICS =====================
export interface Analytics {
  calories_consumed: number;
  protein_total: number;
  carbs_total: number;
  fats_total: number;
  hydration_score: number;
  nutrition_score: number;
  productivity_score: number;
  macro_distribution: { protein: number; carbs: number; fats: number };
  meal_consistency: number;
  ai_insights: string[];
  weekly_calories?: number[];
  weekly_hydration?: number[];
}

export interface MacroAnalysis {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  protein_goal: number;
  carbs_goal: number;
  fats_goal: number;
  calories: number;
  calories_goal: number;
}

// ===================== AI =====================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatPayload {
  message: string;
  top_k: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

// ===================== WELLNESS =====================
export type EnergyLevel = 'Low' | 'Medium' | 'High';
export type MoodType = 'Tired' | 'Focused' | 'Stressed' | 'Energetic';

export interface EnergyLog {
  level: EnergyLevel;
  logged_at: string;
}

export interface MoodLog {
  mood: MoodType;
  logged_at: string;
}

export interface SleepLog {
  sleep_hours: number;
  logged_at: string;
}

// ===================== USER / PROFILE =====================
export interface UserProfile {
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  gender?: string;
  nutrition_goal?: string;
}

export interface UserPreferences {
  goal?: string;
  activity_level?: string;
  diet_preference?: string;
  hydration_goal?: number;
  allergies?: string[];
  productivity_goal?: string;
}

export interface OnboardingPayload {
  goal: string;
  activity_level: string;
  diet_preference: string;
  hydration_goal: number;
  allergies: string[];
  productivity_goal: string;
}

// ===================== REMINDERS =====================
export interface Reminders {
  meal_reminders: boolean;
  hydration_reminders: boolean;
  ai_notifications: boolean;
}

// ===================== UPLOAD =====================
export interface UploadResult {
  filename: string;
  path: string;
  bytes: number;
}

// ===================== MONITORING =====================
export interface SystemHealth {
  service: string;
  dataset_path?: string;
  postgresql_configured: boolean;
  database_fallback_mode: boolean;
  redis_configured: boolean;
  openai_configured: boolean;
}

export interface RAGHealth {
  status: string;
  vector_count?: number;
  retriever?: string;
  embedding_model?: string;
}

export interface CacheHealth {
  status: string;
  backend: string;
}

export interface WorkerHealth {
  status: string;
  broker?: string;
}

// ===================== APP STATE =====================
export type AppPage =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'dashboard'
  | 'ai-chat'
  | 'nutrition'
  | 'meals'
  | 'hydration'
  | 'productivity'
  | 'analytics'
  | 'planner'
  | 'goals'
  | 'profile'
  | 'settings'
  | 'reminders'
  | 'uploads'
  | 'monitoring';

export type AuthState = 'unauthenticated' | 'authenticated' | 'onboarding';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
