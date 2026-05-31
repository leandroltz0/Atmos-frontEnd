import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SettingsGroup, SettingsItem } from '../../../features/settings/settings.types';

@Component({
  selector: 'app-settings-group',
  standalone: true,
  imports: [MatButtonModule, MatSlideToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-group.component.html',
  styleUrl: './settings-group.component.scss'
})
export class SettingsGroupComponent {
  readonly group = input.required<SettingsGroup>();

  readonly toggleChanged = output<{ groupId: string; itemId: string; checked: boolean }>();
  readonly selectChanged = output<{ groupId: string; itemId: string; value: string }>();
  readonly actionClicked = output<{ groupId: string; itemId: string }>();

  protected isToggle(item: SettingsItem): item is SettingsItem & { type: 'toggle'; value: boolean } {
    return item.type === 'toggle';
  }

  protected isSelect(item: SettingsItem): item is SettingsItem & { type: 'select'; value: string; options: { value: string; label: string }[] } {
    return item.type === 'select';
  }

  protected isAction(item: SettingsItem): item is SettingsItem & { type: 'action'; actionLabel: string } {
    return item.type === 'action';
  }

  protected onToggleChanged(itemId: string, checked: boolean): void {
    this.toggleChanged.emit({ groupId: this.group().id, itemId, checked });
  }

  protected onSelectChanged(itemId: string, value: string): void {
    this.selectChanged.emit({ groupId: this.group().id, itemId, value });
  }

  protected onActionClicked(itemId: string): void {
    this.actionClicked.emit({ groupId: this.group().id, itemId });
  }
}
