import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OsWindow, WindowRect } from '../models/window.model';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private windowsSubject = new BehaviorSubject<OsWindow[]>([]);
  windows$ = this.windowsSubject.asObservable();

  private zCounter = 10;
  private idCounter = 1;

  get windows(): OsWindow[] {
    return this.windowsSubject.value;
  }

  private update(windows: OsWindow[]) {
    this.windowsSubject.next([...windows]);
  }

  createWindow(appType: OsWindow['appType'], init?: Partial<OsWindow>): OsWindow {
    const rect: WindowRect = init?.rect ?? {
      left: 60 + 20 * (this.windows.length % 5),
      top: 60 + 20 * (this.windows.length % 5),
      width: 600,
      height: 400,
    };
    const win: OsWindow = {
      id: this.idCounter++,
      title: init?.title ?? (appType === 'text-editor' ? 'Text Editor' : 'Window'),
      appType,
      rect,
      prevRect: null,
      zIndex: ++this.zCounter,
      state: 'normal',
    };
    this.update([...this.windows, win]);
    return win;
  }

  closeWindow(id: number) {
    this.update(this.windows.filter(w => w.id !== id));
  }

  bringToFront(id: number) {
    this.zCounter++;
    this.update(this.windows.map(w => (w.id === id ? { ...w, zIndex: this.zCounter } : w)));
  }

  setRect(id: number, rect: Partial<WindowRect>) {
    this.update(this.windows.map(w => (w.id === id ? { ...w, rect: { ...w.rect, ...rect } } : w)));
  }

  minimize(id: number) {
    this.update(this.windows.map(w => (w.id === id ? { ...w, state: 'minimized' } : w)));
  }

  toggleMinimize(id: number) {
    this.update(this.windows.map(w => (w.id === id ? { ...w, state: w.state === 'minimized' ? 'normal' : 'minimized' } : w)));
    if (this.windows.find(w => w.id === id)?.state !== 'minimized') this.bringToFront(id);
  }

  toggleMaximize(id: number) {
    this.update(this.windows.map(w => {
      if (w.id !== id) return w;
      if (w.state !== 'maximized') {
        return { ...w, prevRect: { ...w.rect }, state: 'maximized' };
      } else {
        return { ...w, rect: w.prevRect ?? w.rect, prevRect: null, state: 'normal' };
      }
    }));
    this.bringToFront(id);
  }
}

