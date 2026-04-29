import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonItemComponent } from './skeleton-item.component';

const meta: Meta<SkeletonItemComponent> = {
  title: 'Design System/SkeletonItem',
  component: SkeletonItemComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SkeletonItemComponent>;

export const TextLines: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;max-width:400px;">
        <ds-skeleton-item style="width:100%;height:12px;border-radius:4px;" />
        <ds-skeleton-item style="width:75%;height:12px;border-radius:4px;" />
        <ds-skeleton-item style="width:85%;height:12px;border-radius:4px;" />
      </div>
    `,
  }),
};

export const CardPlaceholder: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:12px;max-width:400px;">
        <ds-skeleton-item style="width:40px;height:40px;border-radius:50%;flex-shrink:0;" />
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <ds-skeleton-item style="width:60%;height:12px;border-radius:4px;" />
          <ds-skeleton-item style="width:40%;height:12px;border-radius:4px;" />
        </div>
      </div>
    `,
  }),
};
