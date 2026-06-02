import type { Meta, StoryObj } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  title: 'Design System/Data Entry/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TextareaComponent>;

export const Default: Story = {
  args: { label: 'Description', placeholder: 'Enter a description…', rows: 4 },
  render: (args) => ({
    props: args,
    template: `<div style="width:400px;"><ds-textarea [label]="label" [placeholder]="placeholder" [rows]="rows" /></div>`,
  }),
};

export const Error: Story = {
  args: { label: 'Description', placeholder: 'Enter a description…', error: true, errorMessage: 'Required' },
  render: (args) => ({
    props: args,
    template: `<div style="width:400px;"><ds-textarea [label]="label" [placeholder]="placeholder" [error]="error" [errorMessage]="errorMessage" /></div>`,
  }),
};
