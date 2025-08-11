import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../core/services/events.service';
import { EventItem } from './event-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  // форма
  newTitle = '';
  newDate = '';
  newDesc = '';


  selectedDate: string = new Date().toISOString().slice(0, 10); // сегодня YYYY-MM-DD
  events: EventItem[] = [];

  // для отображения календаря
  currentDate: Date = new Date();
  daysInMonth: number[] = [];
  firstDayOffset: number = 0; // сдвиг начала месяца

  constructor(private eventsService: EventsService) {
    this.reload();
    this.generateCalendar();
  }
  
  
  reload() {
    this.events = this.eventsService.all();
  }

  // CRUD
  addEvent() {
    if (!this.newTitle.trim() || !this.newDate) return;
    this.eventsService.add(this.newTitle.trim(), this.newDate, this.newDesc.trim());
    this.clearForm();
    this.reload();
  }

  deleteEvent(id: number) {
    if (!confirm('Удалить событие?')) return;
    this.eventsService.remove(id);
    this.reload();
  }

  editEvent(e: EventItem) {
    const title = prompt('Редактировать название', e.title);
    if (title === null) return;
    const desc = prompt('Редактировать описание', e.description ?? '');
    if (desc === null) return;
    const date = prompt('Редактировать дату (YYYY-MM-DD)', e.date);
    if (date === null) return;

    if (!title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      alert('Неправильные данные');
      return;
    }
    this.eventsService.update(e.id, { title: title.trim(), description: desc.trim(), date });
    this.reload();
  }

  clearForm() {
    this.newTitle = '';
    this.newDate = '';
    this.newDesc = '';
  }

  // События на выбранный день
  get eventsForSelectedDate() {
    return this.eventsService.byDate(this.selectedDate);
  }

  // Генерация календаря
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    this.firstDayOffset = (firstDay + 6) % 7; // перевод, чтобы понедельник был первым

    const daysCount = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  changeMonth(delta: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
    this.generateCalendar();
  }

  getEventsForDay(day: number) {
    const dateStr = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
      .toISOString()
      .slice(0, 10);
    return this.eventsService.byDate(dateStr);
  }
}
