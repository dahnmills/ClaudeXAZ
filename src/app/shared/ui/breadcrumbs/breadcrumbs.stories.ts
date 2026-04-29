import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { CrumbComponent } from '../crumb/crumb.component';

const meta: Meta<BreadcrumbsComponent> = {
  title: 'Design System/Breadcrumbs',
  component: BreadcrumbsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [CrumbComponent] }),
  ],
};

export default meta;
type Story = StoryObj<BreadcrumbsComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <ds-breadcrumbs>
        <ds-crumb label="Home" href="#" />
        <ds-crumb label="Buyers" href="#" />
        <ds-crumb label="IMMO DU MARAIS" currentPage />
      </ds-breadcrumbs>
    `,
  }),
};

export const TwoLevels: Story = {
  name: 'Two levels',
  render: () => ({
    template: `
      <ds-breadcrumbs>
        <ds-crumb label="Crumb" href="#" />
        <ds-crumb label="Crumb" currentPage />
      </ds-breadcrumbs>
    `,
  }),
};

export const SingleCurrent: Story = {
  name: 'Current only',
  render: () => ({
    template: `
      <ds-breadcrumbs>
        <ds-crumb label="Current page" currentPage />
      </ds-breadcrumbs>
    `,
  }),
};
