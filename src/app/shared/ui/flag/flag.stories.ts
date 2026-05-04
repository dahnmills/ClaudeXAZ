import type { Meta, StoryObj } from '@storybook/angular';
import { FlagComponent } from './flag.component';

const meta: Meta<FlagComponent> = {
  title: 'Design System/Foundation/Flag',
  component: FlagComponent,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'select', options: ['fr', 'de', 'gb', 'us', 'kr'] },
  },
};

export default meta;
type Story = StoryObj<FlagComponent>;

export const France: Story = { args: { code: 'fr' } };
export const Germany: Story = { args: { code: 'de' } };
export const UK: Story = { args: { code: 'gb' } };
export const USA: Story = { args: { code: 'us' } };
export const Korea: Story = { args: { code: 'kr' } };

export const All: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;">
        <ds-flag code="fr" /><ds-flag code="de" /><ds-flag code="gb" /><ds-flag code="us" /><ds-flag code="kr" />
      </div>
    `,
  }),
};
