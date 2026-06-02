import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { WidgetCardComponent } from './widget-card.component';
import { PropertiesPanelComponent } from '../properties-panel/properties-panel.component';
import { ChartComponent } from '../chart/chart.component';

const meta: Meta<WidgetCardComponent> = {
  title: 'Design System/Data Display/Widget Card',
  component: WidgetCardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [PropertiesPanelComponent, ChartComponent] })],
};
export default meta;
type Story = StoryObj<WidgetCardComponent>;

/** Widget chiffré (figures-only) — contenu = properties-panel stacked/flat. */
export const Figures: Story = {
  render: () => ({
    props: {
      sections: [
        {
          rows: [
            { label: 'Exposure', value: '1 548 000' },
            { label: 'Highest limit', value: '10 000 246 000' },
            { label: 'Number of limits', value: '72' },
          ],
        },
      ],
    },
    template: `<div style="width:300px;height:258px;">
      <ds-widget-card title="Risk figures (USD)">
        <ds-properties-panel [sections]="sections" [columns]="1" variant="flat" layout="stacked" />
      </ds-widget-card>
    </div>`,
  }),
};

/** Widget graphique — lien "see figures" + ds-chart projeté. */
export const Graph: Story = {
  render: () => ({
    props: {
      data: [6, 6, 6, 7, 6, 5, 5, 6],
      xLabels: ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'],
      yLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'N/A'],
    },
    template: `<div style="width:520px;height:258px;">
      <ds-widget-card title="Grade" [seeFigures]="true">
        <ds-chart [data]="data" [xLabels]="xLabels" [yLabels]="yLabels" [min]="1" [max]="11" [invertY]="true" [height]="150" />
      </ds-widget-card>
    </div>`,
  }),
};
