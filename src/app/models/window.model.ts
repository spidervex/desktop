export type WindowState = 'normal' | 'maximized' | 'minimized';

export interface WindowRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface OsWindow {
  id: number;
  title: string;
  appType: 'text-editor' | 'map' | 'settings';
  rect: WindowRect;
  prevRect?: WindowRect | null;
  zIndex: number;
  state: WindowState;
}
