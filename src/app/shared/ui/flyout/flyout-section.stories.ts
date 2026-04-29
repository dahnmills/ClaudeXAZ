import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutSectionComponent } from './flyout-section.component';
import { FlyoutItemComponent } from './flyout-item.component';
import { BadgeComponent } from '../badge/badge.component';

const meta: Meta<FlyoutSectionComponent> = {
  title: 'Design System/Internals/Flyout Section',
  component: FlyoutSectionComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-flyout`. Ne pas utiliser hors contexte d\'un flyout.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [FlyoutItemComponent, BadgeComponent] }),
  ],
  argTypes: {
    label:       { control: 'text' },
    icon:        { control: 'text' },
    highlighted: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FlyoutSectionComponent>;

export const Highlighted: Story = {
  args: { label: 'You are viewing', icon: null, highlighted: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;background:white;">
        <ds-flyout-section [label]="label" [icon]="icon" [highlighted]="highlighted">
          <ds-flyout-item title="Liability Insurance Program" reference="P11000469" emphasized />
        </ds-flyout-section>
      </div>
    `,
  }),
};

export const Parents: Story = {
  args: { label: 'Parents', icon: 'arrow-up', highlighted: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;background:white;">
        <ds-flyout-section [label]="label" [icon]="icon" [highlighted]="highlighted">
          <ds-flyout-item title="Liability Insurance Program" reference="P11000469" />
        </ds-flyout-section>
      </div>
    `,
  }),
};

export const SiblingsWithBadges: Story = {
  name: 'Siblings with badges',
  args: { label: 'Siblings (4)', icon: 'minus', highlighted: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:290px;background:white;">
        <ds-flyout-section [label]="label" [icon]="icon" [highlighted]="highlighted">
          <ds-flyout-item title="Liability Insurance Program" reference="P11000469">
            <ds-badge slot="badge" label="CAP" status="neutral" variant="light" size="s" />
          </ds-flyout-item>
          <ds-flyout-item title="Liability Insurance Program" reference="P11000469">
            <ds-badge slot="badge" label="JOINT" status="neutral" variant="light" size="s" />
          </ds-flyout-item>
          <ds-flyout-item title="Liability Insurance Program" reference="P11000469">
            <ds-badge slot="badge" label="CAP+" status="neutral" variant="light" size="s" />
          </ds-flyout-item>
        </ds-flyout-section>
      </div>
    `,
  }),
};
