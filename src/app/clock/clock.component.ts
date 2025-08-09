import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="clock-wrap">
      <div class="header">
        <div class="title">Clock</div>
        <div class="actions">
          <button class="btn" (click)="setUnix()">Set Unix Time</button>
          <button class="btn" (click)="reset()" [disabled]="overrideUnix===null">Reset</button>
        </div>
      </div>
      <div class="cards">
        <div class="card">
          <div class="label">Local Time</div>
          <div class="value">{{ localTime }}</div>
        </div>
        <div class="card">
          <div class="label">UTC Time</div>
          <div class="value">{{ utcTime }}</div>
        </div>
        <div class="card">
          <div class="label">Unix Time</div>
          <div class="value monospace">{{ unixSeconds }}</div>
        </div>
      </div>
      <div *ngIf="overrideUnix!==null" class="info">Showing overridden time</div>
    </div>
  `,
  styles: [
    `:host { display:block; height:100%; }
     .clock-wrap { height:100%; display:flex; flex-direction:column; gap:12px; overflow:hidden; }
     .header { display:flex; align-items:center; justify-content:space-between; }
     .title { font-weight:600; }
     .actions { display:flex; gap:8px; }
     .cards { display:flex; flex-direction:column; gap:12px; flex:1; overflow-y:auto; overflow-x:hidden; max-width:100%; }
     .card { width:100%; max-width:100%; box-sizing:border-box; }
     .card { background: var(--panel-2); border:1px solid rgba(0,0,0,0.2); border-radius:12px; padding:12px; }
     .label { color: var(--text-dim); font-size:12px; margin-bottom:6px; }
     .value { font-size:22px; letter-spacing:0.3px; word-break: break-word; }
     .monospace { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
     .info { color: var(--text-dim); font-size:12px; }
    `
  ]
})
export class ClockComponent implements OnDestroy {
  private sub?: Subscription;
  overrideUnix: number | null = null; // seconds

  localTime = '';
  utcTime = '';
  unixSeconds = 0;

  constructor() {
    this.sub = interval(1000).subscribe(() => this.tick());
    this.tick();
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  private tick() {
    const ms = this.overrideUnix !== null ? this.overrideUnix * 1000 : Date.now();
    const d = new Date(ms);
    this.unixSeconds = Math.floor(ms / 1000);
    this.localTime = d.toLocaleString();
    this.utcTime = d.toUTCString();
  }

  setUnix() {
    const input = prompt('Enter Unix time (seconds or milliseconds):', this.overrideUnix?.toString() ?? '');
    if (input == null) return;
    const raw = input.trim();
    if (!raw) return;
    const n = Number(raw);
    if (!isFinite(n) || n <= 0) return alert('Invalid number');
    const seconds = n > 1e12 ? Math.floor(n / 1000) : Math.floor(n);
    this.overrideUnix = seconds;
    this.tick();
  }

  reset() {
    this.overrideUnix = null;
    this.tick();
  }
}
