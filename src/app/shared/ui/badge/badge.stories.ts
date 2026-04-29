import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Design System/Feedback/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    label:   { control: 'text' },
    status:  { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    variant: { control: 'select', options: ['light', 'strong'] },
    size:    { control: 'select', options: ['s', 'm'] },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: { label: 'En cours', status: 'info', variant: 'light', size: 's' },
  render: (args) => ({
    props: args,
    template: `<ds-badge [label]="label" [status]="status" [variant]="variant" [size]="size"></ds-badge>`,
  }),
};

export const LightStatuses: Story = {
  name: 'Light — tous les statuts',
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <ds-badge label="Info"      status="info"    variant="light" size="s"></ds-badge>
        <ds-badge label="Succès"    status="success" variant="light" size="s"></ds-badge>
        <ds-badge label="Attention" status="warning" variant="light" size="s"></ds-badge>
        <ds-badge label="Erreur"    status="error"   variant="light" size="s"></ds-badge>
        <ds-badge label="Neutre"    status="neutral" variant="light" size="s"></ds-badge>
      </div>
    `,
  }),
};

export const StrongStatuses: Story = {
  name: 'Strong — tous les statuts',
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <ds-badge label="Info"      status="info"    variant="strong" size="s"></ds-badge>
        <ds-badge label="Succès"    status="success" variant="strong" size="s"></ds-badge>
        <ds-badge label="Attention" status="warning" variant="strong" size="s"></ds-badge>
        <ds-badge label="Erreur"    status="error"   variant="strong" size="s"></ds-badge>
        <ds-badge label="Neutre"    status="neutral" variant="strong" size="s"></ds-badge>
      </div>
    `,
  }),
};

export const SizeMedium: Story = {
  name: 'Size M',
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <ds-badge label="Info M"    status="info"    variant="light"  size="m"></ds-badge>
        <ds-badge label="Succès M"  status="success" variant="light"  size="m"></ds-badge>
        <ds-badge label="Erreur M"  status="error"   variant="strong" size="m"></ds-badge>
      </div>
    `,
  }),
};
