import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';

const meta: Meta<AccordionComponent> = {
  title: 'Design System/Data Display/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    title:    { control: 'text' },
    tone:     { control: 'inline-radio', options: ['default', 'alt'] },
    open:     { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Playground: Story = {
  args: { title: 'Label', tone: 'default', open: true, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-accordion [title]="title" [tone]="tone" [(open)]="open" [disabled]="disabled">
        <p>This is the body content of the accordion. It is shown when expanded.</p>
      </ds-accordion>
    `,
  }),
};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:600px;">
        <ds-accordion title="Default tone" tone="default" [open]="true">
          <p>Body content for default tone.</p>
        </ds-accordion>
        <ds-accordion title="Alt tone" tone="alt" [open]="true">
          <p>Body content for alt tone.</p>
        </ds-accordion>
      </div>
    `,
  }),
};
