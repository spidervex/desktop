import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container class="map-container"></div>
  `,
  styles: [
    `:host { display:block; height:100%; }
     .map-container { position:relative; width:100%; height:100%; border-radius:8px; overflow:hidden; }
    `
  ]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  private map?: maplibregl.Map;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: this.container.nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 1.8,
      attributionControl: true,
    });

    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.map?.resize());
      this.resizeObserver.observe(this.container.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }
}

