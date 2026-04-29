import type { Meta, StoryObj } from '@storybook/angular';
import { PropertiesPanelComponent, type PropertySection } from './properties-panel.component';

const sections: PropertySection[] = [
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

const meta: Meta<PropertiesPanelComponent> = {
  title: 'Design System/Properties Panel',
  component: PropertiesPanelComponent,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4] },
    variant: { control: 'select', options: ['card', 'flat'] },
  },
};

export default meta;
type Story = StoryObj<PropertiesPanelComponent>;

export const TwoColumnsCards: Story = {
  name: '2 columns — card variant',
  args: { sections, columns: 2, variant: 'card' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-properties-panel [sections]="sections" [columns]="columns" [variant]="variant" />
      </div>
    `,
  }),
};

export const FourColumnsFlat: Story = {
  name: '4 columns — flat variant (accordion style)',
  args: { sections, columns: 4, variant: 'flat' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:1216px;background:#ECECEC;padding:16px 32px;">
        <ds-properties-panel [sections]="sections" [columns]="columns" [variant]="variant" />
      </div>
    `,
  }),
};

export const SingleColumn: Story = {
  name: '1 column',
  args: { sections, columns: 1, variant: 'card' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:400px;">
        <ds-properties-panel [sections]="sections" [columns]="columns" [variant]="variant" />
      </div>
    `,
  }),
};
