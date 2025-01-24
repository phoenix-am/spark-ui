import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {Button} from '.';
import { ThemeProvider } from '@spark-ui/system';
import { ButtonPropsBase } from './Button.types';
import { Mail } from '@spark-ui/icons';

const meta: Meta<typeof Button> = {
  component: (props: ButtonPropsBase) => {
    return <ThemeProvider>
      <Button {...props} />
    </ThemeProvider>
  },
  title: "Spark UI/Button",
};

export default meta;
type BaseStory = StoryObj<typeof Button>;
type TextStory = StoryObj<typeof Button>;
type ContainedStory = StoryObj<typeof Button>;
type OutlinedStory = StoryObj<typeof Button>;

const BaseTemplate: BaseStory = {
  args: {
    children: 'Click here',
  }
}

const TextTemplate: TextStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'text',
  }
}

const ContainedTemplate: ContainedStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'contained',
  }
}

const OutlinedTemplate: OutlinedStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'outlined',
  }
}

//#region Colors with variant `text`
export const TextBrand: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'brand',
  }
}

export const TextError: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'error',
  }
}

export const TextSuccess: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'success',
  }
}

export const TextWarning: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'warning',
  }
}
//#endregion

//#region Colors with variant `contained`

export const ContainedBrand: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'brand',
  }
}

export const ContainedError: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'error',
  }
}

export const ContainedSuccess: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'success',
  }
}

export const ContainedWarning: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'warning',
  }
}
//#endregion

//#region Colors with variant `outlined`

export const OutlinedBrand: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'brand',
  }
}

export const OutlinedError: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'error',
  }
}

export const OutlinedSuccess: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'success',
  }
}

export const OutlinedWarning: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'warning',
  }
}
//#endregion

//#region Colors with variant `text` and disabled
export const TextDisabledPrimary: TextStory = {
  args: {
    ...TextTemplate.args,
    disabled: true,
    color: 'brand'
  }
}
//#endregion

//#region Colors with variant `contained` and disabled
export const ContainedDisabledPrimary: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    disabled: true,
  }
}
//#endregion

//#region Colors with variant `outlined` and disabled
export const OutlinedDisabledPrimary: ContainedStory = {
  args: {
    ...OutlinedTemplate.args,
    disabled: true,
  }
}
//#endregion

//#region Colors with variant `outlined` and disabled
export const ContainedIconPrimary: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    startIcon: <Mail />
  }
}
//#endregion

//#region Without ripple
export const Contained: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    ripple: false
  }
}
//#endregion
