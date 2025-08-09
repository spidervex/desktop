import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-toolbar">
      <input class="btn" style="min-width:160px" [(ngModel)]="filename" placeholder="untitled" (input)="touch()" />
      <button class="btn" (click)="save()">Save</button>
      <button class="btn" (click)="saveAs()">Save As</button>
      <button class="btn" (click)="toggleOpenPanel()">Open</button>
      <button class="btn" (click)="newDoc()">New</button>
      <button class="btn" (click)="deleteDoc()" [disabled]="!filename">Delete</button>
      <span style="color:var(--text-dim); font-size:12px; margin-left:8px;">{{ savedLabel }}</span>
    </div>

    <div *ngIf="openPanel" style="background:var(--panel-2); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px; margin:8px 0; max-height:160px; overflow:auto;">
      <div style="color:var(--text-dim); font-size:12px; margin-bottom:6px;">Saved files</div>
      <div *ngIf="files.length === 0" style="color:var(--text-dim); font-size:12px;">No saved files</div>
      <div *ngFor="let f of files" style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
        <button class="btn" style="flex:1; text-align:left;" (click)="openDoc(f)">{{ f }}</button>
        <button class="btn" (click)="deleteDoc(f)">Delete</button>
      </div>
    </div>

    <textarea class="editor-textarea" [(ngModel)]="content" (input)="markDirty()"></textarea>
  `,
})
export class TextEditorComponent {
  @Input({ required: true }) storageKey!: string;

  content = '';
  filename = '';
  savedLabel = '';
  openPanel = false;
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
    this.openPanel = false;
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

  toggleOpenPanel() {
    this.openPanel = !this.openPanel;
    if (this.openPanel) this.refreshIndex();
  }
}
