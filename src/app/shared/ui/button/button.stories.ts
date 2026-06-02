import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Design System/Action/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    type:      { control: 'select', options: ['primary', 'secondary', 'tertiary', 'plain'] },
    tone:      { control: 'select', options: ['default', 'accent', 'positive', 'negative'] },
    reversed:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    loading:   { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    clicked:   { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { type: 'primary', tone: 'default', reversed: false, disabled: false, loading: false, fullWidth: false },
  render: (args) => ({
    props: args,
    template: `
      <div [style.width]="fullWidth ? '480px' : 'auto'">
        <ds-button
          [type]="type"
          [tone]="tone"
          [reversed]="reversed"
          [disabled]="disabled"
          [loading]="loading"
          [fullWidth]="fullWidth"
          (clicked)="clicked()"
        >
          Valider
        </ds-button>
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary">Primary</ds-button>
        <ds-button type="secondary">Secondary</ds-button>
        <ds-button type="tertiary">Tertiary</ds-button>
        <ds-button type="plain">Plain</ds-button>
      </div>
    `,
  }),
};

export const AccentTone: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   tone="accent">Primary</ds-button>
        <ds-button type="secondary" tone="accent">Secondary</ds-button>
        <ds-button type="tertiary"  tone="accent">Tertiary</ds-button>
        <ds-button type="plain"     tone="accent">Plain</ds-button>
      </div>
    `,
  }),
};

export const FeedbackTones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary" tone="positive">Positive primary</ds-button>
        <ds-button type="secondary" tone="positive">Positive secondary</ds-button>
        <ds-button type="tertiary" tone="positive">Positive tertiary</ds-button>
        <ds-button type="plain" tone="positive">Positive plain</ds-button>
        <ds-button type="primary" tone="negative">Negative primary</ds-button>
        <ds-button type="secondary" tone="negative">Negative secondary</ds-button>
        <ds-button type="tertiary" tone="negative">Negative tertiary</ds-button>
        <ds-button type="plain" tone="negative">Negative plain</ds-button>
      </div>
    `,
  }),
};

export const Reversed: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   [reversed]="true">Primary</ds-button>
        <ds-button type="secondary" [reversed]="true">Secondary</ds-button>
        <ds-button type="tertiary"  [reversed]="true">Tertiary</ds-button>
        <ds-button type="plain"     [reversed]="true">Plain</ds-button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   [disabled]="true">Primary</ds-button>
        <ds-button type="secondary" [disabled]="true">Secondary</ds-button>
        <ds-button type="tertiary"  [disabled]="true">Tertiary</ds-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: { type: 'primary', loading: true },
  render: (args) => ({
    props: args,
    template: `<ds-button [type]="type" [loading]="loading">Submitting…</ds-button>`,
  }),
};

export const LoadMore: Story = {
  name: 'Load More (full width)',
  render: () => ({
    template: `
      <div style="width:480px;display:flex;flex-direction:column;gap:8px;">
        <ds-button type="secondary" tone="accent" [fullWidth]="true">Load more</ds-button>
        <ds-button type="secondary" tone="accent" [fullWidth]="true" [loading]="true">Loading…</ds-button>
      </div>
    `,
  }),
};
