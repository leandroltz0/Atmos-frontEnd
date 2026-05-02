import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-weather-tabs',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './weather-tabs.component.html',
  styleUrl: './weather-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherTabsComponent {}
