// Buyer Summary V2: label / value lists of the cards, shared by the card body
// (what the card shows) and the detail panel (the same data in tables).
// Moved as is from the page component.

import { type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { AS_OF } from './buyer-summary-v2.data';

// Label / value lists that show as many rows as their card holds
export const limitKv = [
  { label: 'Granted', value: '5 000 000' }, { label: 'Used', value: '1 548 000' },
  { label: 'Granted on', value: '11 Nov 2024' }, { label: 'Expiry', value: 'None' }, { label: 'Policies', value: '6' },
];
export const riskKv = [
  { label: 'Highest limit', value: '10.0 bn' }, { label: 'Exposure', value: '1.55 M' },
  { label: 'Policies', value: '6' }, { label: 'Updated', value: '11 Nov 2024' },
];
export const scoreKv = [
  { label: 'Updated', value: '11 Nov 2024' }, { label: 'Sector', value: '74 / 100' },
  { label: '12 months ago', value: '80' }, { label: 'Lowest, 18 m', value: '78' },
];
export const exposureKv = [
  { label: 'Granted limit', value: '5 000 000' }, { label: 'Available', value: '3 452 000' },
  { label: 'Policies', value: '6' }, { label: 'Limits on market', value: '72' },
  { label: 'Highest limit', value: '10 000 246 000' },
];
export const reviewKv = [
  { label: 'Last review', value: '12 Jun 2024' }, { label: 'Owner', value: 'C. Morel' },
  { label: 'Policies', value: '6' }, { label: 'Priority', value: 'Medium' },
];
export const sanctionKv = [
  { label: 'List', value: 'EU' }, { label: 'Screened', value: '28 Oct 2024' },
  { label: 'Status', value: 'Proof asked' }, { label: 'Owner', value: 'J. Petit' },
];
// Claims: the counts the board already has (no open claim, the overdue card's
// "Claims, 24 m") and the date of the check
export const claimsKv = [
  { label: 'Open', value: '0' }, { label: 'Claims, 24 m', value: '0' }, { label: 'Checked', value: AS_OF },
];
export const paymentKv = [
  { label: 'Average delay', value: '3 days' }, { label: 'DSO', value: '47 days' },
  { label: 'Invoices', value: '1 284' }, { label: 'Disputes', value: 'None' },
];
export const limitFacts: PropertySection[] = [{ rows: [
  { label: 'Granted', value: '5 000 000' },
  { label: 'Used',    value: '1 548 000' },
  { label: 'Available', value: '3 452 000' },
] }];
export const limitMore: PropertySection[] = [{ rows: [
  { label: 'Granted on', value: '11 Nov 2024' },
  { label: 'Expiry',     value: 'None' },
  { label: 'Policies',   value: '6' },
] }];
export const exposureFacts: PropertySection[] = [{ rows: [
  { label: 'Granted limit', value: '5 000 000' },
  { label: 'Available',     value: '3 452 000' },
  { label: 'Policies',      value: '6' },
] }];
export const overdueFacts: PropertySection[] = [{ rows: [
  { label: 'Oldest',      value: 'N/A' },
  { label: 'Disputes',    value: 'None' },
  { label: 'Collections', value: '0 open' },
  { label: 'Claims, 24 m', value: '0' },
] }];
export const paymentFacts: PropertySection[] = [{ rows: [
  { label: 'Average delay', value: '3 days' },
  { label: 'DSO',           value: '47 days' },
  { label: 'Invoices',      value: '1 284' },
] }];
export const scoreFacts: PropertySection[] = [{ rows: [
  { label: 'Updated', value: '11 Nov 2024' },
  { label: 'Sector',  value: '74 / 100' },
] }];
export const riskFacts: PropertySection[] = [{ rows: [
  { label: 'Highest limit', value: '10 000 246 000' },
  { label: 'Exposure',      value: '1 548 000' },
] }];
export const coverFacts: PropertySection[] = [{ rows: [
  { label: 'Requested', value: '2 000 000' },
  { label: 'Granted',   value: '2 000 000' },
  { label: 'Decided',   value: '11 Nov 2024' },
  { label: 'By',        value: 'C. Morel' },
] }];
