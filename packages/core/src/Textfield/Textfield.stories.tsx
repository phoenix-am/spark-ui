import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textfield } from '.';
import { ThemeProvider } from '@spark-ui/system';
import { TextfieldPropsBase } from './Textfield.types';
import { DollarSign, Info, Mail } from '@spark-ui/icons';
import { Dropdown } from '../Dropdown';

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

export const Base: BaseStory = {
  args: {
    placeholder: 'Email',
    inputSize: 'medium',
  }
}

export const WithIcon: BaseStory = {
  args: {
    ...Base.args,
    prepend: <Mail />,
    append: <Info />,
  }
}

export const WithErrorIcon: BaseStory = {
  args: {
    ...Base.args,
    error: true,
    prepend: <Mail />,
    append: <Info />,
  }
}

export const WithHelperText: BaseStory = {
  args: {
    ...Base.args,
    helperText: 'This is error text!!'
  }
}

export const WithList: BaseStory = {
  args: {
    placeholder: 'Select',
    prepend: <Dropdown
    options={[
      { label: 'US', value: 'USA' },
      { label: 'CA', value: 'Canada' },
      { label: 'IN', value: 'India' },
      { label: 'AF', value: 'Afghanistan' },
    ]}
    showBorder={false}
    placeholder='Select'
    containerStyle={{
      width: '60px'
    }}
  />,
    containerStyle: {
      padding: '10px'
    }
  }
}

export const WithCurrency: BaseStory = {
  args: {
    placeholder: 'Select',
    prepend: <DollarSign />,
    containerStyle: {
      padding: '10px'
    },
    onChange: (e) => console.log(e),
    type: "currency"
  }
}

export const ChargingPassword: BaseStory = {
  args: {
    label: 'New password',
    type: 'password',
    placeholder: 'Type 8+ characters',
    charge: (value: string) => value.length / 8,
    chargeLabel: (percent: number) =>
      percent >= 100 ? 'Fully charged. Strong password.' : `${percent}% charged`,
  }
}

export const Charged: BaseStory = {
  args: {
    label: 'Profile completeness',
    value: 'Asha Patel',
    charge: 1,
  }
}
