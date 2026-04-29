import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { TopboxTestShellComponent } from './topbox-test-shell.component';
import { TopboxComponent } from '../../shared/ui/topbox/topbox.component';
import { PropertiesPanelComponent, type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent } from '../../shared/ui/page-title/page-title.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { LinkComponent } from '../../shared/ui/link/link.component';
import { ButtonIconComponent } from '../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { FlyoutMenuComponent } from '../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../shared/ui/flyout-menu/flyout-menu-item.component';
import { TableRowComponent } from '../../shared/ui/table/table-row.component';
import { CellComponent } from '../../shared/ui/table/cell.component';
import { CellHeaderComponent } from '../../shared/ui/table/cell-header.component';
import { CellSelectionComponent } from '../../shared/ui/table/cell-selection.component';
import { CellActionComponent } from '../../shared/ui/table/cell-action.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { TableToolbarComponent } from '../table-toolbar/table-toolbar.component';

const tableRows = [
  { id: '1', name: 'The Interactive College', status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: true  },
  { id: '2', name: 'Bloom Marketing',         status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: true  },
  { id: '3', name: 'The Spice Route',         status: 'Computing', statusColor: 'info',    upload: '09/05/2023', isNew: false },
  { id: '4', name: 'Gourmet Sandwich',        status: 'Uploaded',  statusColor: 'success', upload: '05/05/2023', isNew: false },
  { id: '5', name: 'Ready Continental',       status: 'Uploaded',  statusColor: 'success', upload: '05/05/2023', isNew: false },
  { id: '6', name: 'My Vegetarian Dinner',    status: 'Uploaded',  statusColor: 'success', upload: '04/05/2023', isNew: false },
  { id: '7', name: 'Evergrow',                status: 'Uploaded',  statusColor: 'success', upload: '04/05/2023', isNew: false },
];

const sections: PropertySection[] = [
  {
    title: 'Buyer information',
    rows: [
      { label: 'Address',       value: 'Vogelsanger Str. 102, Köln. Germany (DE)' },
      { label: 'Legal form',    value: 'GEW' },
      { label: 'BU',            value: 'HERM' },
      { label: 'Origin status', value: 'CLOU' },
      { label: 'Origin status', value: 'CREF 5191123339 FCDE 219/5142/3040' },
    ],
  },
  {
    title: 'Risk',
    rows: [
      { label: 'Main trade sector',         value: 'NACE2 4637' },
      { label: 'Trade sector color',        value: null },
      { label: 'Sanctioned buyer',          value: null },
      { label: 'Sensitivity / Review Cat',  value: null },
      { label: 'Special Risk Underwriting', value: null },
    ],
  },
  {
    title: 'Policy',
    rows: [
      { label: 'Role / Policy Segment', value: null },
      { label: 'Policy Color',          value: null },
      { label: 'Strategic Policy',      value: null },
      { label: 'Insured BU',            value: null },
    ],
  },
  {
    title: 'Group',
    rows: [
      { label: 'Group Head',     value: null },
      { label: 'Group Status',   value: null },
      { label: 'Group Grade',    value: null },
      { label: 'Group exposure', value: null },
    ],
  },
];

const toolbar = {
  primaryLabel: 'Primary',
  secondaryLabel: 'Secondary',
  tertiaryLabel: 'Tertiary',
};

