import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsWindow } from '../models/window.model';
import { WindowManagerService } from '../services/window-manager.service';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { MapComponent } from '../map/map.component';
import { SettingsComponent } from '../settings/settings.component';
import { TodoComponent } from '../todo/todo.component';

type ResizeEdge = 'n'|'s'|'w'|'e'|'nw'|'ne'|'sw'|'se'|null;

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, TextEditorComponent, MapComponent, SettingsComponent, TodoComponent],
  template: `
    <div class="window" [class.maximized]="win.state==='maximized'"
         [ngStyle]="{ left: win.rect.left+'px', top: win.rect.top+'px', width: win.rect.width+'px', height: win.rect.height+'px', zIndex: win.zIndex }"
         (mousedown)="focus()">
      <div class="titlebar" (dblclick)="toggleMaximize()" (mousedown)="startDrag($event)">
        <div class="title">{{ win.title }}</div>
        <button class="icon-btn min-btn" (click)="minimize($event)" title="Minimize">&#x2212;</button>
        <button class="icon-btn max-btn" (click)="toggleMaximize($event)" title="Maximize">&#x25A1;</button>
        <button class="icon-btn close-btn" (click)="close($event)" title="Close">&#x2715;</button>
      </div>
      <div class="content">
        <ng-container [ngSwitch]="win.appType">
          <app-text-editor *ngSwitchCase="'text-editor'" [storageKey]="'text-editor-'+win.id"></app-text-editor>
          <app-map *ngSwitchCase="'map'"></app-map>
          <app-settings *ngSwitchCase="'settings'"></app-settings>
          <app-todo *ngSwitchCase="'todo'"></app-todo>
        </ng-container>
      </div>

      <!-- Resizers -->
      <div class="resizer n" (mousedown)="startResize($event, 'n')"></div>
      <div class="resizer s" (mousedown)="startResize($event, 's')"></div>
      <div class="resizer w" (mousedown)="startResize($event, 'w')"></div>
      <div class="resizer e" (mousedown)="startResize($event, 'e')"></div>
      <div class="resizer nw" (mousedown)="startResize($event, 'nw')"></div>
      <div class="resizer ne" (mousedown)="startResize($event, 'ne')"></div>
      <div class="resizer sw" (mousedown)="startResize($event, 'sw')"></div>
      <div class="resizer se" (mousedown)="startResize($event, 'se')"></div>
    </div>
  `,
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input({ required: true }) win!: OsWindow;
  private wm = inject(WindowManagerService);
  private el = inject(ElementRef<HTMLElement>);

  private dragging = false;
  private dragOffset = { x: 0, y: 0 };

  private resizing: ResizeEdge = null;
  private startRect = { left: 0, top: 0, width: 0, height: 0 };
  private startMouse = { x: 0, y: 0 };

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  focus() { this.wm.bringToFront(this.win.id); }

  startDrag(ev: MouseEvent) {
    if (this.win.state === 'maximized') return;
    this.dragging = true;
    this.focus();
    this.dragOffset = { x: ev.clientX - this.win.rect.left, y: ev.clientY - this.win.rect.top };
    ev.preventDefault();
  }

  startResize(ev: MouseEvent, edge: ResizeEdge) {
    if (this.win.state === 'maximized') return;
    this.resizing = edge;
    this.focus();
    this.startRect = { ...this.win.rect };
    this.startMouse = { x: ev.clientX, y: ev.clientY };
    ev.preventDefault();
    ev.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMove(ev: MouseEvent) {
    if (this.dragging) {
      const left = ev.clientX - this.dragOffset.x;
      const top = ev.clientY - this.dragOffset.y;
      this.wm.setRect(this.win.id, { left, top });
    } else if (this.resizing) {
      const dx = ev.clientX - this.startMouse.x;
      const dy = ev.clientY - this.startMouse.y;
      let { left, top, width, height } = this.startRect;
      const minW = 280; const minH = 160;
      switch (this.resizing) {
        case 'e': width = Math.max(minW, this.startRect.width + dx); break;
        case 's': height = Math.max(minH, this.startRect.height + dy); break;
        case 'w': left = this.startRect.left + dx; width = Math.max(minW, this.startRect.width - dx); break;
        case 'n': top = this.startRect.top + dy; height = Math.max(minH, this.startRect.height - dy); break;
        case 'se': width = Math.max(minW, this.startRect.width + dx); height = Math.max(minH, this.startRect.height + dy); break;
        case 'ne': width = Math.max(minW, this.startRect.width + dx); top = this.startRect.top + dy; height = Math.max(minH, this.startRect.height - dy); break;
        case 'sw': left = this.startRect.left + dx; width = Math.max(minW, this.startRect.width - dx); height = Math.max(minH, this.startRect.height + dy); break;
        case 'nw': left = this.startRect.left + dx; width = Math.max(minW, this.startRect.width - dx); top = this.startRect.top + dy; height = Math.max(minH, this.startRect.height - dy); break;
      }
      this.wm.setRect(this.win.id, { left, top, width, height });
    }
  }

  @HostListener('document:mouseup')
  onUp() {
    this.dragging = false;
    this.resizing = null;
  }

  minimize(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.wm.minimize(this.win.id);
  }
  toggleMaximize(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.wm.toggleMaximize(this.win.id);
  }
  close(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.wm.closeWindow(this.win.id);
  }
}
