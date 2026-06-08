import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TimelineComponent } from './timeline.component';
import { TimelineEventComponent } from './timeline-event.component';

const meta: Meta<TimelineComponent> = {
  title: 'Design System/Data Display/Timeline',
  component: TimelineComponent,
  decorators: [moduleMetadata({ imports: [TimelineComponent, TimelineEventComponent] })],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TimelineComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <ds-timeline>
        <ds-timeline-event title="Policy created"  status="success" [open]="true">
          Policy P-12345 was created on 2025-09-12.
        </ds-timeline-event>
        <ds-timeline-event title="Renewal proposed" status="info">
          A renewal proposal was sent to the buyer.
        </ds-timeline-event>
        <ds-timeline-event title="Late payment"     status="warning">
          The buyer is late on their last invoice.
        </ds-timeline-event>
        <ds-timeline-event title="Claim opened"     status="error">
          A claim was opened on this policy.
        </ds-timeline-event>
        <ds-timeline-event title="Closed"           status="neutral" [isLast]="true">
          Final state.
        </ds-timeline-event>
      </ds-timeline>
    `,
  }),
};

export const SingleEvent: Story = {
  render: () => ({
    template: `
      <ds-timeline>
        <ds-timeline-event title="Single event" status="info" [isLast]="true" [open]="true">
          Just one item — no descending line.
        </ds-timeline-event>
      </ds-timeline>
    `,
  }),
};
