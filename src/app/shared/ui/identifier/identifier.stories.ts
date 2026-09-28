import type { Meta, StoryObj } from '@storybook/angular';
import { IdentifierComponent } from './identifier.component';

const meta: Meta<IdentifierComponent> = {
  title: 'Design System/Data Display/Identifier',
  component: IdentifierComponent,
  tags: ['autodocs'],
  argTypes: {
    copyable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<IdentifierComponent>;

export const Default: Story = {
  args: { value: '137381425', icon: 'hash', copyable: false },
};

export const Copyable: Story = {
  args: { value: '137381425', icon: 'hash', copyable: true },
};

export const NoIcon: Story = {
  args: { value: '137381425', copyable: true },
};
