import { Component, signal } from '@angular/core';
import { TopboxTestShellComponent } from '../topbox/topbox-test-shell.component';
import { TopboxComponent } from '../../shared/ui/topbox/topbox.component';
import { PropertiesPanelComponent } from '../../shared/ui/properties-panel/properties-panel.component';
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
import { SECTIONS, TABLE_ROWS, type TableRow } from '../mocks';

@Component({
  selector: 'app-with-accordion-page',
  standalone: true,
  imports: [
    TopboxTestShellComponent, TopboxComponent, PropertiesPanelComponent,
    PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    TabComponent, LinkComponent, ButtonIconComponent, IconComponent,
    FlyoutMenuComponent, FlyoutMenuItemComponent,
    TableRowComponent, CellComponent, CellHeaderComponent,
    CellSelectionComponent, CellActionComponent, BadgeComponent,
  ],
  templateUrl: './with-accordion.page.html',
})
export class WithAccordionPage {
  isExpanded = signal(false);
  menuOpen   = signal(false);
  sortDir    = signal<'asc' | 'desc' | null>('asc');
  checked    = signal<Record<string, boolean>>({});
  activeId   = signal<string | null>(null);

  sections   = SECTIONS;
  tableRows  = TABLE_ROWS;

  countChecked(map: Record<string, boolean>): number {
    return Object.values(map).filter(Boolean).length;
  }

  toggleAll(rows: TableRow[], selectAll: boolean): void {
    this.checked.set(selectAll
      ? rows.reduce<Record<string, boolean>>((acc, r) => (acc[r.id] = true, acc), {})
      : {});
  }

  toggleRow(id: string, value: boolean): void {
    this.checked.set({ ...this.checked(), [id]: value });
  }
}
