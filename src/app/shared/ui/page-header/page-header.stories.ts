import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { PageHeaderComponent } from './page-header.component';
import { TopboxComponent } from '../topbox/topbox.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../crumb/crumb.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { TabComponent } from '../tab/tab.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<PageHeaderComponent> = {
  title: 'Design System/Page Header',
  component: PageHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        TopboxComponent,
        BreadcrumbsComponent,
        CrumbComponent,
        PageTitleComponent,
        TabComponent,
        LinkComponent,
        ButtonIconComponent,
        IconComponent,
      ],
    }),
  ],
  argTypes: {
    topbox:     { control: 'boolean' },
    breadcrumb: { control: 'boolean' },
    tabs:       { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<PageHeaderComponent>;

export const Full: Story = {
  args: { topbox: true, breadcrumb: true, tabs: true },
  render: (args) => ({
    props: args,
    template: `
      <ds-page-header [topbox]="topbox" [breadcrumb]="breadcrumb" [tabs]="tabs">
        <ds-topbox
          slot="topbox"
          dataType="buyer"
          icon="buyers"
          label="IMMO DU MARAIS"
          id="BU-1284723"
          grade="M4"
          gradeColor="grade-4"
          [highRisk]="true"
          [sru]="true"
          [sanction]="true"
          actionLabel="View full details"
          actionIcon="info-circle"
        />

        <ds-breadcrumbs slot="breadcrumbs">
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

        <ds-page-title slot="title" title="Current page" />

        <div slot="tabs" style="display:flex;gap:32px;">
          <ds-tab [selected]="true">Label</ds-tab>
          <ds-tab>Label</ds-tab>
        </div>
      </ds-page-header>
    `,
  }),
};

export const TitleOnly: Story = {
  name: 'Title only',
  args: { topbox: false, breadcrumb: false, tabs: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-page-header [topbox]="topbox" [breadcrumb]="breadcrumb" [tabs]="tabs">
        <ds-page-title slot="title" title="Current page" />
      </ds-page-header>
    `,
  }),
};

export const WithBreadcrumbsAndTitle: Story = {
  name: 'Breadcrumbs + Title',
  args: { topbox: false, breadcrumb: true, tabs: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-page-header [topbox]="topbox" [breadcrumb]="breadcrumb" [tabs]="tabs">
        <ds-breadcrumbs slot="breadcrumbs">
          <ds-crumb label="Crumb" href="#" />
          <ds-crumb label="Crumb" currentPage />
        </ds-breadcrumbs>
        <ds-page-title slot="title" title="Current page" />
      </ds-page-header>
    `,
  }),
};

export const PolicyContext: Story = {
  name: 'Policy — full',
  args: { topbox: true, breadcrumb: true, tabs: true },
  render: (args) => ({
    props: args,
    template: `
      <ds-page-header [topbox]="topbox" [breadcrumb]="breadcrumb" [tabs]="tabs">
        <ds-topbox
          slot="topbox"
          dataType="policy"
          icon="shield"
          label="Trade Credit Policy"
          id="POL-9931"
          grade="Y"
          gradeColor="grade-4"
          actionLabel="Policies"
          actionIcon="chevron-right"
          actionIconPosition="right"
        />
        <ds-breadcrumbs slot="breadcrumbs">
          <ds-crumb label="Policies" href="#" />
          <ds-crumb label="Trade Credit" currentPage />
        </ds-breadcrumbs>
        <ds-page-title slot="title" title="Trade Credit Policy" />
        <div slot="tabs" style="display:flex;gap:32px;">
          <ds-tab [selected]="true">Overview</ds-tab>
          <ds-tab>History</ds-tab>
        </div>
      </ds-page-header>
    `,
  }),
};
