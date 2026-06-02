import { Component, input } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { FlagComponent, type FlagCode } from '../flag/flag.component';
import { TagComponent } from '../tag/tag.component';
import { LinkComponent } from '../link/link.component';

export type PropertyTagTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface PropertyTag {
  label: string;
  tone?: PropertyTagTone;
}

export interface PropertyBullet {
  label: string;
  link?: string;
}

export type PropertyValue =
  | string
  | null
  | { kind: 'text';    value: string | null }
  | { kind: 'tags';    tags: PropertyTag[] }
  | { kind: 'bullets'; items: (string | PropertyBullet)[] }
  | { kind: 'link';    label: string; href: string };

export interface PropertyRow {
  label:      string;
  labelIcon?: IconName;
  labelFlag?: FlagCode;
  value:      PropertyValue;
  showEmptyPlaceholder?: boolean;
}

export interface PropertySection {
  title?: string;
  rows:   PropertyRow[];
}

@Component({
  selector: 'ds-properties-panel',
  standalone: true,
  imports: [IconComponent, FlagComponent, TagComponent, LinkComponent],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
  host: {
    '[class]': '"ds-properties-panel ds-properties-panel--cols-" + columns() + " ds-properties-panel--layout-" + layout()',
  },
})
export class PropertiesPanelComponent {
  sections = input.required<PropertySection[]>();
  columns  = input<1 | 2 | 3 | 4>(2);
  variant  = input<'card' | 'flat'>('card');
  layout   = input<'inline' | 'stacked'>('inline');

  isText(v: PropertyValue): v is string | null | { kind: 'text'; value: string | null } {
    return v === null || typeof v === 'string' || (typeof v === 'object' && v?.kind === 'text');
  }
  isTags(v: PropertyValue): v is { kind: 'tags'; tags: PropertyTag[] } {
    return typeof v === 'object' && v !== null && (v as { kind?: string }).kind === 'tags';
  }
  isBullets(v: PropertyValue): v is { kind: 'bullets'; items: (string | PropertyBullet)[] } {
    return typeof v === 'object' && v !== null && (v as { kind?: string }).kind === 'bullets';
  }
  isLink(v: PropertyValue): v is { kind: 'link'; label: string; href: string } {
    return typeof v === 'object' && v !== null && (v as { kind?: string }).kind === 'link';
  }

  textOf(v: PropertyValue): string {
    if (v === null) return '-';
    if (typeof v === 'string') return v || '-';
    if (typeof v === 'object' && v.kind === 'text') return v.value || '-';
    return '-';
  }

  bulletLabel(b: string | PropertyBullet): string {
    return typeof b === 'string' ? b : b.label;
  }
  bulletLink(b: string | PropertyBullet): string | null {
    return typeof b === 'string' ? null : (b.link ?? null);
  }
}
