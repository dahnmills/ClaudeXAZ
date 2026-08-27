import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DS_COMPONENTS } from '../design-system-audit/design-system-audit.data';
import type { LayoutConfig } from '../../shared/ui/grid-selection/grid-selection.component';
import type { PieChartSegment } from '../../shared/ui/pie-chart/pie-chart.component';
import type { PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import type { ResultCardData } from '../../shared/ui/result-card/result-card.component';
import type { FilterDefinition } from '../../shared/ui/filter-drawer/filter-drawer.component';
import type { SpotlightItem } from '../../shared/ui/spotlight/spotlight.component';
import {
  AccordionComponent,
  ActionCardComponent,
  BadgeComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  ButtonIconComponent,
  ButtonRangeComponent,
  ButtonRangeGroupComponent,
  ButtonSplitComponent,
  CardComponent,
  ChartComponent,
  CheckboxCardComponent,
  CheckboxComponent,
  ChipComponent,
  CollapsibleTableComponent,
  ConfirmDialogComponent,
  CrumbComponent,
  DateRangeComponent,
  DividerComponent,
  DrawerComponent,
  FilterDrawerComponent,
  FlagComponent,
  FlyoutComponent,
  FlyoutItemComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  FlyoutSectionComponent,
  FunctionalNoticeComponent,
  GradeComponent,
  GridSelectionComponent,
  HeaderComponent,
  IconComponent,
  IconTileComponent,
  InlineEditComponent,
  InputDateComponent,
  InputEmailComponent,
  InputSearchComponent,
  InputTextComponent,
  LinkComponent,
  ListWidgetComponent,
  LogoComponent,
  ModalComponent,
  ModalContentComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  MoreCriteriaComponent,
  NewsfeedComponent,
  PageHeaderComponent,
  PageTitleComponent,
  PaginationComponent,
  PieChartComponent,
  PopoverComponent,
  ProgressBarComponent,
  PropertiesPanelComponent,
  RadioCardComponent,
  RadioComponent,
  ResultCardComponent,
  SearchBarComponent,
  SearchBarMultiComponent,
  SegmentedControlComponent,
  SelectButtonComponent,
  SelectComponent,
  SideNavComponent,
  SideNavItemComponent,
  SnackbarComponent,
  SpotlightComponent,
  StandaloneDropdownComponent,
  StepperComponent,
  TabComponent,
  CellActionComponent,
  CellComponent,
  CellHeaderComponent,
  CellSelectionComponent,
  TableRowComponent,
  TagComponent,
  TagFilterChipComponent,
  TextareaComponent,
  TileComponent,
  TimelineComponent,
  TimelineEventComponent,
  ToasterContainerComponent,
  ToasterService,
  ToggleComponent,
  TooltipComponent,
  TopboxComponent,
  VisualButtonComponent,
  WidgetCardComponent,
} from '../../shared/ui';

const PROPERTY_SECTIONS: PropertySection[] = [
  {
    title: 'Buyer information',
    rows: [
      { label: 'Address', value: 'Vogelsanger Str. 102, Köln, Germany' },
      { label: 'Legal form', value: 'GEW' },
    ],
  },
];

const WIDGET_SECTIONS: PropertySection[] = [
  {
    rows: [
      { label: 'Exposure', value: '1 548 000' },
      { label: 'Highest limit', value: '10 000 246 000' },
    ],
  },
];

const CHART_MONTHS = ['May', 'Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jul'];
const CHART_DATA = [6, 6, 6, 7, 6, 5, 5, 6];

const PIE_SEGMENTS: PieChartSegment[] = [
  { label: 'Low risk', value: 62, tone: 'positive', tooltip: 'Low risk — 62%' },
  { label: 'Medium risk', value: 24, tone: 'warning', tooltip: 'Medium risk — 24%' },
  { label: 'High risk', value: 14, tone: 'negative', tooltip: 'High risk — 14%' },
];

const GRID_LAYOUT: LayoutConfig = {
  id: '2x2-full',
  label: '2×2',
  gridCols: 2,
  slots: [{ cols: 1, rows: 1 }, { cols: 1, rows: 1 }, { cols: 1, rows: 1 }, { cols: 1, rows: 1 }],
};

const SEGMENTED_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
];

const BUTTON_RANGE_OPTIONS = Array.from({ length: 6 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

const NEWSFEED_TAGS = [{ label: 'Positive', status: 'success' as const }];

const RESULT_CARD_DATA: ResultCardData = {
  name: 'Immobilière du Marais',
  city: 'BHV',
  address: '34 Rue de la Verrière, Paris, France',
  companyId: '137381425',
  score: 0.6,
  exists: true,
  general: [{ label: 'Trade sector', value: 'Real property lessor' }],
  financial: [{ label: 'Turnover amount', value: '$948 000' }],
  localIds: [{ label: 'SIREN', value: '811444522' }],
  providers: ['EH', 'DNB'],
};

const FILTER_DEFS: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'checkbox-list',
    defaultOpen: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'closed', label: 'Closed' },
    ],
  },
];

