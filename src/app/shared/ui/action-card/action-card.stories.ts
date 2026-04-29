import type { Meta, StoryObj } from '@storybook/angular';
import { ActionCardComponent } from './action-card.component';

const ICON_BUYER = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const ICON_POLICY = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const meta: Meta<ActionCardComponent> = {
  title: 'Design System/ActionCard',
  component: ActionCardComponent,
  tags: ['autodocs'],
  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
    linkLabel:   { control: 'text' },
    linkHref:    { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ActionCardComponent>;

export const Default: Story = {
  args: {
    title: 'Find a buyer',
    description: 'Search and identify a buyer from your porfolio or a new one',
    linkLabel: 'Get started',
    linkHref: '#',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-action-card [title]="title" [description]="description" [linkLabel]="linkLabel" [linkHref]="linkHref">
          <span slot="icon">${ICON_BUYER}</span>
        </ds-action-card>
      </div>
    `,
  }),
};

export const AllCards: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:960px;">
        <ds-action-card title="Find a buyer" description="Search and identify a buyer from your porfolio or a new one" linkLabel="Get started">
          <span slot="icon">${ICON_BUYER}</span>
        </ds-action-card>
        <ds-action-card title="Manage policies" description="Search and identify a buyer from your porfolio or a new one" linkLabel="Get started">
          <span slot="icon">${ICON_POLICY}</span>
        </ds-action-card>
        <ds-action-card title="Draft a contract" description="Search and identify a buyer from your porfolio or a new one" linkLabel="Get started">
          <span slot="icon">${ICON_BUYER}</span>
        </ds-action-card>
        <ds-action-card title="Job to do" description="Go to you Job To Do list, and start doing what you want." linkLabel="Get started">
          <span slot="icon">${ICON_POLICY}</span>
        </ds-action-card>
      </div>
    `,
  }),
};
