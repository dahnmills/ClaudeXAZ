import type { Meta, StoryObj } from '@storybook/angular';
import { PolicyResultCardComponent } from './policy-result-card.component';
import type { SignedPolicy, DraftPolicy } from './policy.model';

/** Date figée : les alertes de renouvellement ne bougent pas d'un jour à l'autre. */
const today = new Date('2026-10-28T00:00:00Z');

const issued: SignedPolicy = {
  id: 'POL/AT UK/C7730012/0234', kind: 'policy', buCode: 'AT UK', policyNumber: 'C7730012', extension: '0234',
  status: 'issued', policyName: 'Northwind Trading Domestic', insuredName: 'Northwind Trading Ltd',
  insuredCompanyId: '20031455', insuredCountry: 'United Kingdom', product: 'CAP',
  segment: 'SME', lob: 'Whole Turnover', brokerName: 'Marsh Ltd', brokerCompanyId: '80011290',
  inceptionDate: '2026-04-01', expiryDate: '2027-03-31', nextRenewalDate: '2027-03-31', inforceBu: 'AT UK',
};

const draft: DraftPolicy = {
  id: 'DFT/AT UK/D20431/002', kind: 'draft', buCode: 'AT UK', policyNumber: 'D20431', extension: '002', draftStage: 'nbi',
  status: 'pending', policyName: 'Nordic Food Supply',
  insuredName: 'Polaris Tech Nordic AB', insuredCountry: 'Sweden', product: 'CAP',
  inceptionDate: '2027-01-01', expiryDate: '2027-12-31',
};

const meta: Meta<PolicyResultCardComponent> = {
  title: 'Design System/Data Display/Policy Result Card',
  component: PolicyResultCardComponent,
  tags: ['autodocs'],
  argTypes: { toggled: { action: 'toggled' }, starred: { action: 'starred' }, opened: { action: 'opened' } },
  args: { data: issued, today },
};

export default meta;
type Story = StoryObj<PolicyResultCardComponent>;

export const Issued: Story = {};
export const RenewalSoon: Story = { args: { data: { ...issued, nextRenewalDate: '2026-11-15' } } };
export const RenewalOverdue: Story = { args: { data: { ...issued, nextRenewalDate: '2026-10-20' } } };
export const Cancelled: Story = {
  args: { data: { ...issued, id: 'POL/AT UK/C7730012/0230', extension: '0230', status: 'cancelled', nextRenewalDate: undefined, cancellationDate: '2026-02-12' } },
};
export const Expired: Story = {
  args: { data: { ...issued, id: 'POL/AT UK/C7730012/0233', extension: '0233', status: 'expired', nextRenewalDate: undefined, expiryDate: '2026-03-31' } },
};
export const NoExtension: Story = {
  args: { data: { ...issued, id: 'POL/AT UK/C7730250', policyNumber: 'C7730250', extension: null, segment: undefined, lob: undefined } },
};
export const Open: Story = { args: { open: true, favorited: true } };
export const DraftApplicant: Story = {
  args: { data: { ...draft, id: 'DFT/AT UK/D20432/000', policyNumber: 'D20432', extension: '000', draftStage: 'app', status: 'issued', product: undefined } },
};
export const DraftNbi: Story = { args: { data: draft } };
export const DraftOpen: Story = { args: { data: draft, open: true } };
export const SmallWithMeta: Story = {
  args: { size: 's' },
  render: args => ({
    props: args,
    template: `<ds-policy-result-card [data]="data" [today]="today" size="s">
      <time slot="meta">Viewed yesterday</time>
    </ds-policy-result-card>`,
  }),
};
