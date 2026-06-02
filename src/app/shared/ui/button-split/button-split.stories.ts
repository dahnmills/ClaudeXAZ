import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonSplitComponent } from './button-split.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';

const meta: Meta<ButtonSplitComponent> = {
  title: 'Design System/Action/Button Split',
  component: ButtonSplitComponent,
  decorators: [moduleMetadata({ imports: [ButtonSplitComponent, FlyoutMenuComponent, FlyoutMenuItemComponent] })],
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'plain'] },
    tone: { control: 'select', options: ['default', 'accent', 'positive', 'negative'] },
  },
};
export default meta;
type Story = StoryObj<ButtonSplitComponent>;

export const Default: Story = {
  args: { type: 'primary', tone: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <ds-button-split [type]="type" [tone]="tone" (primaryClicked)="primaryClicked.emit()">
        Save
        <ds-flyout-menu slot="menu">
          <ds-flyout-menu-item label="Save as draft" icon="save" />
          <ds-flyout-menu-item label="Save as copy"  icon="duplicate" />
          <ds-flyout-menu-item label="Save & close"  icon="check" />
        </ds-flyout-menu>
      </ds-button-split>
    `,
  }),
};

export const Secondary: Story = {
  args: { type: 'secondary', tone: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <ds-button-split [type]="type" [tone]="tone">
        Export
        <ds-flyout-menu slot="menu">
          <ds-flyout-menu-item label="CSV" icon="download" />
          <ds-flyout-menu-item label="JSON" icon="download" />
        </ds-flyout-menu>
      </ds-button-split>
    `,
  }),
};
