import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textfield } from '.';
import { ThemeProvider } from '@spark-ui/system';
import { TextfieldPropsBase } from './Textfield.types';

const meta: Meta<typeof Textfield> = {
  component: (props: TextfieldPropsBase) => {
    return <ThemeProvider>
      <Textfield {...props} />
    </ThemeProvider>
  },
  title: "Spark UI/Textfield",
};

export default meta;

type BaseStory = StoryObj<typeof Textfield>;

export const BaseTemplate: BaseStory = {
  args: {
    placeholder: 'Email',
    inputSize: 'medium',
  }
}
