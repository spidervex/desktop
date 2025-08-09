import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { OsWindow } from '../models/window.model';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="taskbar">
      <button class="btn" (click)="toggleMenu()">Start</button>
      <button class="window-button" *ngFor="let w of windows" (click)="toggleWindow(w)" [title]="w.title">
        {{ w.title }}
      </button>
    </div>
    <div class="start-menu" *ngIf="menuOpen">
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button class="btn" (click)="openTextEditor()">Text Editor</button>
        <button class="btn" (click)="openMap()">Map</button>
        <button class="btn" (click)="openSettings()">Settings</button>
        <button class="btn" (click)="openTodo()">To‑Do</button>
      </div>
    </div>
  `,
})
export class TaskbarComponent implements OnInit, OnDestroy {
  private wm = inject(WindowManagerService);
  windows: OsWindow[] = [];
  private sub?: any;
  menuOpen = false;

  ngOnInit(): void {
    this.sub = this.wm.windows$.subscribe(ws => (this.windows = ws));
  }
  ngOnDestroy(): void { this.sub?.unsubscribe?.(); }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  openTextEditor() { this.wm.createWindow('text-editor', { title: 'Text Editor' }); this.menuOpen = false; }
  toggleWindow(w: OsWindow) { this.wm.toggleMinimize(w.id); }
  openMap() { this.wm.createWindow('map', { title: 'Map' }); this.menuOpen = false; }
  openSettings() { this.wm.createWindow('settings', { title: 'Settings', rect: { left: 150, top: 150, width: 520, height: 360 } }); this.menuOpen = false; }
  openTodo() { this.wm.createWindow('todo', { title: 'To‑Do', rect: { left: 200, top: 120, width: 720, height: 520 } }); this.menuOpen = false; }
}
