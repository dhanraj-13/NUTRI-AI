export const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://127.0.0.1:8000';

export type WSChannel = 'default' | 'live' | 'analytics' | 'ai-stream';

export class WSManager {
  private socket: WebSocket | null = null;
  private channel: WSChannel;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();
  private shouldReconnect = true;

  constructor(channel: WSChannel = 'default') {
    this.channel = channel;
  }

  connect() {
    const path = this.channel === 'default' ? '/ws' : `/ws/${this.channel}`;
    try {
      this.socket = new WebSocket(`${WS_BASE}${path}`);

      this.socket.onopen = () => {
        this.emit('open', {});
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
          if (data.event) this.emit(data.event, data);
        } catch {
          this.emit('message', event.data);
        }
      };

      this.socket.onclose = () => {
        this.emit('close', {});
        if (this.shouldReconnect) {
          this.reconnectTimer = setTimeout(() => this.connect(), 3000);
        }
      };

      this.socket.onerror = () => {
        this.emit('error', {});
      };
    } catch {
      // WS not available
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    }
  }

  on(event: string, cb: (data: unknown) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  off(event: string, cb: (data: unknown) => void) {
    const arr = this.listeners.get(event) || [];
    this.listeners.set(event, arr.filter(fn => fn !== cb));
  }

  private emit(event: string, data: unknown) {
    (this.listeners.get(event) || []).forEach(fn => fn(data));
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
