import type { Meta, StoryObj } from '@storybook/angular';
import { InputEmailComponent } from './input-email.component';

const meta: Meta<InputEmailComponent> = {
  title: 'Design System/Data Entry/Input Email',
  component: InputEmailComponent,
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    value:        { control: 'text' },
    optional:     { control: 'boolean' },
    error:        { control: 'boolean' },
    errorMessage: { control: 'text' },
    disabled:     { control: 'boolean' },
    readonly:     { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputEmailComponent>;

export const Playground: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    optional: false,
    error: false,
    errorMessage: 'Please enter a valid email address.',
    disabled: false,
    readonly: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px;">
        <ds-input-email label="Default" placeholder="name@example.com"></ds-input-email>
        <ds-input-email label="With value" value="user@qirin.com"></ds-input-email>
        <ds-input-email label="Read only" [readonly]="true" value="user@qirin.com"></ds-input-email>
        <ds-input-email label="Disabled" [disabled]="true"></ds-input-email>
        <ds-input-email label="Error" [error]="true" errorMessage="Please enter a valid email address."></ds-input-email>
      </div>
    `,
  }),
};
