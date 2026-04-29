import type { Meta, StoryObj } from '@storybook/angular';
import { ModalHeaderComponent } from './modal-header.component';

const meta: Meta<ModalHeaderComponent> = {
  title: 'Design System/Internals/Modal Header',
  component: ModalHeaderComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-modal`. Ne pas utiliser hors contexte d\'une modal.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ModalHeaderComponent>;

export const Default: Story = {
  args: { title: 'Title' },
  render: (args) => ({
    props: args,
    template: `<div style="width:780px;"><ds-modal-header [title]="title" /></div>`,
  }),
};

export const LongTitle: Story = {
  name: 'Long title (truncated)',
  args: { title: 'A very long modal title that should be truncated with ellipsis when it overflows' },
  render: (args) => ({
    props: args,
    template: `<div style="width:400px;"><ds-modal-header [title]="title" /></div>`,
  }),
};
