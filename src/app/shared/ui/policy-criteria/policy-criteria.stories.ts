import type { Meta, StoryObj } from '@storybook/angular';
import { PolicyCriteriaComponent } from './policy-criteria.component';

const meta: Meta<PolicyCriteriaComponent> = {
  title: 'Design System/Data Entry/Policy Criteria',
  component: PolicyCriteriaComponent,
  tags: ['autodocs'],
  argTypes: { closed: { action: 'closed' } },
};

export default meta;
type Story = StoryObj<PolicyCriteriaComponent>;

export const Default: Story = {};

export const Drafts: Story = {
  args: { value: { searchIn: 'drafts', statuses: ['issued'], extension: '' } },
};
