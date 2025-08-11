import { Injectable } from '@angular/core';
import { EventItem } from '../../features/calendar/event-item.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private KEY = 'calendarEvents_v1';
  private events: EventItem[] = [];

  constructor() {
    this.load();
  }

  private persist() {
    localStorage.setItem(this.KEY, JSON.stringify(this.events));
  }

  private load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) { this.events = []; return; }
    try {
      const parsed = JSON.parse(raw);
      this.events = parsed.map((e: any) => new EventItem(e.id, e.title, e.date, e.description));
    } catch {
      this.events = [];
    }
  }

  all(): EventItem[] {
    // возвращаем копию, чтобы внешние не мутировали напрямую
    return this.events.map(e => Object.assign({}, e));
  }

  add(title: string, date: string, description?: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const ev = new EventItem(id, title, date, description);
    this.events.push(ev);
    this.persist();
    return ev;
  }

  update(id: number, partial: Partial<EventItem>) {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.events[idx] = { ...this.events[idx], ...partial };
    this.persist();
    return true;
  }

  remove(id: number) {
    this.events = this.events.filter(e => e.id !== id);
    this.persist();
  }

  byDate(date: string) {
    return this.events.filter(e => e.date === date).map(e => Object.assign({}, e));
  }
}
