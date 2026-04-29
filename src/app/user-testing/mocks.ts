import type { PropertySection } from '../shared/ui/properties-panel/properties-panel.component';

export interface TableRow {
  id: string;
  name: string;
  status: string;
  statusColor: 'info' | 'success';
  upload: string;
  isNew: boolean;
}

export const SECTIONS: PropertySection[] = [
  {
    title: 'Buyer information',
    rows: [
      { label: 'Address',       value: 'Vogelsanger Str. 102, Köln. Germany (DE)' },
      { label: 'Legal form',    value: 'GEW' },
      { label: 'BU',            value: 'HERM' },
      { label: 'Origin status', value: 'CLOU' },
      { label: 'Origin status', value: 'CREF 5191123339 FCDE 219/5142/3040' },
    ],
  },
  {
    title: 'Risk',
    rows: [
      { label: 'Main trade sector',         value: 'NACE2 4637' },
      { label: 'Trade sector color',        value: null },
      { label: 'Sanctioned buyer',          value: null },
      { label: 'Sensitivity / Review Cat',  value: null },
      { label: 'Special Risk Underwriting', value: null },
    ],
  },
  {
    title: 'Policy',
    rows: [
      { label: 'Role / Policy Segment', value: null },
      { label: 'Policy Color',          value: null },
      { label: 'Strategic Policy',      value: null },
      { label: 'Insured BU',            value: null },
    ],
  },
  {
    title: 'Group',
    rows: [
      { label: 'Group Head',     value: null },
      { label: 'Group Status',   value: null },
      { label: 'Group Grade',    value: null },
      { label: 'Group exposure', value: null },
    ],
  },
];

export const TABLE_ROWS: TableRow[] = [
  { id: '1', name: 'The Interactive College', status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: true  },
  { id: '2', name: 'Bloom Marketing',         status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: true  },
  { id: '3', name: 'The Spice Route',         status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: false },
  { id: '4', name: 'Gourmet Sandwich',        status: 'Uploaded',  statusColor: 'success', upload: '05/05/2023', isNew: false },
  { id: '5', name: 'Ready Continental',       status: 'Uploaded',  statusColor: 'success', upload: '05/05/2023', isNew: false },
  { id: '6', name: 'My Vegetarian Dinner',    status: 'Uploaded',  statusColor: 'success', upload: '04/05/2023', isNew: false },
  { id: '7', name: 'Evergrow',                status: 'Uploaded',  statusColor: 'success', upload: '04/05/2023', isNew: false },
];
