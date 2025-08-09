import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { OsWindow } from '../models/window.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="taskbar">
      <div class="start">
        <button class="start-btn" (click)="toggleMenu()">☰ Start</button>
      </div>
      <div class="tasks">
        <button class="task" *ngFor="let w of windows" (click)="toggleWindow(w)" [class.active]="w.id===activeId" [class.minimized]="w.state==='minimized'" [title]="w.title">
          {{ w.title }}
        </button>
      </div>
      <div class="sys">
        <div class="tb-clock">{{ time }}</div>
      </div>
    </div>
    <div class="start-menu" *ngIf="menuOpen">
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button class="btn" (click)="openTextEditor()">Text Editor</button>
        <button class="btn" (click)="openMap()">Map</button>
        <button class="btn" (click)="openSettings()">Settings</button>
        <button class="btn" (click)="openTodo()">To‑Do</button>
        <button class="btn" (click)="openClock()">Clock</button>
        <button class="btn" (click)="openDocs()">Documentation</button>
      </div>
    </div>
  `,
})
export class TaskbarComponent implements OnInit, OnDestroy {
  private wm = inject(WindowManagerService);
  windows: OsWindow[] = [];
  private sub?: Subscription;
  private tickSub?: Subscription;
  menuOpen = false;
  time = '';
  activeId: number | null = null;

  ngOnInit(): void {
    this.sub = this.wm.windows$.subscribe(ws => {
      this.windows = ws;
      const top = ws.filter(w => w.state !== 'minimized').reduce((a, b) => (a == null || b.zIndex > a.zIndex ? b : a), null as OsWindow | null);
      this.activeId = top?.id ?? null;
    });
    this.tickSub = interval(1000).subscribe(() => this.updateTime());
    this.updateTime();
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); this.tickSub?.unsubscribe(); }

  private updateTime() {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2,'0');
    const mm = d.getMinutes().toString().padStart(2,'0');
    this.time = `${hh}:${mm}`;
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  openTextEditor() { this.wm.createWindow('text-editor', { title: 'Text Editor' }); this.menuOpen = false; }
  toggleWindow(w: OsWindow) { this.wm.toggleMinimize(w.id); }
  openMap() { this.wm.createWindow('map', { title: 'Map' }); this.menuOpen = false; }
  openSettings() { this.wm.createWindow('settings', { title: 'Settings', rect: { left: 150, top: 150, width: 520, height: 360 } }); this.menuOpen = false; }
  openTodo() { this.wm.createWindow('todo', { title: 'To‑Do', rect: { left: 200, top: 120, width: 720, height: 520 } }); this.menuOpen = false; }
  openClock() { this.wm.createWindow('clock', { title: 'Clock', rect: { left: 240, top: 160, width: 520, height: 320 } }); this.menuOpen = false; }
  openDocs() { this.wm.createWindow('docs', { title: 'Documentation', rect: { left: 200, top: 200, width: 820, height: 560 } }); this.menuOpen = false; }
}
