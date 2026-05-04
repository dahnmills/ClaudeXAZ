import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { CrumbComponent } from '../crumb/crumb.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<BreadcrumbsComponent> = {
  title: 'Design System/Breadcrumbs',
  component: BreadcrumbsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [CrumbComponent, LinkComponent, ButtonIconComponent, IconComponent] }),
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

export const WithActions: Story = {
  name: 'With actions',
  render: () => ({
    template: `
      <ds-breadcrumbs>
        <ds-crumb label="Home" href="#" />
        <ds-crumb label="Buyers" href="#" />
        <ds-crumb label="IMMO DU MARAIS" currentPage />
        <div slot="actions" style="display:flex;gap:16px;align-items:center;">
          <ds-link href="#" weight="semi-bold">
            <ds-icon slot="icon-left" name="arrow-right" [size]="16" />
            Go to documents
          </ds-link>
          <ds-link href="#" weight="semi-bold">
            <ds-icon slot="icon-left" name="edit" [size]="16" />
            Edit something
          </ds-link>
          <ds-button-icon type="plain" ariaLabel="More actions">
            <ds-icon name="context-vertical" [size]="16" />
          </ds-button-icon>
        </div>
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
