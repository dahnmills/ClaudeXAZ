import type { Meta, StoryObj } from '@storybook/angular';
import { FunctionalNoticeComponent } from './functional-notice.component';

const meta: Meta<FunctionalNoticeComponent> = {
  title: 'Design System/Feedback/Functional Notice',
  component: FunctionalNoticeComponent,
  tags: ['autodocs'],
  argTypes: {
    status:      { control: 'select', options: ['info', 'success', 'warning', 'error', 'default'] },
    emphasis:    { control: 'inline-radio', options: ['high', 'medium', 'low'] },
    title:       { control: 'text' },
    message:     { control: 'text' },
    dismissible: { control: 'boolean' },
    dismissed:   { action: 'dismissed' },
  },
};

export default meta;
type Story = StoryObj<FunctionalNoticeComponent>;

export const Playground: Story = {
  args: {
    status: 'info',
    emphasis: 'high',
    title: 'Title',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dismissible: true,
  },
};

/** Toutes les emphases × tous les status — vue de comparaison */
export const Matrix: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Emphasis : High</h4>
          <div style="display:flex;flex-direction:column;gap:8px;max-width:600px;">
            <ds-functional-notice status="info"    emphasis="high" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="success" emphasis="high" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="warning" emphasis="high" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="error"   emphasis="high" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Emphasis : Medium</h4>
          <div style="display:flex;flex-direction:column;gap:8px;max-width:600px;">
            <ds-functional-notice status="info"    emphasis="medium" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="success" emphasis="medium" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="warning" emphasis="medium" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="error"   emphasis="medium" title="Title" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Emphasis : Low (inline)</h4>
          <div style="display:flex;flex-direction:column;gap:8px;max-width:600px;">
            <ds-functional-notice status="info"    emphasis="low" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="success" emphasis="low" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="warning" emphasis="low" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="error"   emphasis="low" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
            <ds-functional-notice status="default" emphasis="low" message="Lorem ipsum dolor sit amet."></ds-functional-notice>
          </div>
        </div>
      </div>
    `,
  }),
};
