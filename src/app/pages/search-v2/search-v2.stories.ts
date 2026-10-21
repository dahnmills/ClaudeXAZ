import type { Meta, StoryObj } from '@storybook/angular';
import { SearchV2Component } from './search-v2.component';

const meta: Meta<SearchV2Component> = {
  title: 'Pages/Search V2',
  component: SearchV2Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<SearchV2Component>;

export const Default: Story = { args: { state: 'default' } };
export const Results: Story = { args: { state: 'results' } };
