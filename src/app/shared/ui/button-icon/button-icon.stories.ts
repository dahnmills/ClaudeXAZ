import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonIconComponent } from './button-icon.component';

const ICON_X = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const meta: Meta<ButtonIconComponent> = {
  title: 'Design System/Action/Button Icon',
  component: ButtonIconComponent,
  tags: ['autodocs'],
  argTypes: {
    type:      { control: 'select', options: ['primary', 'secondary', 'tertiary', 'plain'] },
    tone:      { control: 'select', options: ['default', 'accent', 'positive', 'negative'] },
    size:      { control: 'select', options: ['s', 'm'] },
    reversed:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    ariaLabel: { control: 'text' },
    clicked:   { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<ButtonIconComponent>;

export const Default: Story = {
  args: { type: 'primary', tone: 'default', size: 's', reversed: false, disabled: false, ariaLabel: 'Fermer' },
  render: (args) => ({
    props: args,
    template: `
      <ds-button-icon [type]="type" [tone]="tone" [size]="size" [reversed]="reversed" [disabled]="disabled" [ariaLabel]="ariaLabel">
        ${ICON_X}
      </ds-button-icon>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center;">
        <ds-button-icon type="primary"   tone="default" size="s" ariaLabel="Primary">${ICON_X}</ds-button-icon>
        <ds-button-icon type="secondary" tone="default" size="s" ariaLabel="Secondary">${ICON_X}</ds-button-icon>
        <ds-button-icon type="tertiary"  tone="default" size="s" ariaLabel="Tertiary">${ICON_X}</ds-button-icon>
        <ds-button-icon type="plain"     tone="default" size="s" ariaLabel="Plain">${ICON_X}</ds-button-icon>
      </div>
    `,
  }),
};

export const AllTones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center;">
        <ds-button-icon type="primary" tone="default"  size="s" ariaLabel="Default">${ICON_X}</ds-button-icon>
        <ds-button-icon type="primary" tone="accent"   size="s" ariaLabel="Accent">${ICON_X}</ds-button-icon>
        <ds-button-icon type="primary" tone="positive" size="s" ariaLabel="Positive">${ICON_CHECK}</ds-button-icon>
        <ds-button-icon type="primary" tone="negative" size="s" ariaLabel="Negative">${ICON_X}</ds-button-icon>
      </div>
    `,
  }),
};

export const SizeMedium: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center;">
        <ds-button-icon type="primary"   size="m" ariaLabel="Primary M">${ICON_X}</ds-button-icon>
        <ds-button-icon type="secondary" size="m" ariaLabel="Secondary M">${ICON_X}</ds-button-icon>
        <ds-button-icon type="tertiary"  size="m" ariaLabel="Tertiary M">${ICON_X}</ds-button-icon>
      </div>
    `,
  }),
};

export const Reversed: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center;">
        <ds-button-icon type="primary"   [reversed]="true" size="s" ariaLabel="Primary">${ICON_X}</ds-button-icon>
        <ds-button-icon type="secondary" [reversed]="true" size="s" ariaLabel="Secondary">${ICON_X}</ds-button-icon>
        <ds-button-icon type="tertiary"  [reversed]="true" size="s" ariaLabel="Tertiary">${ICON_X}</ds-button-icon>
      </div>
    `,
  }),
};
