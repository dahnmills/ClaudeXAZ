import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutItemComponent } from './flyout-item.component';
import { BadgeComponent } from '../badge/badge.component';

const meta: Meta<FlyoutItemComponent> = {
  title: 'Design System/Internals/Flyout Item',
  component: FlyoutItemComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-flyout`. Ne pas utiliser hors contexte d\'un flyout.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [BadgeComponent] }),
  ],
  argTypes: {
    title:      { control: 'text' },
    reference:  { control: 'text' },
    emphasized: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FlyoutItemComponent>;

export const Default: Story = {
  args: {
    title:      'Liability Insurance Program',
    reference:  'P11000469',
    emphasized: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;">
        <ds-flyout-item [title]="title" [reference]="reference" [emphasized]="emphasized" />
      </div>
    `,
  }),
};

export const Emphasized: Story = {
  args: {
    title:      'Liability Insurance Program',
    reference:  'P11000469',
    emphasized: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;">
        <ds-flyout-item [title]="title" [reference]="reference" [emphasized]="emphasized" />
      </div>
    `,
  }),
};

export const WithBadge: Story = {
  name: 'With badge',
  args: { title: 'Liability Insurance Program', reference: 'P11000469' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;">
        <ds-flyout-item [title]="title" [reference]="reference">
          <ds-badge slot="badge" label="CAP" status="neutral" variant="light" size="s" />
        </ds-flyout-item>
      </div>
    `,
  }),
};
