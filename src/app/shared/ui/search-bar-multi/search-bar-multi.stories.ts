import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarMultiComponent } from './search-bar-multi.component';

const meta: Meta<SearchBarMultiComponent> = {
  title: 'Local Components/Search Bar Multi',
  component: SearchBarMultiComponent,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['company-id', 'id', 'name', 'phone', 'manager'] },
    criteriaCount: { control: 'number' },
    moreCriteriaClicked: { action: 'moreCriteriaClicked' },
    searchClicked: { action: 'searchClicked' },
  },
};

export default meta;
type Story = StoryObj<SearchBarMultiComponent>;

export const Default: Story = {
  args: { type: 'company-id', criteriaCount: 0 },
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <ds-search-bar-multi type="company-id" />
        <ds-search-bar-multi type="id" />
        <ds-search-bar-multi type="name" />
        <ds-search-bar-multi type="phone" />
        <ds-search-bar-multi type="manager" />
      </div>
    `,
  }),
};
