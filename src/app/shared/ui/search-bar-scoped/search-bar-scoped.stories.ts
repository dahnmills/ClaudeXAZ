import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarScopedComponent } from './search-bar-scoped.component';

const meta: Meta<SearchBarScopedComponent> = {
  title: 'Design System/Data Entry/Search Bar Scoped',
  component: SearchBarScopedComponent,
  tags: ['autodocs'],
  argTypes: { searchClicked: { action: 'searchClicked' }, moreCriteriaClicked: { action: 'moreCriteriaClicked' } },
};

export default meta;
type Story = StoryObj<SearchBarScopedComponent>;

export const Buyers: Story = { args: { scope: 'buyers', type: 'name', country: 'fr' } };
export const Policies: Story = { args: { scope: 'policies', buCode: 'AT USA', criteriaCount: 1 } };
export const PoliciesAllBus: Story = { args: { scope: 'policies', buCode: null, criteriaCount: 1 } };
