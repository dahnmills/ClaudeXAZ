import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutComponent } from './flyout.component';
import { FlyoutSectionComponent } from './flyout-section.component';
import { FlyoutItemComponent } from './flyout-item.component';
import { BadgeComponent } from '../badge/badge.component';

const meta: Meta<FlyoutComponent> = {
  title: 'Design System/Flyout',
  component: FlyoutComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FlyoutSectionComponent, FlyoutItemComponent, BadgeComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<FlyoutComponent>;

export const PoliciesFlyout: Story = {
  name: 'Policies flyout',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout style="width:290px;">
          <ds-flyout-section label="You are viewing" highlighted>
            <ds-flyout-item title="Liability Insurance Program" reference="P11000469" emphasized />
          </ds-flyout-section>

          <ds-flyout-section label="Parents" icon="arrow-up">
            <ds-flyout-item title="Liability Insurance Program" reference="P11000469" />
          </ds-flyout-section>

          <ds-flyout-section label="Siblings (4)" icon="minus">
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
        </ds-flyout>
      </div>
    `,
  }),
};

export const SimpleList: Story = {
  name: 'Simple list (no headers)',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout style="width:290px;">
          <ds-flyout-section>
            <ds-flyout-item title="Item one" reference="REF-001" />
            <ds-flyout-item title="Item two" reference="REF-002" />
            <ds-flyout-item title="Item three" reference="REF-003" />
          </ds-flyout-section>
        </ds-flyout>
      </div>
    `,
  }),
};

export const HighlightedOnly: Story = {
  name: 'Highlighted section only',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout style="width:290px;">
          <ds-flyout-section label="You are viewing" highlighted>
            <ds-flyout-item title="Liability Insurance Program" reference="P11000469" emphasized />
          </ds-flyout-section>
        </ds-flyout>
      </div>
    `,
  }),
};
