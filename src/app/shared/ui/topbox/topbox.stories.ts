import type { Meta, StoryObj } from '@storybook/angular';
import { TopboxComponent } from './topbox.component';

const meta: Meta<TopboxComponent> = {
  title: 'Design System/Topbox',
  component: TopboxComponent,
  tags: ['autodocs'],
  argTypes: {
    dataType:    { control: 'select', options: ['policy', 'buyer'] },
    icon:        { control: 'text' },
    label:       { control: 'text' },
    id:          { control: 'text' },
    grade:       { control: 'text' },
    gradeColor:  { control: 'select', options: ['grade-1','grade-2','grade-3','grade-4','grade-5','grade-6','grade-7','grade-8','grade-9','grade-10','grade-none'] },
    highRisk:    { control: 'boolean' },
    sru:         { control: 'boolean' },
    sanction:    { control: 'boolean' },
    actionLabel:        { control: 'text' },
    actionIcon:         { control: 'text' },
    actionIconPosition: { control: 'select', options: ['left', 'right'] },
    actionType:         { control: 'select', options: ['button', 'chevron'] },
    expanded:           { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TopboxComponent>;

export const BuyerFull: Story = {
  name: 'Buyer — full',
  args: {
    dataType:    'buyer',
    icon:        'buyers',
    label:       'IMMO DU MARAIS',
    id:          'BU-1284723',
    grade:       'M4',
    gradeColor:  'grade-4',
    highRisk:    true,
    sru:         true,
    sanction:    true,
    actionLabel: 'View full details',
    actionIcon:  'info-circle',
  },
  render: (args) => ({
    props: args,
    template: `<ds-topbox
      [dataType]="dataType"
      [icon]="icon"
      [label]="label"
      [id]="id"
      [grade]="grade"
      [gradeColor]="gradeColor"
      [highRisk]="highRisk"
      [sru]="sru"
      [sanction]="sanction"
      [actionLabel]="actionLabel"
      [actionIcon]="actionIcon"
    />`,
  }),
};

export const PolicyMinimal: Story = {
  name: 'Policy — minimal',
  args: {
    dataType:    'policy',
    icon:        'shield',
    label:       'Trade Credit Policy',
    id:          'POL-9931',
    grade:              'Y',
    gradeColor:         'grade-4',
    actionLabel:        'Policies',
    actionIcon:         'chevron-right',
    actionIconPosition: 'right',
  },
  render: (args) => ({
    props: args,
    template: `<ds-topbox
      [dataType]="dataType"
      [icon]="icon"
      [label]="label"
      [id]="id"
      [grade]="grade"
      [gradeColor]="gradeColor"
      [actionLabel]="actionLabel"
      [actionIcon]="actionIcon"
      [actionIconPosition]="actionIconPosition"
    />`,
  }),
};

export const ChevronCollapsed: Story = {
  name: 'Chevron — collapsed',
  args: {
    dataType:    'buyer',
    icon:        'buyers',
    label:       'CANDY HOSS KAFFEEVERTRIEB (DE)',
    id:          '137381425',
    grade:       'A3',
    gradeColor:  'grade-2',
    highRisk:    true,
    sru:         true,
    sanction:    true,
    actionLabel: 'View full properties',
    actionType:  'chevron',
    expanded:    false,
  },
  render: (args) => ({
    props: args,
    template: `<ds-topbox
      [dataType]="dataType"
      [icon]="icon"
      [label]="label"
      [id]="id"
      [grade]="grade"
      [gradeColor]="gradeColor"
      [highRisk]="highRisk"
      [sru]="sru"
      [sanction]="sanction"
      [actionLabel]="actionLabel"
      [actionType]="actionType"
      [expanded]="expanded"
    />`,
  }),
};

export const ChevronExpanded: Story = {
  name: 'Chevron — expanded',
  args: {
    dataType:    'buyer',
    icon:        'buyers',
    label:       'CANDY HOSS KAFFEEVERTRIEB (DE)',
    id:          '137381425',
    grade:       'A3',
    gradeColor:  'grade-2',
    highRisk:    true,
    sru:         true,
    sanction:    true,
    actionLabel: 'View full properties',
    actionType:  'chevron',
    expanded:    true,
  },
  render: (args) => ({
    props: args,
    template: `<ds-topbox
      [dataType]="dataType"
      [icon]="icon"
      [label]="label"
      [id]="id"
      [grade]="grade"
      [gradeColor]="gradeColor"
      [highRisk]="highRisk"
      [sru]="sru"
      [sanction]="sanction"
      [actionLabel]="actionLabel"
      [actionType]="actionType"
      [expanded]="expanded"
    />`,
  }),
};

export const NoFlags: Story = {
  name: 'Buyer — no flags',
  args: {
    dataType:    'buyer',
    icon:        'buyers',
    label:       'EASYJET',
    id:          'BU-77721',
    grade:       'M2',
    gradeColor:  'grade-2',
  },
  render: (args) => ({
    props: args,
    template: `<ds-topbox
      [dataType]="dataType"
      [icon]="icon"
      [label]="label"
      [id]="id"
      [grade]="grade"
      [gradeColor]="gradeColor"
    />`,
  }),
};
