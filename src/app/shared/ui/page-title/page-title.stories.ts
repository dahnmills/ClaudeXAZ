import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { PageTitleComponent } from './page-title.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<PageTitleComponent> = {
  title: 'Design System/Page Title',
  component: PageTitleComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [LinkComponent, ButtonIconComponent, IconComponent] }),
  ],
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<PageTitleComponent>;

export const Default: Story = {
  args: { title: 'Current page' },
  render: (args) => ({
    props: args,
    template: `<ds-page-title [title]="title" />`,
  }),
};

export const WithActions: Story = {
  name: 'With actions',
  args: { title: 'Current page' },
  render: (args) => ({
    props: args,
    template: `
      <ds-page-title [title]="title">
        <div slot="actions" style="display:flex;gap:16px;align-items:center;">
          <ds-link href="#" weight="semi-bold">
            <ds-icon slot="icon-left" name="arrow-right" [size]="16" />
            Go to documents
          </ds-link>
          <ds-link href="#" weight="semi-bold">
            <ds-icon slot="icon-left" name="edit" [size]="16" />
            Edit something
          </ds-link>
          <ds-button-icon type="plain" ariaLabel="More actions">
            <ds-icon name="context-vertical" [size]="16" />
          </ds-button-icon>
        </div>
      </ds-page-title>
    `,
  }),
};
