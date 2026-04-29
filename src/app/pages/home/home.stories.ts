import type { Meta, StoryObj } from '@storybook/angular';
import { HomeComponent } from './home.component';

const meta: Meta<HomeComponent> = {
  title: 'Pages/Home',
  component: HomeComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<HomeComponent>;

export const Default: Story = {};
