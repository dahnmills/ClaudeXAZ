import type { Meta, StoryObj } from '@storybook/angular';
import { SearchComponent } from './search.component';

const meta: Meta<SearchComponent> = {
  title: 'Pages/Search',
  component: SearchComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<SearchComponent>;

export const Default: Story = {
  args: { state: 'default' },
};

export const Results: Story = {
  args: { state: 'results' },
};
