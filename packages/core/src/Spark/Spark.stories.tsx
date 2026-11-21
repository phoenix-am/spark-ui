import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spark, SparkHandle } from '.';

/**
 * The signature Live Wire effect. Put `<Spark ref={…} />` inside any
 * `position: relative` element and call `ref.current.burst(event)` on click.
 * Renders nothing for users who prefer reduced motion.
 */
const meta: Meta<typeof Spark> = {
  title: 'Effects/Spark',
  component: Spark,
  args: { count: 10, spread: 70 },
  argTypes: {
    count: { control: { type: 'range', min: 4, max: 30 } },
    spread: { control: { type: 'range', min: 20, max: 200 } },
    duration: { control: { type: 'range', min: 200, max: 2000, step: 50 } },
  },
  render: function Render(args) {
    const ref = useRef<SparkHandle>(null);
    return (
      <button
        type="button"
        onClick={(e) => ref.current?.burst(e)}
        style={{
          position: 'relative',
          width: 320,
          height: 180,
          border: '2px dashed var(--spark-energy-off)',
          borderRadius: 8,
          background: 'var(--spark-surface-raised)',
          color: 'var(--spark-text-secondary)',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        Click anywhere in this box
        <Spark ref={ref} {...args} />
      </button>
    );
  },
};
export default meta;
type Story = StoryObj<typeof Spark>;

export const Playground: Story = {};
export const BigBurst: Story = { args: { count: 24, spread: 140 } };
export const CustomColours: Story = { args: { colors: ['#47F5A0', '#ADFFD6', '#00CC74'] } };
