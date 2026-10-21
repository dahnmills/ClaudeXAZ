import type { Meta, StoryObj } from '@storybook/angular';
import { TagFilterChipComponent, TagFilterOption } from './tag-filter-chip.component';

const OPTIONS: TagFilterOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const meta: Meta<TagFilterChipComponent> = {
  title: 'Design System/Data Entry/Tag Filter Chip',
  component: TagFilterChipComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Filtre multi-sélection avec flyout de checkboxes. `variant="chip"` : déclencheur ds-chip (barre de filtres). `variant="field"` : boîte bordée type ds-select (champ de formulaire, ex. rule-modal de TAG Configuration).',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['chip', 'field'] },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TagFilterChipComponent>;

export const Chip: Story = {
  args: { label: 'Sensitivity', options: OPTIONS, variant: 'chip' },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:32px;">
        <ds-tag-filter-chip [label]="label" [options]="options" [variant]="variant" />
      </div>
    `,
  }),
};

export const Field: Story = {
  args: { label: 'Sensitivity', options: OPTIONS, variant: 'field', placeholder: 'Any' },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:32px;width:240px;">
        <ds-tag-filter-chip [label]="label" [options]="options" [variant]="variant" [placeholder]="placeholder" />
      </div>
    `,
  }),
};
