import { type BadgeStatus } from '../../shared/ui';

/** Statut d'une distribution (colonne de gauche + filtres). */
export type DistributionStatus = 'distributed' | 'failed' | 'alerting' | 'ongoing';

/**
 * Étape 1 du pipeline : génération du document.
 * `generated` = document prêt → la distribution peut commencer (vert).
 * ongoing / action-required / retry = encore en génération → aucune distribution.
 */
export type GenerationStatus = 'generated' | 'ongoing' | 'action-required' | 'retry';

/** Statut général de la notification (badge en haut de la modale). */
export type GeneralStatus = 'generated' | 'partial' | 'failed';

/** Statut d'un média (Normal / Backup) dans le tableau de comparaison. */
export type MediaStatus = 'distributed' | 'partial' | 'failed' | 'not-started';

/** Un média (Normal ou Backup) : statut + 3 lignes d'info. */
export interface MediaDetail {
  status:    MediaStatus;
  mediaType: string; // Email, Papermail, Fax…
  receiver:  string;
  details:   string;
}

/** Une distribution : ligne de gauche + payload de comparaison. */
export interface Distribution {
  id:        string;
  label:     string;             // « Distribution 1 »
  status:    DistributionStatus;
  mediaType: string;             // sous-info : « Email · Papermail »
  normal:    MediaDetail;
  backup:    MediaDetail;
}

/** La boîte bleue en tête de modale. */
export interface DistributionInfo {
  status:         string;
  irpNumber:      string;
  notificationId: string;
}

/** Payload complet d'une notification (ouverte via une ligne du tableau de fond). */
export interface NotificationDetails {
  info:            DistributionInfo;
  generalStatus:   GeneralStatus;
  /** Étape 1 : génération du document. Si ≠ 'generated', aucune distribution. */
  generationStatus: GenerationStatus;
  distributions:   Distribution[];
}

/** Une ligne du tableau de fond (page « Notification management »). */
export interface NotificationRow {
  id:            string;
  bu:            string;
  policyId:      string;
  extensionId:   string;
  notifType:     string;
  buyerId:       string;
  executionTime: string;
  statusLabel:   string;
  statusTone:    BadgeStatus;
  details:       NotificationDetails;
}

// ── Correspondances statut → jetons / badges ──────────────────────────────────

/** Suffixe des jetons `functional-*` (couleurs sémantiques du DS). */
export type FunctionalTone = 'positive' | 'negative' | 'warning' | 'informative' | 'neutral';

/** Statut de distribution → couleur fonctionnelle. */
export function distributionTone(s: DistributionStatus): FunctionalTone {
  switch (s) {
    case 'distributed': return 'positive';
    case 'failed':      return 'negative';
    case 'alerting':    return 'warning';
    case 'ongoing':     return 'informative';
  }
}

/** Statut de média → couleur fonctionnelle (Not Started = neutre/grisé). */
export function mediaTone(s: MediaStatus): FunctionalTone {
  switch (s) {
    case 'distributed': return 'positive';
    case 'partial':     return 'warning';
    case 'failed':      return 'negative';
    case 'not-started': return 'neutral';
  }
}

/** Statut de génération → couleur fonctionnelle. Generated = vert, sinon décalé/attente. */
export function generationTone(s: GenerationStatus): FunctionalTone {
  switch (s) {
    case 'generated':       return 'positive';
    case 'ongoing':         return 'informative';
    case 'action-required': return 'warning';
    case 'retry':           return 'warning';
  }
}

/** Statut général → couleur fonctionnelle. */
export function generalTone(s: GeneralStatus): FunctionalTone {
  switch (s) {
    case 'generated': return 'positive';
    case 'partial':   return 'warning';
    case 'failed':    return 'negative';
  }
}

/** Couleur fonctionnelle → statut de badge DS. */
export function toneToBadge(t: FunctionalTone): BadgeStatus {
  switch (t) {
    case 'positive':    return 'success';
    case 'negative':    return 'error';
    case 'warning':     return 'warning';
    case 'informative': return 'info';
    case 'neutral':     return 'neutral';
  }
}

// ── Libellés lisibles ─────────────────────────────────────────────────────────

export const DISTRIBUTION_LABEL: Record<DistributionStatus, string> = {
  distributed: 'Distributed',
  failed:      'Failed',
  alerting:    'Alerting',
  ongoing:     'Ongoing',
};

export const MEDIA_LABEL: Record<MediaStatus, string> = {
  distributed:   'Distributed',
  partial:       'Partial',
  failed:        'Failed',
  'not-started': 'Not started',
};

export const GENERAL_LABEL: Record<GeneralStatus, string> = {
  generated: 'Generated',
  partial:   'Partial',
  failed:    'Failed',
};

export const GENERATION_LABEL: Record<GenerationStatus, string> = {
  generated:         'Generated',
  ongoing:           'Ongoing',
  'action-required': 'Action required',
  retry:             'Retry',
};

/** Phrase affichée dans la modale quand le document est encore en génération (0 distribution). */
export const GENERATION_PENDING_MESSAGE: Record<Exclude<GenerationStatus, 'generated'>, string> = {
  ongoing:           'The document is still being generated. Distribution will start once generation completes.',
  'action-required': 'Document generation requires an action before distribution can start.',
  retry:             'Document generation failed and is being retried. No distribution yet.',
};

/** Phrase orange affichée au-dessus des boîtes média quand la distribution est en alerte (2 médias échoués). */
export const ALERTING_MESSAGE = 'Both media failed to deliver - the back office has been notified to handle it manually.';

/** Phrase d'accompagnement du statut général (sous le badge, réf. Figma 1887:49743). */
export const GENERAL_MESSAGE: Record<GeneralStatus, string> = {
  generated: 'Successfully delivered via the Normal Media.',
  partial:   'Partially delivered - some media are still pending.',
  failed:    'Distribution failed - no media could be delivered.',
};
