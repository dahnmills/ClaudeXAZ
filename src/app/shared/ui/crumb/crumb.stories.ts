import type { Meta, StoryObj } from '@storybook/angular';
import { CrumbComponent } from './crumb.component';

const meta: Meta<CrumbComponent> = {
  title: 'Design System/Crumb',
  component: CrumbComponent,
  tags: ['autodocs'],
  argTypes: {
    label:       { control: 'text' },
    href:        { control: 'text' },
    currentPage: { control: 'boolean' },
    disabled:    { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CrumbComponent>;

export const Default: Story = {
  args: { label: 'Crumb', href: '#', currentPage: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `<ds-crumb [label]="label" [href]="href" [currentPage]="currentPage" [disabled]="disabled" />`,
  }),
};

export const CurrentPage: Story = {
  name: 'Current page',
  args: { label: 'Crumb', currentPage: true },
  render: (args) => ({
    props: args,
    template: `<ds-crumb [label]="label" [currentPage]="currentPage" />`,
  }),
};

export const Disabled: Story = {
  args: { label: 'Crumb', disabled: true },
  render: (args) => ({
    props: args,
    template: `<ds-crumb [label]="label" [disabled]="disabled" />`,
  }),
};
