import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { FiltersTestPageComponent } from './filters-test-page.component';

const meta: Meta<FiltersTestPageComponent> = {
  title: 'User Testing/Filters Page',
  component: FiltersTestPageComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [FiltersTestPageComponent] }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full filters scenario page.

Slide-in drawer (no overlay) launched from a single Filters button above the table.
Filter values are the source of truth — the table dataset is filtered live from \`currentFilters\`.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FiltersTestPageComponent>;

export const Default: Story = {};
