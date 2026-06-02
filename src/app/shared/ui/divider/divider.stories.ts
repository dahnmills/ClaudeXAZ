import type { Meta, StoryObj } from '@storybook/angular';
import { DividerComponent } from './divider.component';

const meta: Meta<DividerComponent> = {
  title: 'Design System/Foundation/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    tone:        { control: 'select', options: ['subtle', 'strong'] },
  },
};
export default meta;
type Story = StoryObj<DividerComponent>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal', tone: 'subtle' },
  render: (args) => ({
    props: args,
    template: `<div style="width:400px;"><ds-divider [orientation]="orientation" [tone]="tone" /></div>`,
  }),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', tone: 'subtle' },
  render: (args) => ({
    props: args,
    template: `<div style="height:80px;display:flex;align-items:stretch;"><ds-divider [orientation]="orientation" [tone]="tone" /></div>`,
  }),
};
