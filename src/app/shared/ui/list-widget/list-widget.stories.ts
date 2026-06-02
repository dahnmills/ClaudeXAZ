import type { Meta, StoryObj } from '@storybook/angular';
import { ListWidgetComponent } from './list-widget.component';

const meta: Meta<ListWidgetComponent> = {
  title: 'Design System/Data Display/List Widget',
  component: ListWidgetComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<ListWidgetComponent>;

/** Widget "Job to do" — items avec badge de priorité, icône d'action = lien externe. */
export const JobToDo: Story = {
  args: {
    title: 'Job to do',
    actionIcon: 'export-share',
    items: [
      { label: 'ManA - Grade Transfer', date: '11 nov 2024 - 16:42', badge: { label: 'High priority', status: 'error' } },
      { label: 'Buyer information update', date: '11 nov 2024 - 16:42', badge: { label: 'Medium priority', status: 'warning' } },
      { label: 'CLR', date: '11 nov 2024 - 16:42', badge: { label: 'Low priority', status: 'success' } },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:300px;height:258px;">
      <ds-list-widget [title]="title" [actionIcon]="actionIcon" [items]="items" />
    </div>`,
  }),
};

/** Widget "Notepad" — rappels avec badge info, icône d'action = menu contextuel. */
export const Notepad: Story = {
  args: {
    title: 'Notepad',
    actionIcon: 'context-vertical',
    items: [
      { label: 'Reminder 1', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
      { label: 'Reminder 2', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
      { label: 'Reminder 3', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:300px;height:258px;">
      <ds-list-widget [title]="title" [actionIcon]="actionIcon" [items]="items" />
    </div>`,
  }),
};
