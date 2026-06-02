import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { VisualButtonComponent } from './visual-button.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<VisualButtonComponent> = {
  title: 'Design System/Action/Visual Button',
  component: VisualButtonComponent,
  decorators: [moduleMetadata({ imports: [VisualButtonComponent, IconComponent] })],
  tags: ['autodocs'],
  argTypes: {
    tone:     { control: 'select', options: ['default', 'accent'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<VisualButtonComponent>;

export const Default: Story = {
  args: { title: 'Buyer profile', description: 'Create a new buyer entity from scratch.' },
  render: (args) => ({
    props: args,
    template: `
      <ds-visual-button [title]="title" [description]="description" [tone]="tone" [selected]="selected" [disabled]="disabled">
        <ds-icon slot="icon" name="user" [size]="24" />
      </ds-visual-button>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <ds-visual-button title="Buyer" description="Search or create a buyer">
          <ds-icon slot="icon" name="user" [size]="24" />
        </ds-visual-button>
        <ds-visual-button title="Policy" description="Manage credit policies" [selected]="true">
          <ds-icon slot="icon" name="shield" [size]="24" />
        </ds-visual-button>
        <ds-visual-button title="Documents" description="Upload supporting docs">
          <ds-icon slot="icon" name="file-text" [size]="24" />
        </ds-visual-button>
      </div>
    `,
  }),
};
