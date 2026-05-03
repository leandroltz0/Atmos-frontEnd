import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AqiPanelComponent } from '../../../../shared/components/aqi-panel';
import { MoonPhaseComponent } from '../../../../shared/components/moon-phase';
import { RainBarsChartComponent } from '../../../../shared/components/rain-bars-chart';
import { SectionCardComponent } from '../../../../shared/components/section-card';
import { StatCellComponent } from '../../../../shared/components/stat-cell';
import { SunTimelineComponent } from '../../../../shared/components/sun-timeline';
import { UvTimelineComponent } from '../../../../shared/components/uv-timeline';
import { WindRoseComponent } from '../../../../shared/components/wind-rose';
import {
  HourlyChartComponent,
  type HourlyChartDatum
} from './components/hourly-chart/hourly-chart.component';

interface AtmosphericMetric {
  label: string;
  value: string;
  unit?: string;
}

interface DetailAirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}

@Component({
  selector: 'app-detail-tab',
  standalone: true,
  imports: [
    HourlyChartComponent,
    RainBarsChartComponent,
    WindRoseComponent,
    UvTimelineComponent,
    AqiPanelComponent,
    SunTimelineComponent,
    MoonPhaseComponent,
    SectionCardComponent,
    StatCellComponent
  ],
  templateUrl: './detail-tab.component.html',
  styleUrl: './detail-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailTabComponent {
  @Input() hourlyData: HourlyChartDatum[] = [];
  @Input() airQuality: DetailAirQuality = {
    aqi: 42,
    pm25: 12,
    pm10: 18,
    o3: 31,
    no2: 8
  };
  @Input() atmosphericMetrics: AtmosphericMetric[] = [
    { label: 'Punto de rocio', value: '15°' },
    { label: 'Visibilidad', value: '10', unit: 'km' },
    { label: 'Presion', value: '1014', unit: 'hPa' },
    { label: 'Sensacion termica', value: '29°' }
  ];
}
