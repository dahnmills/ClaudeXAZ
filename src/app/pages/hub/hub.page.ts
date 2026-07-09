import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubAdminService } from './hub-admin.service';

interface Zone {
  path: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'blue' | 'violet' | 'green' | 'ink';
  icon: 'proto' | 'review' | 'isolated' | 'results';
  adminOnly?: boolean;
}

const ALL_ZONES: Zone[] = [
  {
    path: '/prototype', eyebrow: 'Dev', title: 'Prototype', accent: 'ink', icon: 'proto',
    desc: 'Naviguez librement dans tous les écrans, avec l\'inspecteur de handoff (Alt+I). Votre bac à sable de développement.',
    cta: 'Ouvrir les écrans',
  },
  {
    path: '/review', eyebrow: 'Testeurs', title: 'Espace de review', accent: 'blue', icon: 'review',
    desc: 'Les mêmes écrans, avec le widget Echo activé : les testeurs laissent réactions, notes et commentaires en continu.',
    cta: 'Entrer en review',
    adminOnly: true,
  },
  {
    path: '/user-testing', eyebrow: 'Useberry', title: 'Univers isolés', accent: 'violet', icon: 'isolated',
    desc: 'Chaque écran cloisonné, sans inspecteur ni feedback, verrouillé sur lui-même. Prêt à coller dans un test Useberry.',
    cta: 'Voir les univers',
  },
  {
    path: '/results', eyebrow: 'Analyse', title: 'Résultats Echo', accent: 'green', icon: 'results',
    desc: 'Le tableau de bord des retours : sentiment de la salle, verbatims, captures, filtres et export du brut.',
    cta: 'Ouvrir le dashboard',
    adminOnly: true,
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
