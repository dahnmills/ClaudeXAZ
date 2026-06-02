import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';

// =============================================================
// Foundation / Tokens — viewer Storybook
// Source : src/styles/_tokens.scss + _semantic.scss
// Lit les CSS custom properties calculées à l'exécution depuis
// le DOM. Pas de duplication des valeurs en TS.
// =============================================================

interface TokenRow {
  name:  string;
  value: string;
}

function readTokens(prefix: string): TokenRow[] {
  if (typeof document === 'undefined') return [];
  const styles = getComputedStyle(document.documentElement);
  const out: TokenRow[] = [];
  // Iterate via document.styleSheets to find all custom properties
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        for (const prop of Array.from(rule.style)) {
          if (prop.startsWith(prefix) && !out.find(r => r.name === prop)) {
            out.push({ name: prop, value: styles.getPropertyValue(prop).trim() });
          }
        }
      }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

@Component({
  selector: 'demo-colors',
  standalone: true,
  template: `
    <div class="page">
      <h2>Foundation / Color</h2>
      <p>Palette brute (couleurs absolues). À ne pas utiliser directement — passer par Semantic.</p>
      <div class="grid">
        @for (t of foundationColors; track t.name) {
          <div class="swatch">
            <div class="swatch__chip" [style.background]="t.value"></div>
            <code class="swatch__name">{{ short(t.name) }}</code>
            <code class="swatch__value">{{ t.value }}</code>
          </div>
        }
      </div>

      <h2 style="margin-top:40px;">Semantic / Color</h2>
      <p>Aliases vers Foundation. C'est ce qu'on utilise dans les composants.</p>
      <div class="grid">
        @for (t of semanticColors; track t.name) {
          <div class="swatch">
            <div class="swatch__chip" [style.background]="'var(--' + t.name.slice(2) + ')'"></div>
            <code class="swatch__name">{{ short(t.name) }}</code>
            <code class="swatch__value">{{ t.value }}</code>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { font-family: var(--semantic-font-family, system-ui); padding: 24px; color: var(--semantic-color-static-text-main-primary, #111); }
    h2 { font-size: 20px; margin: 0 0 8px; }
    p  { color: #666; margin: 0 0 16px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .swatch { display: flex; flex-direction: column; gap: 4px; border: 1px solid #eee; border-radius: 4px; padding: 8px; background: #fff; }
    .swatch__chip { width: 100%; height: 48px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); }
    .swatch__name { font-size: 11px; font-weight: 600; word-break: break-all; }
    .swatch__value { font-size: 11px; color: #666; font-family: monospace; }
  `],
})
class DemoColors {
  foundationColors = readTokens('--foundation-color-');
  semanticColors   = readTokens('--semantic-color-');
  short(name: string) { return name.replace(/^--/, ''); }
}

@Component({
  selector: 'demo-spacing',
  standalone: true,
  template: `
    <div class="page">
      <h2>Foundation / Spacing</h2>
      <table>
        <thead><tr><th>Token</th><th>Valeur</th><th>Visualisation</th></tr></thead>
        <tbody>
          @for (t of spacing; track t.name) {
            <tr>
              <td><code>{{ short(t.name) }}</code></td>
              <td><code>{{ t.value }}</code></td>
              <td><div class="bar" [style.width]="t.value"></div></td>
            </tr>
          }
        </tbody>
      </table>

      <h2 style="margin-top:40px;">Foundation / Radius</h2>
      <div class="grid">
        @for (t of radius; track t.name) {
          <div class="card">
            <div class="card__box" [style.borderRadius]="t.value"></div>
            <code>{{ short(t.name) }}</code>
            <code class="dim">{{ t.value }}</code>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { font-family: var(--semantic-font-family, system-ui); padding: 24px; }
    h2 { font-size: 20px; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eee; }
    th { color: #666; font-weight: 600; }
    code { font-family: monospace; font-size: 12px; }
    .bar { height: 12px; background: var(--semantic-color-interactive-background-strong-default, #007ab3); border-radius: 2px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
    .card { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
    .card__box { width: 80px; height: 80px; background: var(--semantic-color-interactive-background-strong-default, #007ab3); border: 1px solid rgba(0,0,0,0.1); }
    .dim { color: #666; }
  `],
})
class DemoSpacing {
  spacing = readTokens('--foundation-spacing-');
  radius  = readTokens('--foundation-radius-');
  short(name: string) { return name.replace(/^--/, ''); }
}

@Component({
  selector: 'demo-typography',
  standalone: true,
  template: `
    <div class="page">
      <h2>Foundation / Font Size</h2>
      <table>
        <thead><tr><th>Token</th><th>Valeur</th><th>Aperçu</th></tr></thead>
        <tbody>
          @for (t of fontSize; track t.name) {
            <tr>
              <td><code>{{ short(t.name) }}</code></td>
              <td><code>{{ t.value }}</code></td>
              <td><span [style.fontSize]="t.value">The quick brown fox</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page { font-family: var(--semantic-font-family, system-ui); padding: 24px; }
    h2 { font-size: 20px; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eee; vertical-align: baseline; }
    th { color: #666; font-weight: 600; }
    code { font-family: monospace; font-size: 12px; }
  `],
})
class DemoTypography {
  fontSize = readTokens('--foundation-font-size-');
  short(name: string) { return name.replace(/^--/, ''); }
}

const meta: Meta = {
  title: 'Foundation/Tokens',
  tags: ['autodocs'],
};
export default meta;

export const Colors: StoryObj = {
  render: () => ({ moduleMetadata: { imports: [DemoColors] }, template: `<demo-colors />` }),
};
export const Spacing: StoryObj = {
  render: () => ({ moduleMetadata: { imports: [DemoSpacing] }, template: `<demo-spacing />` }),
};
export const Typography: StoryObj = {
  render: () => ({ moduleMetadata: { imports: [DemoTypography] }, template: `<demo-typography />` }),
};
