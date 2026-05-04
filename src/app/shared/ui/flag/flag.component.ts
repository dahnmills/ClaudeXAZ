import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type FlagCode = 'fr' | 'de' | 'kr' | 'gb' | 'us';

const FLAGS: Record<FlagCode, string> = {
  fr: `
    <rect width="6" height="12" x="0"  fill="#0055A4"/>
    <rect width="6" height="12" x="6"  fill="#FFFFFF"/>
    <rect width="6" height="12" x="12" fill="#EF4135"/>`,

  de: `
    <rect width="18" height="4" x="0" y="0" fill="#000000"/>
    <rect width="18" height="4" x="0" y="4" fill="#DD0000"/>
    <rect width="18" height="4" x="0" y="8" fill="#FFCE00"/>`,

  gb: `
    <rect width="18" height="12" fill="#012169"/>
    <path d="M0,0 L18,12 M18,0 L0,12" stroke="#FFFFFF" stroke-width="2.4"/>
    <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" stroke-width="1.2" clip-path="url(#gb-clip)"/>
    <path d="M9,0 V12 M0,6 H18" stroke="#FFFFFF" stroke-width="3"/>
    <path d="M9,0 V12 M0,6 H18" stroke="#C8102E" stroke-width="1.5"/>`,

  us: `
    <rect width="18" height="12" fill="#FFFFFF"/>
    <g fill="#B22234">
      <rect y="0"   width="18" height="0.92"/>
      <rect y="1.85" width="18" height="0.92"/>
      <rect y="3.69" width="18" height="0.92"/>
      <rect y="5.54" width="18" height="0.92"/>
      <rect y="7.38" width="18" height="0.92"/>
      <rect y="9.23" width="18" height="0.92"/>
      <rect y="11.08" width="18" height="0.92"/>
    </g>
    <rect width="7.2" height="6.46" fill="#3C3B6E"/>`,

  kr: `
    <rect width="18" height="12" fill="#FFFFFF"/>
    <g transform="translate(9 6)">
      <circle r="2.5" fill="#CD2E3A"/>
      <path d="M -2.5,0 A 1.25,1.25 0 0 1 0,0 A 1.25,1.25 0 0 0 2.5,0" fill="#0047A0"/>
    </g>
    <g stroke="#000000" stroke-width="0.45">
      <path d="M2.5,2 L4,3.2 M2.5,2.7 L4,3.9 M2.5,3.4 L4,4.6"/>
      <path d="M14,2 L15.5,3.2 M14,2.7 L15.5,3.9 M14,3.4 L15.5,4.6"/>
      <path d="M2.5,7.4 L4,8.6 M2.5,8.1 L4,9.3 M2.5,8.8 L4,10"/>
      <path d="M14,7.4 L15.5,8.6 M14,8.1 L15.5,9.3 M14,8.8 L15.5,10"/>
    </g>`,
};

@Component({
  selector: 'ds-flag',
  standalone: true,
  template: `<span class="ds-flag__inner" [innerHTML]="svgHtml()"></span>`,
  styles: [`
    :host {
      display: inline-flex;
      width: 16px;
      height: 12px;
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 1px;
      box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.1);
    }
    .ds-flag__inner { display: contents; }
  `],
})
export class FlagComponent {
  private readonly sanitizer = inject(DomSanitizer);

  code = input.required<FlagCode>();

  svgHtml = computed((): SafeHtml => {
    const inner = FLAGS[this.code()] ?? '';
    const svg = `<svg width="16" height="12" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
