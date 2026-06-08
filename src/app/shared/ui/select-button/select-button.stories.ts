import type { Meta, StoryObj } from '@storybook/angular';
import { SelectButtonComponent } from './select-button.component';

const meta: Meta<SelectButtonComponent> = {
  title: 'Design System/Data Entry/Select Button',
  component: SelectButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    sublabel: { control: 'text' },
    icon:     { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SelectButtonComponent>;

export const Playground: Story = {
  args: {
    label: 'Label',
    sublabel: 'Sublabel',
    icon: 'file',
    selected: false,
    disabled: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <ds-select-button label="Label" sublabel="Sublabel" icon="file"></ds-select-button>
        <ds-select-button label="Label" sublabel="Sublabel" icon="file" [selected]="true"></ds-select-button>
        <ds-select-button label="Label" sublabel="Sublabel" icon="file" [disabled]="true"></ds-select-button>
      </div>
    `,
  }),
};
