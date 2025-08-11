import { Routes } from '@angular/router';
import { WeatherComponent } from './features/weather/weather.component';
import { CalendarComponent } from './features/calendar/calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'weather', pathMatch: 'full' },
  { path: 'weather', component: WeatherComponent },
  { path: 'calendar', component: CalendarComponent }
];