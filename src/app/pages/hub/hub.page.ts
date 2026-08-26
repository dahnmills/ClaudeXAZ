import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubAdminService } from './hub-admin.service';

interface Zone {
  path: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'blue' | 'violet' | 'green' | 'ink' | 'amber' | 'red';
  icon: 'proto' | 'review' | 'isolated' | 'results' | 'notes' | 'audit' | 'components';
  adminOnly?: boolean;
}

const ALL_ZONES: Zone[] = [
  {
    path: '/prototype', eyebrow: 'Dev', title: 'Prototype', accent: 'ink', icon: 'proto',
    desc: 'Browse freely through all screens, with the handoff inspector (Alt+I). Your development sandbox.',
    cta: 'Open the screens',
  },
  {
    path: '/review', eyebrow: 'Testers', title: 'Review space', accent: 'blue', icon: 'review',
    desc: 'The same screens, with the Echo widget enabled: testers leave reactions, ratings and comments continuously.',
    cta: 'Enter review',
    adminOnly: true,
  },
  {
    path: '/user-testing', eyebrow: 'Useberry', title: 'Isolated universes', accent: 'violet', icon: 'isolated',
    desc: 'Each screen isolated, with no inspector or feedback, locked to itself. Ready to paste into a Useberry test.',
    cta: 'View the universes',
  },
  {
    path: '/results', eyebrow: 'Analytics', title: 'Echo results', accent: 'green', icon: 'results',
    desc: 'The feedback dashboard: room sentiment, verbatims, captures, filters and raw data export.',
    cta: 'Open the dashboard',
    adminOnly: true,
  },
  {
    path: '/release-notes', eyebrow: 'Changelog', title: 'Release notes', accent: 'amber', icon: 'notes',
    desc: 'History of changes per screen: features, fixes, design and content adjustments, filterable.',
    cta: 'View the notes',
  },
  {
    path: '/design-system-components', eyebrow: 'Design System', title: 'Components', accent: 'red', icon: 'components',
    desc: 'The whole shared/ui catalogue, with a direct link to each component\'s Storybook page.',
    cta: 'Browse components',
  },
  {
    path: '/design-system-audit', eyebrow: 'Design System', title: 'Component audit', accent: 'red', icon: 'audit',
    desc: 'Adoption, Storybook coverage, duplicates and un-mutualized patterns across the whole shared/ui catalogue.',
    cta: 'Open the audit',
  },
];

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub.page.html',
  styleUrl: './hub.page.scss',
})
export class HubPage {
  private admin = inject(HubAdminService);
  zones = computed(() =>
    this.admin.isAdmin() ? ALL_ZONES : ALL_ZONES.filter(z => !z.adminOnly)
  );
}
