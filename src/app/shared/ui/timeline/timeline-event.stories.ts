import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TimelineComponent } from './timeline.component';
import { TimelineEventComponent } from './timeline-event.component';

const meta: Meta<TimelineEventComponent> = {
  title: 'Design System/Internals/Timeline Event',
  component: TimelineEventComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TimelineComponent] })],
  parameters: {
    docs: {
      description: {
        component: 'Atome interne au composant `ds-timeline`. Voir Timeline pour l\'usage composé complet.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    status: { control: 'select', options: ['error', 'warning', 'success', 'info', 'neutral'] },
    isLast: { control: 'boolean' },
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TimelineEventComponent>;

export const Default: Story = {
  args: { title: 'Renewal proposed', status: 'info', isLast: false, disabled: false, open: true },
  render: (args) => ({
    props: args,
    template: `
      <ds-timeline>
        <ds-timeline-event
          [title]="title"
          [status]="status"
          [isLast]="isLast"
          [disabled]="disabled"
          [open]="open"
        >
          A renewal proposal was sent to the buyer.
        </ds-timeline-event>
      </ds-timeline>
    `,
  }),
};

export const Collapsed: Story = {
  args: { title: 'Renewal proposed', status: 'info', isLast: true, disabled: false, open: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-timeline>
        <ds-timeline-event
          [title]="title"
          [status]="status"
          [isLast]="isLast"
          [disabled]="disabled"
          [open]="open"
        >
          A renewal proposal was sent to the buyer.
        </ds-timeline-event>
      </ds-timeline>
    `,
  }),
};
