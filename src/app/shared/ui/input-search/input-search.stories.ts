import type { Meta, StoryObj } from '@storybook/angular';
import { InputSearchComponent } from './input-search.component';

const meta: Meta<InputSearchComponent> = {
  title: 'Design System/Data Entry/Input Search',
  component: InputSearchComponent,
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    value:        { control: 'text' },
    error:        { control: 'boolean' },
    errorMessage: { control: 'text' },
    disabled:     { control: 'boolean' },
    readonly:     { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputSearchComponent>;

export const Playground: Story = {
  args: {
    placeholder: 'Search…',
    error: false,
    disabled: false,
    readonly: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px;">
        <ds-input-search placeholder="Search…"></ds-input-search>
        <ds-input-search placeholder="Search…" value="Marais"></ds-input-search>
        <ds-input-search label="With label" placeholder="Search companies…"></ds-input-search>
        <ds-input-search placeholder="Search…" [disabled]="true"></ds-input-search>
        <ds-input-search placeholder="Search…" [error]="true" errorMessage="Invalid search query."></ds-input-search>
      </div>
    `,
  }),
};
