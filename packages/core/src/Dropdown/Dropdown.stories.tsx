import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '.';
import { ThemeProvider } from '@spark-ui/system';
import { DropdownProps } from './Dropdown.types';

const meta: Meta<typeof Dropdown> = {
  component: (props: DropdownProps) => {
    return <ThemeProvider>
      <Dropdown {...props} />
    </ThemeProvider>
  },
  title: "Spark UI/Dropdown",
};

export default meta;

type BaseStory = StoryObj<typeof Dropdown>;

export const BaseTemplate: BaseStory = {
  args: {
    options: [
      { label: 'US', value: 'US' },
      { label: 'IN', value: 'IN' },
      { label: 'CA', value: 'CA' },
      { label: 'AF', value: 'AF' },
    ],
    forTeams: true,
  }
}
