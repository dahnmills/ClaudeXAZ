import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfirmDialogComponent } from './confirm-dialog.component';

const meta: Meta<ConfirmDialogComponent> = {
  title: 'Design System/Feedback/Popin',
  component: ConfirmDialogComponent,
  decorators: [moduleMetadata({ imports: [ConfirmDialogComponent] })],
  tags: ['autodocs'],
  argTypes: {
    tone:         { control: 'select', options: ['warning', 'danger', 'info'] },
    confirmLabel: { control: 'text' },
    cancelLabel:  { control: 'text' },
    open:         { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ConfirmDialogComponent>;

export const Warning: Story = {
  args: {
    open: true,
    title: 'Title',
    tone: 'warning',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-confirm-dialog
        [open]="open"
        [title]="title"
        [tone]="tone"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
      >
        Are you sure you want to leave ? All your work will not be saved !
      </ds-confirm-dialog>
    `,
  }),
};

export const Danger: Story = {
  args: { open: true, title: 'Delete this item ?', tone: 'danger', confirmLabel: 'Delete', cancelLabel: 'Cancel' },
  render: (args) => ({
    props: args,
    template: `
      <ds-confirm-dialog
        [open]="open"
        [title]="title"
        [tone]="tone"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
      >
        This action cannot be undone.
      </ds-confirm-dialog>
    `,
  }),
};

export const Info: Story = {
  args: { open: true, title: 'Heads up', tone: 'info', confirmLabel: 'Got it', cancelLabel: 'Skip' },
  render: (args) => ({
    props: args,
    template: `
      <ds-confirm-dialog
        [open]="open"
        [title]="title"
        [tone]="tone"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
      >
        Important information you should know.
      </ds-confirm-dialog>
    `,
  }),
};
