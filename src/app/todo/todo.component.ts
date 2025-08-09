import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  category: string;
}

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-wrap">
      <div class="toolbar">
        <div class="left">
          <button class="btn primary" (click)="openNew()">New</button>
        </div>
        <div class="right">
          <input class="input" placeholder="Search" [(ngModel)]="query" />
          <select class="select" [(ngModel)]="filter">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select class="select" [(ngModel)]="categoryFilter">
            <option value="">All categories</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
          <button class="btn" (click)="clearCompleted()" [disabled]="!hasCompleted()">Clear Completed</button>
        </div>
      </div>

      <ul class="list">
        <li class="item" *ngFor="let it of filtered()" [class.completed]="it.completed">
          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="it.completed" (change)="persist()" />
            <span></span>
          </label>
          <input class="title" [(ngModel)]="it.title" (change)="persist()" />
          <select class="select small" [(ngModel)]="it.category" (change)="onCategoryChange(it, $event)">
            <option *ngFor="let c of categories" [ngValue]="c">{{ c }}</option>
            <option value="__new__">+ Add category…</option>
          </select>
          <button class="icon" title="Delete" (click)="remove(it.id)">✕</button>
        </li>
      </ul>

      <div class="footer">
        <div>{{ remainingCount() }} remaining</div>
        <div>Total: {{ items.length }}</div>
      </div>

      <!-- New item modal -->
      <div class="modal-backdrop" *ngIf="showNew" (click)="closeNew()"></div>
      <div class="modal" *ngIf="showNew">
        <div class="modal-title">New To‑Do</div>
        <div class="modal-body">
          <label>Title</label>
          <input class="input" [(ngModel)]="newDraft.title" placeholder="What needs to be done?" />
          <label>Category</label>
          <div class="row">
            <select class="select" [(ngModel)]="newDraft.category" (change)="onNewCategoryChange($event)">
              <option *ngFor="let c of categories" [ngValue]="c">{{ c }}</option>
              <option value="__new__">+ Add category…</option>
            </select>
            <button class="btn" (click)="addCategoryPrompt()">New Category</button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" (click)="closeNew()">Cancel</button>
          <button class="btn primary" (click)="add()" [disabled]="!newDraft.title.trim()">Add</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host { display:block; height:100%; }
     .todo-wrap { height:100%; display:flex; flex-direction:column; gap:10px; position:relative; }
     .toolbar { display:flex; gap:10px; align-items:center; justify-content:space-between; }
     .toolbar .left, .toolbar .right { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
     .input, .select { background: var(--panel-2); color: var(--text); border: 1px solid rgba(0,0,0,0.2); border-radius: 8px; padding: 6px 8px; }
     .select.small { padding: 4px 6px; }
     .btn.primary { background: var(--accent); color: #fff; border: none; }
     .list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; overflow:auto; }
     .item { display:flex; gap:10px; align-items:center; background: var(--panel-2); border:1px solid rgba(0,0,0,0.2); border-radius:10px; padding:10px; }
     .item.completed .title { text-decoration: line-through; opacity: .6; }
     .checkbox { display:grid; place-items:center; }
     .checkbox input { display:none; }
     .checkbox span { width:18px; height:18px; border-radius:5px; border:1px solid rgba(0,0,0,0.35); display:inline-block; position:relative; background: var(--panel-3); }
     .checkbox input:checked + span { background: var(--accent); border-color: var(--accent); }
     .checkbox input:checked + span::after { content:''; position:absolute; left:5px; top:1px; width:5px; height:10px; border:2px solid white; border-top:none; border-left:none; transform: rotate(45deg); }
     .title { flex:1; background: transparent; color: var(--text); border:none; outline:none; font-size:14px; border-bottom:1px dashed transparent; padding:4px 6px; }
     .title:focus { border-bottom-color: rgba(0,0,0,0.2); }
     .icon { background: var(--panel-3); color: var(--text); border:1px solid rgba(0,0,0,0.25); border-radius:6px; width:28px; height:28px; display:grid; place-items:center; }
     .footer { display:flex; justify-content:space-between; color: var(--text-dim); font-size:12px; padding:4px 2px; }
     .modal-backdrop { position:absolute; inset:0; background: rgba(0,0,0,0.5); }
     .modal { position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); width: min(520px, 92%); background: var(--panel); border:1px solid rgba(0,0,0,0.25); border-radius:12px; box-shadow: var(--shadow); display:flex; flex-direction:column; }
     .modal-title { padding:12px 14px; border-bottom:1px solid rgba(0,0,0,0.2); font-weight:600; }
     .modal-body { padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
     .modal-body .row { display:flex; gap:8px; align-items:center; }
     .modal-actions { display:flex; justify-content:flex-end; gap:8px; padding:10px 14px; border-top:1px solid rgba(0,0,0,0.2); }
    `
  ]
})
export class TodoComponent {
  private itemsKey = 'todo:items';
  private catsKey = 'todo:categories';

  items: TodoItem[] = [];
  categories: string[] = ['General', 'Work', 'Personal'];
  filter: Filter = 'all';
  query = '';
  categoryFilter = '';

  showNew = false;
  newDraft: { title: string; category: string } = { title: '', category: 'General' };

  ngOnInit(): void {
    this.load();
  }

  load() {
    try { this.items = JSON.parse(localStorage.getItem(this.itemsKey) || '[]'); } catch { this.items = []; }
    // Coerce old items
    this.items = (this.items || []).map((i: any) => ({
      id: i.id || cryptoRandomId(),
      title: i.title || '',
      completed: !!i.completed,
      createdAt: i.createdAt || Date.now(),
      category: i.category || 'General',
    } as TodoItem));
    try { this.categories = JSON.parse(localStorage.getItem(this.catsKey) || '[]'); } catch { /* noop */ }
    if (!this.categories || this.categories.length === 0) this.categories = ['General', 'Work', 'Personal'];
  }

  persist() {
    localStorage.setItem(this.itemsKey, JSON.stringify(this.items));
    localStorage.setItem(this.catsKey, JSON.stringify(Array.from(new Set(this.categories))));
  }

  openNew() { this.showNew = true; this.newDraft = { title: '', category: this.categories[0] || 'General' }; }
  closeNew() { this.showNew = false; }

  add() {
    const title = (this.newDraft.title || '').trim();
    if (!title) return;
    const item: TodoItem = {
      id: cryptoRandomId(),
      title,
      completed: false,
      createdAt: Date.now(),
      category: this.newDraft.category || 'General',
    };
    this.items.unshift(item);
    this.persist();
    this.closeNew();
  }

  remove(id: string) {
    this.items = this.items.filter(i => i.id !== id);
    this.persist();
  }

  filtered(): TodoItem[] {
    const q = this.query.trim().toLowerCase();
    return this.items.filter(i => {
      if (this.filter === 'active' && i.completed) return false;
      if (this.filter === 'completed' && !i.completed) return false;
      if (this.categoryFilter && i.category !== this.categoryFilter) return false;
      if (q && !i.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  hasCompleted(): boolean { return this.items.some(i => i.completed); }
  clearCompleted() { this.items = this.items.filter(i => !i.completed); this.persist(); }

  remainingCount(): number { return this.items.filter(i => !i.completed).length; }

  onCategoryChange(it: TodoItem, ev: Event) {
    const sel = (ev.target as HTMLSelectElement).value;
    if (sel === '__new__') {
      const name = this.promptNewCategory();
      if (!name) { (ev.target as HTMLSelectElement).value = it.category; return; }
      this.categories.push(name);
      it.category = name; this.persist();
      return;
    }
    this.persist();
  }

  onNewCategoryChange(ev: Event) {
    const sel = (ev.target as HTMLSelectElement).value;
    if (sel === '__new__') {
      const name = this.promptNewCategory();
      if (!name) { (ev.target as HTMLSelectElement).value = this.newDraft.category; return; }
      this.categories.push(name);
      this.newDraft.category = name; this.persist();
    }
  }

  addCategoryPrompt() {
    const name = this.promptNewCategory();
    if (name) { this.categories.push(name); this.newDraft.category = name; this.persist(); }
  }

  private promptNewCategory(): string | null {
    const name = prompt('New category name:')?.trim();
    if (!name) return null;
    if (this.categories.includes(name)) return name;
    return name;
  }
}

function cryptoRandomId(): string {
  const arr = new Uint8Array(12);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(arr);
  } else {
    for (let i=0;i<arr.length;i++) arr[i] = Math.floor(Math.random()*256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}
