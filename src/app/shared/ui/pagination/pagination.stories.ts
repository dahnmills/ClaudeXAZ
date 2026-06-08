import type { Meta, StoryObj } from '@storybook/angular';
import { PaginationComponent } from './pagination.component';

const meta: Meta<PaginationComponent> = {
  title: 'Design System/Action/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
  argTypes: {
    style:         { control: 'inline-radio', options: ['classic', 'infinite'] },
    page:          { control: { type: 'number', min: 1 } },
    total:         { control: { type: 'number', min: 1 } },
    siblings:      { control: { type: 'number', min: 0, max: 3 } },
    showFirstLast: { control: 'boolean' },
    pageChange:    { action: 'pageChange' },
  },
};

export default meta;
type Story = StoryObj<PaginationComponent>;

export const Playground: Story = {
  args: { style: 'classic', page: 17, total: 21, siblings: 2, showFirstLast: true },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Infinite scroll</h4>
          <ds-pagination [style]="'infinite'" [page]="12" [total]="32"></ds-pagination>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Classic — short range</h4>
          <ds-pagination [page]="3" [total]="5" [siblings]="1" [showFirstLast]="true"></ds-pagination>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Classic — long range avec ellipses</h4>
          <ds-pagination [page]="17" [total]="21" [siblings]="2" [showFirstLast]="true"></ds-pagination>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">Classic — sans First/Last</h4>
          <ds-pagination [page]="5" [total]="16" [siblings]="1" [showFirstLast]="false"></ds-pagination>
        </div>
      </div>
    `,
  }),
};
