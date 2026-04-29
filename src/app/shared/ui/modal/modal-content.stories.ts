import type { Meta, StoryObj } from '@storybook/angular';
import { ModalContentComponent } from './modal-content.component';

const meta: Meta<ModalContentComponent> = {
  title: 'Design System/Internals/Modal Content',
  component: ModalContentComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-modal`. Ne pas utiliser hors contexte d\'une modal.',
      },
    },
  },
  argTypes: {
    height: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ModalContentComponent>;

export const Default: Story = {
  args: { height: '460px' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-modal-content [height]="height">
          <p>Modal content goes here. The container scrolls vertically when content overflows.</p>
        </ds-modal-content>
      </div>
    `,
  }),
};

export const Scrollable: Story = {
  name: 'Scrollable',
  args: { height: '300px' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-modal-content [height]="height">
          <p>Scroll down to see more content.</p>
          @for (n of [].constructor(20); track $index) {
            <p>Line {{ $index + 1 }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          }
        </ds-modal-content>
      </div>
    `,
  }),
};
