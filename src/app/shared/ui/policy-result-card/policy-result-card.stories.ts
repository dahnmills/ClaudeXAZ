import type { Meta, StoryObj } from '@storybook/angular';
import { PolicyResultCardComponent } from './policy-result-card.component';
import type { PolicyResultData } from './policy.model';

const issued: PolicyResultData = {
  id: '5012346-01', policyNumber: '5012346', extension: '01', kind: 'policy', status: 'issued',
  policyholder: 'Brooklyn Craft Goods LLC', buCode: 'AT USA',
  effectiveDate: '01 Jan 2026', expiryDate: '31 Dec 2026',
  details: [
    { label: 'Covered amount', value: '$2 000 000' },
    { label: 'Currency', value: 'USD' },
    { label: 'Covered buyers', value: '14' },
  ],
};

const meta: Meta<PolicyResultCardComponent> = {
  title: 'Design System/Data Display/Policy Result Card',
  component: PolicyResultCardComponent,
  tags: ['autodocs'],
  argTypes: { toggled: { action: 'toggled' }, starred: { action: 'starred' }, opened: { action: 'opened' } },
  args: { data: issued },
};

export default meta;
type Story = StoryObj<PolicyResultCardComponent>;

export const Issued: Story = {};
export const Open: Story = { args: { open: true, favorited: true } };
export const Cancelled: Story = { args: { data: { ...issued, id: '5012391-00', status: 'cancelled' } } };
export const Expired: Story = { args: { data: { ...issued, id: '5012346-00', status: 'expired' } } };
export const Draft: Story = { args: { data: { ...issued, id: 'D-20433-00', policyNumber: 'D-20433', extension: '00', kind: 'draft', status: null } } };
