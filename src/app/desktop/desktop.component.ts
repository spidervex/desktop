import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../window/window.component';
import { WindowManagerService } from '../services/window-manager.service';
import { OsWindow } from '../models/window.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  template: `
    <div class="desktop-icons">
      <button class="desktop-icon" (click)="openTextEditor()" title="Text Editor">
        <img src="assets/text-editor.svg" alt="">
        <span>Text Editor</span>
      </button>
      <button class="desktop-icon" (click)="openMap()" title="Map">
        <img src="assets/map.svg" alt="">
        <span>Map</span>
      </button>
      <button class="desktop-icon" (click)="openSettings()" title="Settings">
        <img src="assets/settings.svg" alt="">
        <span>Settings</span>
      </button>
      <button class="desktop-icon" (click)="openTodo()" title="To‑Do">
        <img src="assets/todo.svg" alt="">
        <span>To‑Do</span>
      </button>
    </div>
    <ng-container *ngFor="let w of windows; trackBy: trackById">
      <app-window *ngIf="w.state !== 'minimized'" [win]="w"></app-window>
    </ng-container>
  `,
})
export class DesktopComponent implements OnInit, OnDestroy {
  private wm = inject(WindowManagerService);
  private sub?: Subscription;
  windows: OsWindow[] = [];

  ngOnInit(): void {
    this.sub = this.wm.windows$.subscribe(ws => (this.windows = ws));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openTextEditor() {
    this.wm.createWindow('text-editor', { title: 'Text Editor' });
  }

  trackById(index: number, w: OsWindow) { return w.id; }

  openMap() {
    this.wm.createWindow('map', { title: 'Map', rect: { left: 120, top: 120, width: 720, height: 480 } });
  }

  openSettings() {
    this.wm.createWindow('settings', { title: 'Settings', rect: { left: 180, top: 180, width: 520, height: 360 } });
  }

  openTodo() {
    this.wm.createWindow('todo', { title: 'To‑Do', rect: { left: 220, top: 220, width: 720, height: 520 } });
  }
}
