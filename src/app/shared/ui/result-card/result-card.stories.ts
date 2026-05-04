import type { Meta, StoryObj } from '@storybook/angular';
import { ResultCardComponent, type ResultCardData } from './result-card.component';

const detailsData: ResultCardData = {
  name: 'Immobilière du Marais',
  city: 'BHV',
  address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
  companyId: '137381425',
  score: 0.6,
  exists: true,
  general: [
    { label: 'Trade sector', value: 'REAL PROPERTY LESSOR,NEC' },
    { label: 'Legal form', value: 'OTHER' },
    { label: 'States', value: 'Active' },
  ],
  financial: [{ label: 'Turnover amount', value: '$948 000' }],
  localIds: [
    { label: 'DUN', value: '126546151' },
    { label: 'TVAFR', value: 'FR1184841153' },
    { label: 'SIREN', value: '8114445221' },
    { label: 'SIRET', value: '811444522211154' },
    { label: 'Info provider', value: 'DNB' },
  ],
  providers: ['EH', 'DNB'],
};

const meta: Meta<ResultCardComponent> = {
  title: 'Local Components/Result Card',
  component: ResultCardComponent,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    toggled: { action: 'toggled' },
    added: { action: 'added' },
    starred: { action: 'starred' },
  },
};

export default meta;
type Story = StoryObj<ResultCardComponent>;

export const Closed: Story = {
  args: { data: detailsData, open: false },
};

export const Open: Story = {
  args: { data: detailsData, open: true },
};

export const NotExists: Story = {
  args: {
    data: { ...detailsData, exists: false, companyId: undefined },
    open: false,
  },
};

export const NotExistsOpen: Story = {
  args: {
    data: { ...detailsData, exists: false, companyId: undefined },
    open: true,
  },
};
