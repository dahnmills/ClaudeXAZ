import type { Meta, StoryObj } from '@storybook/angular';
import { CompleteFormComponent } from './complete-form.component';

const meta: Meta<CompleteFormComponent> = {
  title: 'Pages/Manual Underwriting/Complete form',
  component: CompleteFormComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<CompleteFormComponent>;

export const Default: Story = { args: { rights: true } };

export const Prefilled: Story = {
  args: { rights: true, value: { answer: 'agreement', reason: '110', permanentAmount: '250000' } },
};

export const NoRights: Story = { args: { rights: false } };
