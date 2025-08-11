import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventsService } from '../../core/services/events.service';
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  isSidebarOpen = false;

  toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}

  // --- данные и состояние ---
  city: string = '';
  cities: string[] = [];
  weatherByCity: { [key: string]: any } = {};
  isLoading = false;
  errorMsg = '';
 
  
  // UI
  showMenuWidget = false;
  currentView: 'weather' | 'calendar' = 'weather';
  isDarkMode = false;

  // API
  private apiKey = '6dfe554536c3bdaab5fd7d4b23d4af89';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Привязываем классы к host-элементу компонента
  @HostBinding('class.full-screen') hostFull = true;
  @HostBinding('class.dark') get hostDark() { return this.isDarkMode; }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCities();
  }

  // UI handlers
  toggleMenu() {
    this.showMenuWidget = !this.showMenuWidget;
  }

  selectView(view: 'weather' | 'calendar') {
    this.currentView = view;
    this.showMenuWidget = false;
  }
  

  toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  if (this.isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

  // Cities & persistence
  addCity() {
    const trimmed = this.city.trim();
    if (trimmed && !this.cities.includes(trimmed)) {
      this.cities.push(trimmed);
      this.saveCities();
      this.getWeather(trimmed);
      this.city = '';
    }
  }

  removeCity(city: string) {
    this.cities = this.cities.filter(c => c !== city);
    delete this.weatherByCity[city];
    this.saveCities();
  }

  saveCities() {
    localStorage.setItem('cities', JSON.stringify(this.cities));
  }

  loadCities() {
    const saved = localStorage.getItem('cities');
    if (saved) {
      this.cities = JSON.parse(saved);

      this.cities.forEach(c => this.getWeather(c));
    }
  }

  // API call
  getWeather(cityName: string) {
    this.isLoading = true;
    this.errorMsg = '';

    this.http.get<any>(`${this.apiUrl}?q=${encodeURIComponent(cityName)}&units=metric&appid=${this.apiKey}&lang=ru`)
      .subscribe({
        next: (data) => {
          this.weatherByCity[cityName] = {
            name: data.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            minTemp: Math.round(data.main.temp_min),
            maxTemp: Math.round(data.main.temp_max)
          };
          this.isLoading = false;
        },
        error: () => {
          this.errorMsg = 'Не удалось загрузить погоду. Проверьте название города.';
          this.isLoading = false;
        }
      });
  }

  // Шаблонные методы
  getIcon(city: string): string {
    return this.weatherByCity[city]?.icon || '';
  }

  getCurrentTemp(city: string): number | string {
    return this.weatherByCity[city]?.temperature ?? '-';
  }

  getDescription(city: string): string {
    return this.weatherByCity[city]?.description || '';
  }

  getMinTemp(city: string): number | string {
    return this.weatherByCity[city]?.minTemp ?? '-';
  }

  getMaxTemp(city: string): number | string {
    return this.weatherByCity[city]?.maxTemp ?? '-';
  }
}
