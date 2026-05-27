import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { InlineEditComponent } from './inline-edit.component';

const meta: Meta<InlineEditComponent> = {
  title: 'UI/InlineEdit',
  component: InlineEditComponent,
  decorators: [
    moduleMetadata({
      imports: [InlineEditComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<InlineEditComponent>;

export const Default: Story = {
  args: {
    value: 'My Filters #1',
    placeholder: 'Filter name',
  },
};

export const Editing: Story = {
  args: {
    value: 'TEst edit',
    placeholder: 'Filter name',
  },
  play: async ({ canvasElement }) => {
    const editButton = canvasElement.querySelector('[aria-label="Edit value"]') as HTMLElement | null;
    editButton?.click();
  },
};

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'Filter name',
    emptyLabel: 'Untitled filter',
  },
};
