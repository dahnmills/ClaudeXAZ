import type { Meta, StoryObj } from '@storybook/angular';
import { LinkComponent } from './link.component';

const meta: Meta<LinkComponent> = {
  title: 'Design System/Link',
  component: LinkComponent,
  tags: ['autodocs'],
  argTypes: {
    tone:      { control: 'select', options: ['default', 'neutral', 'reversed'] },
    size:      { control: 'select', options: ['m', 's'] },
    weight:    { control: 'select', options: ['regular', 'semi-bold'] },
    underline: { control: 'boolean' },
    disabled:  { control: 'boolean' },
    external:  { control: 'boolean' },
    href:      { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<LinkComponent>;

export const Default: Story = {
  args: { tone: 'default', size: 'm', underline: false, disabled: false, href: '#' },
  render: (args) => ({
    props: args,
    template: `
      <ds-link [tone]="tone" [size]="size" [underline]="underline" [disabled]="disabled" [href]="href">
        Voir le contrat
      </ds-link>
    `,
  }),
};

export const AllTones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;">
        <ds-link tone="default" href="#">Default (BlueA)</ds-link>
        <ds-link tone="neutral" href="#">Neutral (Grey)</ds-link>
        <ds-link tone="default" href="#" [underline]="true">Avec soulignement</ds-link>
        <ds-link tone="default" href="#" [disabled]="true">Désactivé</ds-link>
      </div>
    `,
  }),
};

export const Reversed: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => ({
    template: `<ds-link tone="reversed" href="#">Lien sur fond sombre</ds-link>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <ds-link size="m" tone="default" href="#">Taille M (16px)</ds-link>
        <ds-link size="s" tone="default" href="#">Taille S (14px)</ds-link>
      </div>
    `,
  }),
};
