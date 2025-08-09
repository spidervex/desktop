import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeName } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
      <h3 style="margin:0 0 6px 0; font-weight:600;">Settings</h3>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="font-size:12px; color:var(--text-dim);">Theme</div>
        <select class="btn" [(ngModel)]="selectedTheme" (change)="onThemeChange()">
          <option *ngFor="let t of themes" [ngValue]="t.id">{{ t.label }}</option>
        </select>
      </div>
      <div style="height:1px; background:rgba(255,255,255,0.06);"></div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="font-size:12px; color:var(--text-dim);">Window Controls</div>
      <select class="btn" [(ngModel)]="selectedControls" (change)="onControlsChange()">
        <option *ngFor="let ct of controlThemes" [ngValue]="ct.id">{{ ct.label }}</option>
      </select>
    </div>
      <div style="font-size:12px; color:var(--text-dim);">Your choice is saved and applies instantly.</div>
      <div style="flex:1"></div>
    </div>
  `,
})
export class SettingsComponent {
  private theme = inject(ThemeService);
  themes = this.theme.getAvailableThemes();
  get current(): ThemeName { return this.theme.getTheme(); }
  apply(id: ThemeName) { this.theme.setTheme(id); }
  controlThemes = this.theme.getControlThemes();
  get currentControlsTheme(): string { return this.theme.getCurrentControlsTheme(); }
  chooseControlsTheme(id: string) { this.theme.setControlsTheme(id, 'user'); }

  selectedTheme: ThemeName = this.theme.getTheme();
  selectedControls: string = this.theme.getCurrentControlsTheme();

  onThemeChange() {
    this.apply(this.selectedTheme);
    // If auto mode changed the controls preset, reflect it
    this.selectedControls = this.theme.getCurrentControlsTheme();
  }
  onControlsChange() {
    this.chooseControlsTheme(this.selectedControls);
  }
}
