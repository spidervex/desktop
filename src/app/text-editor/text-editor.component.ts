import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-wrap" (click)="closeMenus()">
      <!-- Menu bar -->
      <div class="menubar" (click)="$event.stopPropagation()">
        <div class="menu">
          <button class="menu-btn" (click)="toggleMenu('file')">File ▾</button>
          <div class="menu-dropdown" *ngIf="openMenu==='file'">
            <button class="menu-item" (click)="newDoc()">New</button>
            <button class="menu-item" (click)="save()">Save</button>
            <button class="menu-item" (click)="saveAs()">Save As…</button>
            <div class="separator"></div>
            <div class="menu-title">Open</div>
            <div class="menu-empty" *ngIf="files.length===0">No saved files</div>
            <button class="menu-item" *ngFor="let f of files" (click)="openDoc(f)">{{ f }}</button>
            <div class="separator"></div>
            <button class="menu-item danger" (click)="deleteDoc()" [disabled]="!filename">Delete</button>
          </div>
        </div>
        <div class="menu filename-area">
          <input class="filename" [(ngModel)]="filename" placeholder="untitled" (input)="touch()" />
        </div>
      </div>

      <!-- Editor surface -->
      <div class="console-frame">
        <div class="console-inner">
          <textarea class="editor-textarea" [(ngModel)]="content" (input)="markDirty()" spellcheck="false"></textarea>
        </div>
      </div>

      <!-- Status bar -->
      <div class="statusbar">
        <div class="status-left">{{ filename || 'untitled' }}</div>
        <div class="status-right">{{ savedLabel }}</div>
      </div>
    </div>
  `,
  styles: [
    `:host { display:block; height:100%; }
     .editor-wrap { height:100%; display:flex; flex-direction:column; gap:8px; }
     /* Menubar */
     .menubar { display:flex; align-items:center; gap:8px; background: var(--panel-2); border:1px solid rgba(0,0,0,0.25); border-radius:8px; padding:4px 6px; }
     .menu { position:relative; }
     .menu-btn { background: transparent; color: var(--text); border: 1px solid transparent; border-radius:6px; padding:6px 10px; cursor:pointer; }
     .menu-btn:hover { background: rgba(0,0,0,0.15); }
     .menu-dropdown { position:absolute; top: 32px; left: 0; min-width: 220px; background: var(--panel); border:1px solid rgba(0,0,0,0.25); border-radius:8px; box-shadow: var(--shadow); padding:6px; z-index: 100; display:flex; flex-direction:column; gap:4px; max-height: 260px; overflow:auto; }
     .menu-item { text-align:left; background: transparent; color: var(--text); border:1px solid transparent; border-radius:6px; padding:6px 8px; cursor:pointer; }
     .menu-item:hover { background: rgba(0,0,0,0.15); }
     .menu-item.danger { color:#fff; background:#b23c3c; border-color:#c25454; }
     .menu-title { color: var(--text-dim); font-size:12px; padding:4px 6px 0 6px; }
     .menu-empty { color: var(--text-dim); font-size:12px; padding:0 6px 4px 6px; }
     .separator { height:1px; background: rgba(0,0,0,0.25); margin:4px 0; }
     .filename-area { margin-left:auto; }
     .filename { background: var(--panel); color: var(--text); border:1px solid rgba(0,0,0,0.25); border-radius:8px; padding:6px 8px; min-width:180px; }

     /* Console surface */
     .console-frame { flex:1; min-height:0; background: #0b0d10; border:1px solid rgba(0,0,0,0.6); border-radius:10px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 10px 40px rgba(0,0,0,0.35); overflow:hidden; }
     .console-inner { position:relative; height:100%; width:100%;
        background-image: repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 22px);
        }
     .editor-textarea { width:100%; height:100%; resize:none; background: transparent; color:#d1e7ff; border:none; outline:none; padding:14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:14px; line-height:22px; caret-color: var(--accent); }

     /* Status bar */
     .statusbar { display:flex; align-items:center; justify-content:space-between; color: var(--text-dim); font-size:12px; padding:4px 8px; border:1px solid rgba(0,0,0,0.25); border-radius:8px; background: var(--panel-2); }
    `
  ]
})
export class TextEditorComponent {
  @Input({ required: true }) storageKey!: string;

  content = '';
  filename = '';
  savedLabel = '';
  openMenu: 'file' | null = null;
  files: string[] = [];
  private dirty = false;

  private indexKey = 'text-editor:index';
  private docKey = (name: string) => `text-editor:doc:${name}`;

  ngOnInit(): void {
    // Load any legacy content seeded by window-specific storageKey
    const legacy = localStorage.getItem(this.storageKey);
    if (legacy && legacy.length && !this.content) {
      this.content = legacy;
      this.savedLabel = 'Unsaved changes';
      this.dirty = true;
    }
    this.refreshIndex();
  }

  private getIndex(): string[] {
    try { return JSON.parse(localStorage.getItem(this.indexKey) || '[]'); } catch { return []; }
  }
  private setIndex(list: string[]) {
    localStorage.setItem(this.indexKey, JSON.stringify(Array.from(new Set(list)).sort()));
  }
  private refreshIndex() { this.files = this.getIndex(); }

  markDirty() { this.dirty = true; this.savedLabel = 'Unsaved changes'; }
  touch() { this.savedLabel = ''; }

  save() {
    const name = (this.filename || 'untitled').trim();
    if (!name) return;
    const exists = this.getIndex().includes(name);
    if (!exists) this.setIndex([...this.getIndex(), name]);
    localStorage.setItem(this.docKey(name), this.content ?? '');
    this.filename = name;
    this.dirty = false;
    this.savedLabel = `Saved '${name}'`;
    this.refreshIndex();
    setTimeout(() => { if (!this.dirty) this.savedLabel = ''; }, 1200);
  }

  saveAs() {
    const name = prompt('Save as filename:', this.filename || 'untitled')?.trim();
    if (!name) return;
    this.filename = name;
    this.save();
  }

  openDoc(name: string) {
    const data = localStorage.getItem(this.docKey(name));
    if (data == null) return;
    this.filename = name;
    this.content = data;
    this.dirty = false;
    this.savedLabel = `Opened '${name}'`;
    this.openMenu = null;
    setTimeout(() => { if (!this.dirty) this.savedLabel = ''; }, 1200);
  }

  deleteDoc(name?: string) {
    const toDelete = (name || this.filename).trim();
    if (!toDelete) return;
    if (!confirm(`Delete '${toDelete}'?`)) return;
    localStorage.removeItem(this.docKey(toDelete));
    this.setIndex(this.getIndex().filter(n => n !== toDelete));
    if (this.filename === toDelete) {
      this.filename = '';
      this.content = '';
      this.dirty = false;
      this.savedLabel = 'Deleted';
    }
    this.refreshIndex();
  }

  newDoc() {
    this.filename = '';
    this.content = '';
    this.dirty = false;
    this.savedLabel = 'New document';
  }

  toggleMenu(which: 'file') {
    this.openMenu = this.openMenu === which ? null : which;
    if (this.openMenu === 'file') this.refreshIndex();
  }
  closeMenus() { this.openMenu = null; }
}
