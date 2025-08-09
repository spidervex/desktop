import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type DocId = 'overview' | 'text-editor' | 'map' | 'todo' | 'clock' | 'settings';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="docs-wrap">
      <aside class="sidebar">
        <input class="search" [(ngModel)]="query" placeholder="Search…" />
        <ul class="nav">
          <li *ngFor="let i of filteredNav()" [class.active]="i.id===current" (click)="select(i.id)">{{ i.title }}</li>
        </ul>
      </aside>
      <main class="content">
        <h2>{{ titleFor(current) }}</h2>
        <div *ngIf="loading" class="loading">Loading…</div>
        <div class="prose" [innerHTML]="contentHtml"></div>
      </main>
    </div>
  `,
  styles: [
    `:host { display:block; height:100%; }
     .docs-wrap { height:100%; display:grid; grid-template-columns: 260px 1fr; gap:12px; }
     .sidebar { background: var(--panel-2); border:1px solid rgba(0,0,0,0.25); border-radius:12px; padding:10px; display:flex; flex-direction:column; gap:8px; min-width:0; }
     .search { background: var(--panel); color: var(--text); border:1px solid rgba(0,0,0,0.25); border-radius:8px; padding:6px 8px; }
     .nav { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px; overflow:auto; }
     .nav li { padding:8px 10px; border-radius:8px; cursor:pointer; color: var(--text); }
     .nav li:hover { background: rgba(0,0,0,0.15); }
     .nav li.active { background: var(--panel-3); border:1px solid rgba(0,0,0,0.25); }
     .content { background: var(--panel-2); border:1px solid rgba(0,0,0,0.25); border-radius:12px; padding:14px; overflow:auto; }
     .content h2 { margin-top:0; }
     .prose { line-height:1.6; color: var(--text); }
     .prose h3 { margin: 1.2em 0 0.4em; }
     .prose ul { padding-left: 1.2em; }
     .prose code { background: var(--panel-3); padding: 2px 6px; border-radius:6px; }
     .loading { color: var(--text-dim); }
    `
  ]
})
export class DocsComponent {
  constructor(private http: HttpClient) {}

  nav = [
    { id: 'overview' as DocId, title: 'Operating System' },
    { id: 'text-editor' as DocId, title: 'Text Editor' },
    { id: 'map' as DocId, title: 'Map' },
    { id: 'todo' as DocId, title: 'To‑Do' },
    { id: 'clock' as DocId, title: 'Clock' },
    { id: 'settings' as DocId, title: 'Settings' },
  ];
  current: DocId = 'overview';
  query = '';
  loading = false;
  contentHtml = '';
  private cache = new Map<DocId, string>();

  ngOnInit() { this.load(this.current); }

  select(id: DocId) { this.current = id; this.load(id); }
  filteredNav() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.nav;
    return this.nav.filter(i => i.title.toLowerCase().includes(q));
  }
  titleFor(id: DocId) { return this.nav.find(n => n.id === id)?.title ?? ''; }

  private load(id: DocId) {
    if (this.cache.has(id)) { this.contentHtml = this.cache.get(id)!; return; }
    this.loading = true; this.contentHtml = '';
    const url = `assets/docs/${id}.md`;
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: md => {
        const html = parseMarkdown(md);
        this.cache.set(id, html);
        this.contentHtml = html;
        this.loading = false;
      },
      error: _ => { this.contentHtml = '<p>Document not found.</p>'; this.loading = false; }
    });
  }
}
// Very small Markdown-to-HTML converter for our docs
function parseMarkdown(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let inList = false;
  for (let line of lines) {
    if (/^\s*$/.test(line)) { if (inList) { out.push('</ul>'); inList = false; } continue; }
    // headings
    if (line.startsWith('### ')) { if (inList) { out.push('</ul>'); inList = false; } out.push('<h3>' + inline(line.slice(4)) + '</h3>'); continue; }
    if (line.startsWith('## ')) { if (inList) { out.push('</ul>'); inList = false; } out.push('<h2>' + inline(line.slice(3)) + '</h2>'); continue; }
    if (line.startsWith('# ')) { if (inList) { out.push('</ul>'); inList = false; } out.push('<h1>' + inline(line.slice(2)) + '</h1>'); continue; }
    // list item
    if (line.match(/^[-*]\s+/)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inline(line.replace(/^[-*]\s+/, '')) + '</li>');
      continue;
    }
    // paragraph
    if (inList) { out.push('</ul>'); inList = false; }
    out.push('<p>' + inline(line) + '</p>');
  }
  if (inList) out.push('</ul>');
  return out.join('\n');

  function inline(s: string): string {
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return s;
  }
}
