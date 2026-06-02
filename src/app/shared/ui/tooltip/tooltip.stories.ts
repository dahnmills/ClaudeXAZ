import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<TooltipComponent> = {
  title: 'Design System/Feedback/Tooltip',
  component: TooltipComponent,
  decorators: [moduleMetadata({ imports: [TooltipComponent, TooltipDirective, ButtonComponent] })],
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right','left','right'] },
    reversed: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TooltipComponent>;

export const Static: Story = {
  args: { text: 'Hello tooltip', position: 'top-center' },
  render: (args) => ({
    props: args,
    template: `<div style="padding:64px;display:inline-block;position:relative;"><ds-tooltip [text]="text" [position]="position" [reversed]="reversed" /></div>`,
  }),
};

export const OnHover: Story = {
  render: () => ({
    template: `
      <div style="padding:64px;display:flex;gap:24px;">
        <ds-button dsTooltip="Save your work" dsTooltipPosition="top-center">Save</ds-button>
        <ds-button dsTooltip="Cancel this action" dsTooltipPosition="bottom-center" type="secondary">Cancel</ds-button>
      </div>
    `,
  }),
};
