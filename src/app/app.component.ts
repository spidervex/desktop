import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopComponent } from './desktop/desktop.component';
import { TaskbarComponent } from './taskbar/taskbar.component';
import { WindowManagerService } from './services/window-manager.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DesktopComponent, TaskbarComponent],
  template: `
    <div class="desktop">
      <app-desktop />
      <app-taskbar />
    </div>
  `,
})
export class AppComponent {
  private wm = inject(WindowManagerService);
  private theme = inject(ThemeService);

  constructor() {
    this.theme.init();
  }
}
