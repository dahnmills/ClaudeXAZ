import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ModalFooterComponent } from './modal-footer.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<ModalFooterComponent> = {
  title: 'Design System/Internals/Modal Footer',
  component: ModalFooterComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atom interne au composant `ds-modal`. Ne pas utiliser hors contexte d\'une modal.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, IconComponent] }),
  ],
  argTypes: {
    showBack:  { control: 'boolean' },
    backLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ModalFooterComponent>;

export const Full: Story = {
  args: { showBack: true, backLabel: 'Back' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-modal-footer [showBack]="showBack" [backLabel]="backLabel">
          <div slot="actions">
            <ds-button type="tertiary">
              <ds-icon slot="icon-left" name="edit" [size]="16" />
              Label
            </ds-button>
            <ds-button type="secondary">
              <ds-icon slot="icon-left" name="edit" [size]="16" />
              Label
            </ds-button>
            <ds-button type="primary">
              <ds-icon slot="icon-left" name="edit" [size]="16" />
              Label
            </ds-button>
          </div>
        </ds-modal-footer>
      </div>
    `,
  }),
};

export const PrimaryOnly: Story = {
  name: 'Primary CTA only',
  args: { showBack: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-modal-footer [showBack]="showBack">
          <div slot="actions">
            <ds-button type="primary">Confirm</ds-button>
          </div>
        </ds-modal-footer>
      </div>
    `,
  }),
};

export const NoBack: Story = {
  name: 'Without Back',
  args: { showBack: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:780px;">
        <ds-modal-footer [showBack]="showBack">
          <div slot="actions">
            <ds-button type="secondary">Cancel</ds-button>
            <ds-button type="primary">Save</ds-button>
          </div>
        </ds-modal-footer>
      </div>
    `,
  }),
};
