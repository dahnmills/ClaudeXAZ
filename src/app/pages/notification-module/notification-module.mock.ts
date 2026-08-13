import { type NotificationRow } from './notification-module.model';

// Jeu de données riche : notifications aux statuts variés pour tester les filtres,
// le pipeline en 2 étapes (génération → distribution) et le scroll de la liste.
//
// Règles métier reflétées ici :
//   • generationStatus ≠ 'generated' (ongoing / action-required / retry)
//     → document encore en génération → AUCUNE distribution.
//   • distribution 'alerting' → les 2 médias (Normal + Backup) sont 'failed'.

export const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    id: 'n-1',
    bu: 'FR01', policyId: '4471023', extensionId: 'EXT-88120', notifType: 'Grade change',
    buyerId: '137381425', executionTime: '2026-08-11 09:42', statusLabel: 'Delivered', statusTone: 'success',
    details: {
      info: { status: 'Generated', irpNumber: 'IRP-2026-004471', notificationId: 'NOTIF-88120-A' },
      generalStatus: 'generated',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-88120-01', label: 'Distribution 1', status: 'distributed', mediaType: 'Email · Papermail',
          normal: { status: 'distributed', mediaType: 'Email',     receiver: 'risk@amazon.co.uk',      details: 'Delivered 09:42 · read receipt OK' },
          backup: { status: 'distributed', mediaType: 'Papermail',  receiver: '1 Principal Pl, London', details: 'Handed to carrier 09:43' },
        },
        {
          id: 'DIST-88120-02', label: 'Distribution 2', status: 'distributed', mediaType: 'Email',
          normal: { status: 'distributed', mediaType: 'Email', receiver: 'ops@amazon.co.uk', details: 'Delivered 09:42' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                details: 'Not started' },
        },
      ],
    },
  },
  {
    id: 'n-2',
    bu: 'DE04', policyId: '5580117', extensionId: 'EXT-33091', notifType: 'Limit decision',
    buyerId: '770042913', executionTime: '2026-08-11 08:15', statusLabel: 'Partially delivered', statusTone: 'warning',
    details: {
      info: { status: 'Partial', irpNumber: 'IRP-2026-005580', notificationId: 'NOTIF-33091-B' },
      generalStatus: 'partial',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-33091-01', label: 'Distribution 1', status: 'distributed', mediaType: 'Email · Fax',
          normal: { status: 'distributed', mediaType: 'Email', receiver: 'kredit@stahlbau-mueller.de', details: 'Delivered 08:15' },
          backup: { status: 'partial',     mediaType: 'Fax',   receiver: '+49 89 1234 000',            details: 'Page 1/2 sent · retry pending' },
        },
        {
          id: 'DIST-33091-02', label: 'Distribution 2', status: 'alerting', mediaType: 'Papermail · Fax',
          normal: { status: 'failed', mediaType: 'Papermail', receiver: 'Werkstr. 4, München', details: 'Print rejected · address invalid' },
          backup: { status: 'failed', mediaType: 'Fax',       receiver: '+49 89 1234 999',    details: 'No answer after 5 retries' },
        },
      ],
    },
  },
  {
    id: 'n-3',
    bu: 'FR01', policyId: '4471023', extensionId: 'EXT-88155', notifType: 'Grade change',
    buyerId: '204558719', executionTime: '2026-08-11 07:58', statusLabel: 'Distribution failed', statusTone: 'error',
    details: {
      info: { status: 'Failed', irpNumber: 'IRP-2026-004472', notificationId: 'NOTIF-88155-C' },
      generalStatus: 'failed',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-88155-01', label: 'Distribution 1', status: 'failed', mediaType: 'Email · Papermail',
          normal: { status: 'failed', mediaType: 'Email',     receiver: 'unknown@group-amazon.fr', details: 'Bounced · mailbox not found' },
          backup: { status: 'failed', mediaType: 'Papermail', receiver: 'Address incomplete',       details: 'Rejected by carrier' },
        },
        {
          id: 'DIST-88155-02', label: 'Distribution 2', status: 'failed', mediaType: 'Fax',
          normal: { status: 'failed',      mediaType: 'Fax', receiver: '+33 1 0000 000', details: 'No answer after 5 retries' },
          backup: { status: 'not-started', mediaType: '-',   receiver: '-',              details: 'Not started' },
        },
      ],
    },
  },
  {
    // Génération : RETRY → document en cours de nouvelle tentative, AUCUNE distribution.
    id: 'n-4',
    bu: 'ES02', policyId: '6621480', extensionId: 'EXT-70410', notifType: 'Cancellation',
    buyerId: '482290117', executionTime: '2026-08-10 18:20', statusLabel: 'Retry 3/5', statusTone: 'warning',
    details: {
      info: { status: 'Partial', irpNumber: 'IRP-2026-006621', notificationId: 'NOTIF-70410-D' },
      generalStatus: 'partial',
      generationStatus: 'retry',
      distributions: [],
    },
  },
  {
    // Génération : ACTION REQUIRED → nécessite une action avant distribution, AUCUNE distribution.
    id: 'n-5',
    bu: 'US09', policyId: '7712095', extensionId: 'EXT-11002', notifType: 'Action required',
    buyerId: '900215674', executionTime: '2026-08-10 16:05', statusLabel: 'Action required', statusTone: 'info',
    details: {
      info: { status: 'Partial', irpNumber: 'IRP-2026-007712', notificationId: 'NOTIF-11002-E' },
      generalStatus: 'partial',
      generationStatus: 'action-required',
      distributions: [],
    },
  },
  {
    id: 'n-6',
    bu: 'IT03', policyId: '8890321', extensionId: 'EXT-55210', notifType: 'Grade change',
    buyerId: '551023884', executionTime: '2026-08-10 14:47', statusLabel: 'Delivered', statusTone: 'success',
    details: {
      info: { status: 'Generated', irpNumber: 'IRP-2026-008890', notificationId: 'NOTIF-55210-F' },
      generalStatus: 'generated',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-55210-01', label: 'Distribution 1', status: 'distributed', mediaType: 'Email',
          normal: { status: 'distributed', mediaType: 'Email', receiver: 'info@amazing-loco.it', details: 'Delivered 14:47' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                     details: 'Not started' },
        },
        {
          id: 'DIST-55210-02', label: 'Distribution 2', status: 'distributed', mediaType: 'Papermail',
          normal: { status: 'distributed', mediaType: 'Papermail', receiver: 'Via Roma 10, Milano', details: 'Handed to carrier 14:48' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: 'Via Roma 10, Milano', details: 'Duplicate copy 14:48' },
        },
      ],
    },
  },
  {
    // Génération : ONGOING → document en cours de génération, AUCUNE distribution.
    id: 'n-7',
    bu: 'FR01', policyId: '4471023', extensionId: 'EXT-88190', notifType: 'Limit decision',
    buyerId: '693118250', executionTime: '2026-08-10 11:33', statusLabel: 'Ongoing', statusTone: 'info',
    details: {
      info: { status: 'Partial', irpNumber: 'IRP-2026-004473', notificationId: 'NOTIF-88190-G' },
      generalStatus: 'partial',
      generationStatus: 'ongoing',
      distributions: [],
    },
  },
  {
    id: 'n-8',
    bu: 'DE04', policyId: '5580117', extensionId: 'EXT-33140', notifType: 'Cancellation',
    buyerId: '770042913', executionTime: '2026-08-09 22:10', statusLabel: 'Distribution failed', statusTone: 'error',
    details: {
      info: { status: 'Failed', irpNumber: 'IRP-2026-005581', notificationId: 'NOTIF-33140-H' },
      generalStatus: 'failed',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-33140-01', label: 'Distribution 1', status: 'failed', mediaType: 'Email',
          normal: { status: 'failed',      mediaType: 'Email', receiver: 'noreply@stahlbau-mueller.de', details: 'SMTP 550 · relay denied' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                           details: 'Not started' },
        },
        {
          id: 'DIST-33140-02', label: 'Distribution 2', status: 'alerting', mediaType: 'Papermail · Email',
          normal: { status: 'failed', mediaType: 'Papermail', receiver: 'Werkstr. 4, München',          details: 'Print error · manual check failed' },
          backup: { status: 'failed', mediaType: 'Email',     receiver: 'backup@stahlbau-mueller.de',   details: 'Bounced · mailbox full' },
        },
      ],
    },
  },
  {
    id: 'n-9',
    bu: 'GB07', policyId: '9930442', extensionId: 'EXT-99001', notifType: 'Grade change',
    buyerId: '137381425', executionTime: '2026-08-09 19:55', statusLabel: 'Delivered', statusTone: 'success',
    details: {
      info: { status: 'Generated', irpNumber: 'IRP-2026-009930', notificationId: 'NOTIF-99001-I' },
      generalStatus: 'generated',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-99001-01', label: 'Distribution 1', status: 'distributed', mediaType: 'Email · Papermail',
          normal: { status: 'distributed', mediaType: 'Email',     receiver: 'risk@amazon.co.uk',      details: 'Delivered 19:55' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: '1 Principal Pl, London', details: 'Handed to carrier 19:56' },
        },
      ],
    },
  },
  {
    // Cas « gros volume » : 12 distributions pour tester le scroll de la liste de gauche.
    id: 'n-10',
    bu: 'NL05', policyId: '1120884', extensionId: 'EXT-42210', notifType: 'Limit decision',
    buyerId: '318842007', executionTime: '2026-08-09 15:30', statusLabel: 'Partially delivered', statusTone: 'warning',
    details: {
      info: { status: 'Partial', irpNumber: 'IRP-2026-011208', notificationId: 'NOTIF-42210-J' },
      generalStatus: 'partial',
      generationStatus: 'generated',
      distributions: [
        {
          id: 'DIST-42210-01', label: 'Distribution 1', status: 'distributed', mediaType: 'Email · Papermail',
          normal: { status: 'distributed', mediaType: 'Email',     receiver: 'finance@rotterdam-freight.nl', details: 'Delivered 15:30 · read receipt OK' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: 'Coolsingel 40, Rotterdam',      details: 'Handed to carrier 15:31' },
        },
        {
          id: 'DIST-42210-02', label: 'Distribution 2', status: 'distributed', mediaType: 'Email',
          normal: { status: 'distributed', mediaType: 'Email', receiver: 'ap@rotterdam-freight.nl', details: 'Delivered 15:30' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                       details: 'Not started' },
        },
        {
          id: 'DIST-42210-03', label: 'Distribution 3', status: 'ongoing', mediaType: 'Email · Fax',
          normal: { status: 'partial', mediaType: 'Email', receiver: 'treasury@rotterdam-freight.nl', details: 'Sending…' },
          backup: { status: 'partial', mediaType: 'Fax',   receiver: '+31 10 200 0000',              details: 'Dialing…' },
        },
        {
          id: 'DIST-42210-04', label: 'Distribution 4', status: 'alerting', mediaType: 'Papermail · Email',
          normal: { status: 'failed', mediaType: 'Papermail', receiver: 'Weena 200, Rotterdam',          details: 'Print queued · carrier rejected' },
          backup: { status: 'failed', mediaType: 'Email',     receiver: 'ops-eu@rotterdam-freight.nl',  details: 'Bounced · mailbox not found' },
        },
        {
          id: 'DIST-42210-05', label: 'Distribution 5', status: 'failed', mediaType: 'Email',
          normal: { status: 'failed',      mediaType: 'Email', receiver: 'bounce@rotterdam-freight.nl', details: 'Bounced · mailbox full' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                          details: 'Not started' },
        },
        {
          id: 'DIST-42210-06', label: 'Distribution 6', status: 'distributed', mediaType: 'Email · Papermail',
          normal: { status: 'distributed', mediaType: 'Email',     receiver: 'ops-eu@rotterdam-freight.nl', details: 'Delivered 15:32' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: 'Blaak 34, Rotterdam',        details: 'Handed to carrier 15:33' },
        },
        {
          id: 'DIST-42210-07', label: 'Distribution 7', status: 'distributed', mediaType: 'Email',
          normal: { status: 'distributed', mediaType: 'Email', receiver: 'legal@rotterdam-freight.nl', details: 'Delivered 15:33' },
          backup: { status: 'not-started', mediaType: '-',     receiver: '-',                          details: 'Not started' },
        },
        {
          id: 'DIST-42210-08', label: 'Distribution 8', status: 'ongoing', mediaType: 'Fax',
          normal: { status: 'partial',     mediaType: 'Fax', receiver: '+31 10 300 0000', details: 'Retry 2/5 · next in 5 min' },
          backup: { status: 'not-started', mediaType: '-',   receiver: '-',               details: 'Not started' },
        },
        {
          id: 'DIST-42210-09', label: 'Distribution 9', status: 'distributed', mediaType: 'Papermail',
          normal: { status: 'distributed', mediaType: 'Papermail', receiver: 'Wilhelminakade 909, Rotterdam', details: 'Handed to carrier 15:34' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: 'Wilhelminakade 909, Rotterdam', details: 'Duplicate copy 15:34' },
        },
        {
          id: 'DIST-42210-10', label: 'Distribution 10', status: 'alerting', mediaType: 'Email · Fax',
          normal: { status: 'failed', mediaType: 'Email', receiver: 'compliance@rotterdam-freight.nl', details: 'Bounced · policy block' },
          backup: { status: 'failed', mediaType: 'Fax',   receiver: '+31 10 500 0000',                 details: 'No answer after 5 retries' },
        },
        {
          id: 'DIST-42210-11', label: 'Distribution 11', status: 'failed', mediaType: 'Email · Fax',
          normal: { status: 'failed', mediaType: 'Email', receiver: 'invalid@rotterdam-freight.nl', details: 'SMTP 550 · relay denied' },
          backup: { status: 'failed', mediaType: 'Fax',   receiver: '+31 10 400 0000',              details: 'No answer after 5 retries' },
        },
        {
          id: 'DIST-42210-12', label: 'Distribution 12', status: 'distributed', mediaType: 'Email · Papermail',
          normal: { status: 'distributed', mediaType: 'Email',     receiver: 'board@rotterdam-freight.nl', details: 'Delivered 15:35' },
          backup: { status: 'distributed', mediaType: 'Papermail', receiver: 'Coolsingel 40, Rotterdam',    details: 'Handed to carrier 15:36' },
        },
      ],
    },
  },
];