const STEPPER_STEPS = [
  { label: 'Identity' },
  { label: 'Address' },
  { label: 'Information & Contacts' },
  { label: 'Financial information' },
  { label: 'Activities' },
];

const TAG_FILTER_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const LIST_WIDGET_ITEMS = [
  { label: 'ManA - Grade Transfer', date: '11 nov 2024 - 16:42', badge: { label: 'High priority', status: 'error' as const } },
  { label: 'Buyer information update', date: '11 nov 2024 - 16:42', badge: { label: 'Medium priority', status: 'warning' as const } },
];

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  { id: '137381425', name: 'Amazon GB', type: 'Buyer', icon: 'buyers', status: 'Open', statusTone: 'success' },
  { id: '551023884', name: 'Amazing Loco', type: 'Buyer', icon: 'buyers' },
];

@Component({
  selector: 'app-design-system-components',
  standalone: true,
  imports: [
    RouterLink,
    AccordionComponent,
    ActionCardComponent,
    BadgeComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ButtonIconComponent,
    ButtonRangeComponent,
    ButtonRangeGroupComponent,
    ButtonSplitComponent,
    CardComponent,
    ChartComponent,
    CheckboxCardComponent,
    CheckboxComponent,
    ChipComponent,
    CollapsibleTableComponent,
    ConfirmDialogComponent,
    CrumbComponent,
    DateRangeComponent,
    DividerComponent,
    DrawerComponent,
    FilterDrawerComponent,
    FlagComponent,
    FlyoutComponent,
    FlyoutItemComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    FlyoutSectionComponent,
    FunctionalNoticeComponent,
    GradeComponent,
    GridSelectionComponent,
    HeaderComponent,
    IconComponent,
    IconTileComponent,
    InlineEditComponent,
    InputDateComponent,
    InputEmailComponent,
    InputSearchComponent,
    InputTextComponent,
    LinkComponent,
    ListWidgetComponent,
    LogoComponent,
    ModalComponent,
    ModalContentComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    MoreCriteriaComponent,
    NewsfeedComponent,
    PageHeaderComponent,
    PageTitleComponent,
    PaginationComponent,
    PieChartComponent,
    PopoverComponent,
    ProgressBarComponent,
    PropertiesPanelComponent,
    RadioCardComponent,
    RadioComponent,
    ResultCardComponent,
    SearchBarComponent,
    SearchBarMultiComponent,
    SegmentedControlComponent,
    SelectButtonComponent,
    SelectComponent,
    SideNavComponent,
    SideNavItemComponent,
    SnackbarComponent,
    SpotlightComponent,
    StandaloneDropdownComponent,
    StepperComponent,
    TabComponent,
    CellActionComponent,
    CellComponent,
    CellHeaderComponent,
    CellSelectionComponent,
    TableRowComponent,
    TagComponent,
    TagFilterChipComponent,
    TextareaComponent,
    TileComponent,
    TimelineComponent,
    TimelineEventComponent,
    ToasterContainerComponent,
    ToggleComponent,
    TooltipComponent,
    TopboxComponent,
    VisualButtonComponent,
    WidgetCardComponent,
  ],
  templateUrl: './design-system-components.component.html',
  styleUrl: './design-system-components.component.scss',
})
export class DesignSystemComponentsComponent {
  private readonly toaster = inject(ToasterService);

  readonly query = signal('');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  private readonly allComponents = [...DS_COMPONENTS].sort((a, b) => a.name.localeCompare(b.name));

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.allComponents;
    return this.allComponents.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.folder.toLowerCase().includes(q),
    );
  });

  setQuery(value: string): void {
    this.query.set(value);
  }

  showDemoToast(): void {
    this.toaster.show('This is the content displayed', { title: 'Title', tone: 'success', actionLabel: 'Action', duration: 4000 });
  }

  readonly propertySections = PROPERTY_SECTIONS;
  readonly widgetSections = WIDGET_SECTIONS;
  readonly chartMonths = CHART_MONTHS;
  readonly chartData = CHART_DATA;
  readonly pieSegments = PIE_SEGMENTS;
  readonly gridLayout = GRID_LAYOUT;
  readonly segmentedOptions = SEGMENTED_OPTIONS;
  readonly buttonRangeOptions = BUTTON_RANGE_OPTIONS;
  readonly newsfeedTags = NEWSFEED_TAGS;
  readonly resultCardData = RESULT_CARD_DATA;
  readonly filterDefs = FILTER_DEFS;
  readonly stepperSteps = STEPPER_STEPS;
  readonly tagFilterOptions = TAG_FILTER_OPTIONS;
  readonly listWidgetItems = LIST_WIDGET_ITEMS;
  readonly spotlightItems = SPOTLIGHT_ITEMS;
}
