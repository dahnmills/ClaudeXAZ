import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id:          number;
  title?:      string;
  text:        string;
  tone:        ToastTone;
  duration:    number;
  actionLabel?: string;
}

export interface ToastOptions {
  title?:       string;
  tone?:        ToastTone;
  duration?:    number;
  actionLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly _toasts = signal<Toast[]>([]);
  private nextId = 1;
  private readonly actions = new Map<number, () => void>();

  readonly toasts = this._toasts.asReadonly();

  show(text: string, opts: ToastOptions = {}, onAction?: () => void): number {
    const id          = this.nextId++;
    const tone        = opts.tone ?? 'info';
    const duration    = opts.duration ?? 5000;
    const title       = opts.title;
    const actionLabel = opts.actionLabel;
    this._toasts.update(t => [...t, { id, title, text, tone, duration, actionLabel }]);
    if (onAction && actionLabel) this.actions.set(id, onAction);
    if (duration > 0) setTimeout(() => this.dismiss(id), duration);
    return id;
  }

  triggerAction(id: number): void {
    const cb = this.actions.get(id);
    if (cb) cb();
    this.dismiss(id);
  }

  dismiss(id: number): void {
    this.actions.delete(id);
    this._toasts.update(t => t.filter(x => x.id !== id));
  }

  clear(): void {
    this.actions.clear();
    this._toasts.set([]);
  }
}