const meta: Meta = {
  title: 'User Testing/Topbox/With Accordion',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Page complète avec header Qirin + side-nav + Topbox (variant chevron) + page-header. Click sur le chevron déplie/replie la grille de propriétés en accordéon inline animé. Le bouton "More actions" (3 points) ouvre un flyout-menu.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        TopboxTestShellComponent,
        TopboxComponent,
        PropertiesPanelComponent,
        PageHeaderComponent,
        BreadcrumbsComponent,
        CrumbComponent,
        PageTitleComponent,
        TabComponent,
        LinkComponent,
        ButtonIconComponent,
        IconComponent,
        FlyoutMenuComponent,
        FlyoutMenuItemComponent,
        TableRowComponent,
        CellComponent,
        CellHeaderComponent,
        CellSelectionComponent,
        CellActionComponent,
        BadgeComponent,
        TableToolbarComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: {
      isExpanded: signal(false),
      menuOpen:   signal(false),
      sortDir:    signal<'asc' | 'desc' | null>('asc'),
      checked:    signal<Record<string, boolean>>({}),
      activeId:   signal<string | null>(null),
      sections,
      tableRows,
      toolbar,
      toggleCheck(rowId: string, current: Record<string, boolean>, value: boolean, target: ReturnType<typeof signal<Record<string, boolean>>>): void {
        target.set({ ...current, [rowId]: value });
      },
      countChecked(map: Record<string, boolean>): number {
        return Object.values(map).filter(Boolean).length;
      },
      toggleAll(rows: typeof tableRows, target: ReturnType<typeof signal<Record<string, boolean>>>, selectAll: boolean): void {
        if (selectAll) {
          target.set(rows.reduce<Record<string, boolean>>((acc, r) => (acc[r.id] = true, acc), {}));
        } else {
          target.set({});
        }
      },
    },
    template: `
      <app-topbox-test-shell [extensionExpanded]="isExpanded()">
        <ds-topbox
          slot="topbox"
          dataType="buyer"
          icon="buyers"
          label="CANDY HOSS KAFFEEVERTRIEB (DE)"
          id="137381425"
          grade="A3"
          gradeColor="grade-2"
          [highRisk]="true"
          [sru]="true"
          [sanction]="true"
          actionLabel="View full properties"
          actionType="chevron"
          [expanded]="isExpanded()"
          (actionClicked)="isExpanded.set(!isExpanded())"
        />

        <!-- Toujours rendu : l'animation est gérée par le shell via [extensionExpanded].
             Même bg que la Topbox (Grey/050) pour un effet "extension continue" sans bordure. -->
        <div slot="topbox-extension"
             style="background:var(--semantic-color-static-background-main-secondary);padding:16px 32px;border-bottom:1px solid var(--semantic-color-static-border-subtle-tertiary);">
          <ds-properties-panel [sections]="sections" [columns]="4" variant="flat" />
        </div>

        <ds-page-header [topbox]="false" [breadcrumb]="true" [tabs]="true">
          <ds-breadcrumbs slot="breadcrumbs">
            <ds-crumb label="Home" href="#" />
            <ds-crumb label="Crumb" href="#" />
            <ds-crumb label="Current page" currentPage />
          </ds-breadcrumbs>

          <ds-page-title slot="title" title="Current page">
            <div slot="actions" style="display:flex;gap:16px;align-items:center;">
              <ds-link href="#" weight="semi-bold">
                <ds-icon slot="icon-left" name="arrow-right" [size]="16" />
                Go to documents
              </ds-link>
              <ds-link href="#" weight="semi-bold">
                <ds-icon slot="icon-left" name="edit" [size]="16" />
                Edit something
              </ds-link>

              <!-- More actions : bouton + flyout-menu absolu -->
              <div style="position:relative;">
                <ds-button-icon
                  type="plain"
                  ariaLabel="More actions"
                  (clicked)="menuOpen.set(!menuOpen())"
                >
                  <ds-icon name="context-vertical" [size]="16" />
                </ds-button-icon>

                @if (menuOpen()) {
                  <ds-flyout-menu
                    style="position:absolute;right:0;top:calc(100% + 4px);z-index:50;"
                  >
                    <ds-flyout-menu-item label="Duplicate" icon="duplicate" (clicked)="menuOpen.set(false)" />
                    <ds-flyout-menu-item label="Archive"   icon="archive"   (clicked)="menuOpen.set(false)" />
                    <ds-flyout-menu-item label="Share"     icon="share"     (clicked)="menuOpen.set(false)" />
                    <ds-flyout-menu-item label="Delete"    icon="trash"     [disabled]="true" />
                  </ds-flyout-menu>
                }
              </div>
            </div>
          </ds-page-title>

          <div slot="tabs" style="display:flex;gap:32px;">
            <ds-tab [selected]="true">Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
            <ds-tab>Label</ds-tab>
          </div>
        </ds-page-header>

        <!-- Design System table -->
        <div style="padding:32px;">
          <app-table-toolbar
            [primaryLabel]="toolbar.primaryLabel"
            [secondaryLabel]="toolbar.secondaryLabel"
            [tertiaryLabel]="toolbar.tertiaryLabel"
          />

          <ds-table-row>
            <ds-cell-header
              type="selection"
              [allSelected]="countChecked(checked()) === tableRows.length"
              [allIndeterminate]="countChecked(checked()) > 0 && countChecked(checked()) < tableRows.length"
              (allSelectedChange)="toggleAll(tableRows, checked, $event)"
            />
            <ds-cell-header style="flex:1;" type="default" title="File name"
              [sortable]="true" [sortDirection]="sortDir()"
              (sortClicked)="sortDir.set(sortDir() === 'asc' ? 'desc' : 'asc')" />
            <ds-cell-header style="flex:1;" type="default" title="Status" />
            <ds-cell-header style="flex:1;" type="default" title="Initial upload" [sortable]="true" />
            <ds-cell-header type="action" />
          </ds-table-row>

          @for (row of tableRows; track row.id) {
            <ds-table-row
              [state]="activeId() === row.id ? 'active' : 'default'"
              [interactive]="true"
              [new]="row.isNew"
              (clicked)="activeId.set(row.id)"
            >
              <ds-cell-selection
                control="check"
                [checked]="!!checked()[row.id]"
                (checkedChange)="toggleCheck(row.id, checked(), $event, checked)"
              />
              <ds-cell style="flex:1;">{{ row.name }}</ds-cell>
              <ds-cell style="flex:1;">
                <ds-badge [label]="row.status" [status]="row.statusColor" variant="strong" size="s" />
              </ds-cell>
              <ds-cell style="flex:1;">{{ row.upload }}</ds-cell>
              <ds-cell-action ariaLabel="Row actions">
                <ds-flyout-menu slot="menu">
                  <ds-flyout-menu-item label="Edit"      icon="edit" />
                  <ds-flyout-menu-item label="Duplicate" icon="duplicate" />
                  <ds-flyout-menu-item label="Archive"   icon="archive" />
                  <ds-flyout-menu-item label="Delete"    icon="trash" />
                </ds-flyout-menu>
              </ds-cell-action>
            </ds-table-row>
          }
        </div>
      </app-topbox-test-shell>
    `,
  }),
};
