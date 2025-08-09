import { Injectable } from '@angular/core';

export type ThemeName = 'neutral' | 'ocean' | 'slate' | 'emerald' | 'rose' | 'violet' | 'light' | 'sand' | 'sky' | 'mint' | 'paper';

type Vars = Record<string, string>;

const THEMES: Record<ThemeName, Vars> = {
  neutral: {
    '--bg': '#121416',
    '--panel': '#1a1d21',
    '--panel-2': '#23262b',
    '--panel-3': '#2c3036',
    '--accent': '#9aa0a6',
    '--text': '#e6e6e6',
    '--text-dim': '#a1a1aa',
    '--winbtn-min-bg': '#2c3036',
    '--winbtn-min-fg': '#e6e6e6',
    '--winbtn-min-border': 'rgba(255,255,255,0.14)',
    '--winbtn-max-bg': '#2c3036',
    '--winbtn-max-fg': '#e6e6e6',
    '--winbtn-max-border': 'rgba(255,255,255,0.14)',
    '--winbtn-close-bg': '#b23c3c',
    '--winbtn-close-fg': '#ffffff',
    '--winbtn-close-border': '#c25454',
  },
  ocean: {
    '--bg': '#0f172a',
    '--panel': '#111827',
    '--panel-2': '#1f2937',
    '--panel-3': '#374151',
    '--accent': '#60a5fa',
    '--text': '#e5e7eb',
    '--text-dim': '#9ca3af',
    '--winbtn-min-bg': '#374151',
    '--winbtn-min-fg': '#e5e7eb',
    '--winbtn-min-border': 'rgba(255,255,255,0.14)',
    '--winbtn-max-bg': '#374151',
    '--winbtn-max-fg': '#e5e7eb',
    '--winbtn-max-border': 'rgba(255,255,255,0.14)',
    '--winbtn-close-bg': '#ef4444',
    '--winbtn-close-fg': '#ffffff',
    '--winbtn-close-border': '#f87171',
  },
  slate: {
    '--bg': '#0f1115',
    '--panel': '#14181e',
    '--panel-2': '#1c222b',
    '--panel-3': '#27303a',
    '--accent': '#94a3b8',
    '--text': '#e7e9ec',
    '--text-dim': '#9aa3ad',
    '--winbtn-min-bg': '#27303a', '--winbtn-min-fg': '#e7e9ec', '--winbtn-min-border': 'rgba(255,255,255,0.14)',
    '--winbtn-max-bg': '#27303a', '--winbtn-max-fg': '#e7e9ec', '--winbtn-max-border': 'rgba(255,255,255,0.14)',
    '--winbtn-close-bg': '#d04848', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#e46a6a',
  },
  emerald: {
    '--bg': '#0c1512',
    '--panel': '#101c19',
    '--panel-2': '#132520',
    '--panel-3': '#183029',
    '--accent': '#34d399',
    '--text': '#e6f6ef',
    '--text-dim': '#a7d8c4',
    '--winbtn-min-bg': '#183029', '--winbtn-min-fg': '#e6f6ef', '--winbtn-min-border': 'rgba(255,255,255,0.14)',
    '--winbtn-max-bg': '#183029', '--winbtn-max-fg': '#e6f6ef', '--winbtn-max-border': 'rgba(255,255,255,0.14)',
    '--winbtn-close-bg': '#e25555', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f07b7b',
  },
  rose: {
    '--bg': '#190e12',
    '--panel': '#201318',
    '--panel-2': '#2a1820',
    '--panel-3': '#341d28',
    '--accent': '#fb7185',
    '--text': '#fde8ec',
    '--text-dim': '#f5b6c0',
    '--winbtn-min-bg': '#341d28', '--winbtn-min-fg': '#ffffff', '--winbtn-min-border': 'rgba(255,255,255,0.16)',
    '--winbtn-max-bg': '#341d28', '--winbtn-max-fg': '#ffffff', '--winbtn-max-border': 'rgba(255,255,255,0.16)',
    '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f87171',
  },
  violet: {
    '--bg': '#110f1a',
    '--panel': '#171427',
    '--panel-2': '#1f1a35',
    '--panel-3': '#2a2347',
    '--accent': '#a78bfa',
    '--text': '#ece8ff',
    '--text-dim': '#cfc4ff',
    '--winbtn-min-bg': '#2a2347', '--winbtn-min-fg': '#ece8ff', '--winbtn-min-border': 'rgba(255,255,255,0.14)',
    '--winbtn-max-bg': '#2a2347', '--winbtn-max-fg': '#ece8ff', '--winbtn-max-border': 'rgba(255,255,255,0.14)',
    '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f87171',
  },
  light: {
    '--bg': '#f3f4f6',
    '--panel': '#ffffff',
    '--panel-2': '#f3f4f6',
    '--panel-3': '#e5e7eb',
    '--accent': '#2563eb',
    '--text': '#111827',
    '--text-dim': '#374151',
    '--winbtn-min-bg': '#e5e7eb', '--winbtn-min-fg': '#111827', '--winbtn-min-border': '#cbd5e1',
    '--winbtn-max-bg': '#e5e7eb', '--winbtn-max-fg': '#111827', '--winbtn-max-border': '#cbd5e1',
    '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#fca5a5',
  },
  sand: {
    '--bg': '#faf7f2',
    '--panel': '#ffffff',
    '--panel-2': '#f3efe6',
    '--panel-3': '#e7dfcf',
    '--accent': '#d4a373',
    '--text': '#2b2b2b',
    '--text-dim': '#595959',
    '--winbtn-min-bg': '#e7dfcf', '--winbtn-min-fg': '#2b2b2b', '--winbtn-min-border': '#d6cbb6',
    '--winbtn-max-bg': '#e7dfcf', '--winbtn-max-fg': '#2b2b2b', '--winbtn-max-border': '#d6cbb6',
    '--winbtn-close-bg': '#e25555', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f07b7b',
  },
  sky: {
    '--bg': '#f0f9ff',
    '--panel': '#ffffff',
    '--panel-2': '#e0f2fe',
    '--panel-3': '#bae6fd',
    '--accent': '#0284c7',
    '--text': '#0f172a',
    '--text-dim': '#334155',
    '--winbtn-min-bg': '#e0f2fe', '--winbtn-min-fg': '#0f172a', '--winbtn-min-border': '#93c5fd',
    '--winbtn-max-bg': '#e0f2fe', '--winbtn-max-fg': '#0f172a', '--winbtn-max-border': '#93c5fd',
    '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f87171',
  },
  mint: {
    '--bg': '#ecfdf5',
    '--panel': '#ffffff',
    '--panel-2': '#d1fae5',
    '--panel-3': '#a7f3d0',
    '--accent': '#10b981',
    '--text': '#0f172a',
    '--text-dim': '#065f46',
    '--winbtn-min-bg': '#d1fae5', '--winbtn-min-fg': '#0f172a', '--winbtn-min-border': '#86efac',
    '--winbtn-max-bg': '#d1fae5', '--winbtn-max-fg': '#0f172a', '--winbtn-max-border': '#86efac',
    '--winbtn-close-bg': '#dc2626', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f87171',
  },
  paper: {
    '--bg': '#f8fafc',
    '--panel': '#ffffff',
    '--panel-2': '#f1f5f9',
    '--panel-3': '#e2e8f0',
    '--accent': '#0ea5e9',
    '--text': '#0f172a',
    '--text-dim': '#334155',
    '--winbtn-min-bg': '#e2e8f0', '--winbtn-min-fg': '#0f172a', '--winbtn-min-border': '#cbd5e1',
    '--winbtn-max-bg': '#e2e8f0', '--winbtn-max-fg': '#0f172a', '--winbtn-max-border': '#cbd5e1',
    '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f87171',
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'os-desktop:theme';
  private overridesKey = 'os-desktop:theme-overrides';
  private controlsKey = 'os-desktop:controls-theme';
  private current: ThemeName = 'neutral';
  private controlsModeKey = 'os-desktop:controls-mode';

  init() {
    const saved = (localStorage.getItem(this.storageKey) as ThemeName | null) ?? 'sand';
    // Load controls mode and theme before applying theme so auto mapping can take effect
    const mode = (localStorage.getItem(this.controlsModeKey) as 'auto' | 'user') || 'auto';
    localStorage.setItem(this.controlsModeKey, mode);
    const ctrl = localStorage.getItem(this.controlsKey) || 'system';
    // Apply base theme
    this.setTheme(saved);
    // Apply saved window controls theme without flipping mode
    this.setControlsTheme(ctrl);
  }

  getTheme(): ThemeName { return this.current; }

  setTheme(name: ThemeName) {
    const vars = THEMES[name] ?? THEMES.neutral;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    this.current = name;
    localStorage.setItem(this.storageKey, name);
    // re-apply overrides after base theme
    this.applyOverrides();
    // If controls are in auto mode, select a matching preset
    if (this.getControlsMode() === 'auto') {
      this.setControlsTheme(this.recommendedControlsFor(name));
    }
  }

  getAvailableThemes(): { id: ThemeName; label: string }[] {
    return [
      { id: 'neutral', label: 'Neutral (Dark)' },
      { id: 'ocean', label: 'Ocean (Blue)' },
      { id: 'slate', label: 'Slate' },
      { id: 'emerald', label: 'Emerald' },
      { id: 'rose', label: 'Rose' },
      { id: 'violet', label: 'Violet' },
      { id: 'light', label: 'Light' },
      { id: 'sand', label: 'Sand' },
      { id: 'sky', label: 'Sky' },
      { id: 'mint', label: 'Mint' },
      { id: 'paper', label: 'Paper' },
    ];
  }

  // Overrides management
  private getOverrides(): Vars {
    try { return JSON.parse(localStorage.getItem(this.overridesKey) || '{}'); } catch { return {}; }
  }
  private setOverrides(vars: Vars) {
    localStorage.setItem(this.overridesKey, JSON.stringify(vars));
  }
  private applyOverrides() {
    const root = document.documentElement;
    const overrides = this.getOverrides();
    Object.entries(overrides).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  getWinButtonStyles() {
    const base = THEMES[this.current];
    const ov = this.getOverrides();
    const val = (k: string) => ov[k] ?? base[k];
    return {
      min: { bg: val('--winbtn-min-bg'), fg: val('--winbtn-min-fg'), border: val('--winbtn-min-border') },
      max: { bg: val('--winbtn-max-bg'), fg: val('--winbtn-max-fg'), border: val('--winbtn-max-border') },
      close: { bg: val('--winbtn-close-bg'), fg: val('--winbtn-close-fg'), border: val('--winbtn-close-border') },
    };
  }

  setWinButtonStyles(partial: { min?: { bg?: string; fg?: string; border?: string }; max?: { bg?: string; fg?: string; border?: string }; close?: { bg?: string; fg?: string; border?: string } }) {
    const map: Record<string, string | undefined> = {
      '--winbtn-min-bg': partial.min?.bg,
      '--winbtn-min-fg': partial.min?.fg,
      '--winbtn-min-border': partial.min?.border,
      '--winbtn-max-bg': partial.max?.bg,
      '--winbtn-max-fg': partial.max?.fg,
      '--winbtn-max-border': partial.max?.border,
      '--winbtn-close-bg': partial.close?.bg,
      '--winbtn-close-fg': partial.close?.fg,
      '--winbtn-close-border': partial.close?.border,
    };
    const ov = this.getOverrides();
    Object.entries(map).forEach(([k, v]) => {
      if (v === undefined) return;
      ov[k] = v;
      document.documentElement.style.setProperty(k, v);
    });
    this.setOverrides(ov);
  }

  resetWinButton(type: 'min' | 'max' | 'close') {
    const keys = {
      min: ['--winbtn-min-bg', '--winbtn-min-fg', '--winbtn-min-border'],
      max: ['--winbtn-max-bg', '--winbtn-max-fg', '--winbtn-max-border'],
      close: ['--winbtn-close-bg', '--winbtn-close-fg', '--winbtn-close-border'],
    }[type];
    const ov = this.getOverrides();
    let changed = false;
    for (const k of keys) {
      if (k in ov) { delete ov[k]; changed = true; }
      // Reset to theme default immediately
      const def = THEMES[this.current][k];
      document.documentElement.style.setProperty(k, def);
    }
    if (changed) this.setOverrides(ov);
  }

  private clearWinButtonOverridesAll() {
    const ov = this.getOverrides();
    const keys = [
      '--winbtn-min-bg','--winbtn-min-fg','--winbtn-min-border',
      '--winbtn-max-bg','--winbtn-max-fg','--winbtn-max-border',
      '--winbtn-close-bg','--winbtn-close-fg','--winbtn-close-border'
    ];
    let changed = false;
    for (const k of keys) {
      if (k in ov) { delete ov[k]; changed = true; }
      const def = THEMES[this.current][k];
      document.documentElement.style.setProperty(k, def);
    }
    if (changed) this.setOverrides(ov);
  }

  // Predefined control themes
  private CONTROL_THEMES: Record<string, Vars> = {
    // Use current base theme values
    system: {},
    // Subtle gray controls, red close
    steel: {
      '--winbtn-min-bg': '#2f343b', '--winbtn-min-fg': '#e6e6e6', '--winbtn-min-border': 'rgba(255,255,255,0.14)',
      '--winbtn-max-bg': '#2f343b', '--winbtn-max-fg': '#e6e6e6', '--winbtn-max-border': 'rgba(255,255,255,0.14)',
      '--winbtn-close-bg': '#b23c3c', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#c25454',
    },
    // Lighter buttons for darker themes
    light: {
      '--winbtn-min-bg': '#3a3f46', '--winbtn-min-fg': '#ffffff', '--winbtn-min-border': '#575e66',
      '--winbtn-max-bg': '#3a3f46', '--winbtn-max-fg': '#ffffff', '--winbtn-max-border': '#575e66',
      '--winbtn-close-bg': '#dc4b4b', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#f07272',
    },
    // High contrast
    contrast: {
      '--winbtn-min-bg': '#000000', '--winbtn-min-fg': '#ffffff', '--winbtn-min-border': '#ffffff',
      '--winbtn-max-bg': '#000000', '--winbtn-max-fg': '#ffffff', '--winbtn-max-border': '#ffffff',
      '--winbtn-close-bg': '#ff0000', '--winbtn-close-fg': '#ffffff', '--winbtn-close-border': '#ff8080',
    },
    // macOS-like traffic lights feel (monotone shapes, colored bg)
    traffic: {
      '--winbtn-min-bg': '#fbbf24', '--winbtn-min-fg': '#1a1a1a', '--winbtn-min-border': '#f59e0b',
      '--winbtn-max-bg': '#10b981', '--winbtn-max-fg': '#0b0b0b', '--winbtn-max-border': '#059669',
      '--winbtn-close-bg': '#ef4444', '--winbtn-close-fg': '#0b0b0b', '--winbtn-close-border': '#dc2626',
    }
  };

  getControlThemes(): { id: string; label: string }[] {
    return [
      { id: 'system', label: 'Use Theme Default' },
      { id: 'steel', label: 'Steel' },
      { id: 'light', label: 'Light Buttons' },
      { id: 'contrast', label: 'High Contrast' },
      { id: 'traffic', label: 'Traffic Lights' },
    ];
  }

  getCurrentControlsTheme(): string {
    return localStorage.getItem(this.controlsKey) || 'system';
  }

  getControlsMode(): 'auto' | 'user' {
    const m = localStorage.getItem(this.controlsModeKey) as 'auto' | 'user' | null;
    return m === 'user' ? 'user' : 'auto';
  }
  private setControlsMode(mode: 'auto' | 'user') {
    localStorage.setItem(this.controlsModeKey, mode);
  }

  setControlsTheme(id: string, source: 'auto' | 'user' = 'auto') {
    const vars = this.CONTROL_THEMES[id];
    if (!vars || id === 'system') {
      // Clear overrides to theme defaults
      this.clearWinButtonOverridesAll();
      localStorage.setItem(this.controlsKey, 'system');
      if (source === 'user') this.setControlsMode('user');
      return;
    }
    // Apply preset variables as overrides
    const ov = this.getOverrides();
    Object.entries(vars).forEach(([k, v]) => {
      ov[k] = v;
      document.documentElement.style.setProperty(k, v);
    });
    this.setOverrides(ov);
    localStorage.setItem(this.controlsKey, id);
    if (source === 'user') this.setControlsMode('user');
  }

  private recommendedControlsFor(theme: ThemeName): string {
    switch (theme) {
      case 'ocean': return 'light';
      case 'emerald': return 'light';
      case 'rose': return 'light';
      case 'violet': return 'light';
      case 'slate': return 'steel';
      case 'light': return 'system';
      case 'sand': return 'system';
      case 'sky': return 'system';
      case 'mint': return 'system';
      case 'paper': return 'system';
      case 'neutral':
      default:
        return 'steel';
    }
  }
}
