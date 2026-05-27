import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { DrawerComponent } from './drawer.component';

const meta: Meta<DrawerComponent> = {
  title: 'Design System/Layout/Drawer',
  component: DrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, DrawerComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<DrawerComponent>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Filters',
  },
  render: (args) => ({
    props: args,
    styles: [`
      .drawer-story__content {
        padding: var(--semantic-measurement-spacing-none) var(--semantic-measurement-spacing-xl) var(--semantic-measurement-spacing-xl);
        font: var(--semantic-font-text-style-size-l) / var(--semantic-font-text-style-line-height-l) var(--semantic-font-family);
      }

      .drawer-story__footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--semantic-measurement-spacing-s);
        padding: var(--semantic-measurement-spacing-m) var(--semantic-measurement-spacing-xl);
        background: var(--semantic-color-static-background-subtle-secondary);
      }
    `],
    template: `
      <ds-drawer [open]="open" [title]="title">
        <div class="drawer-story__content">
          Drawer content
        </div>
        <div slot="footer" class="drawer-story__footer">
          <ds-button type="secondary">Cancel</ds-button>
          <ds-button type="primary">Apply</ds-button>
        </div>
      </ds-drawer>
    `,
  }),
};
