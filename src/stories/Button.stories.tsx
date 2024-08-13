import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../components';

const meta: Meta<typeof Button> = {
  component: Button,
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
    size: 'medium',
  }
}

const TextTemplate: TextStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'text',
  }
}

const ContainedTemplate: TextStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'contained',
  }
}

const OutlinedTemplate: TextStory = {
  args: {
    ...BaseTemplate.args,
    variant: 'outlined',
  }
}

//#region Colors with variant `text`
export const TextDefault: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'default',
  }
}

export const TextPrimary: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'primary',
  }
}

export const TextSecondary: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'secondary',
  }
}

export const TextError: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'error',
  }
}

export const TextInfo: TextStory = {
  args: {
    ...TextTemplate.args,
    color: 'info',
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
export const ContainedDefault: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'default',
  }
}

export const ContainedPrimary: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'primary',
  }
}

export const ContainedSecondary: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'secondary',
  }
}

export const ContainedError: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'error',
  }
}

export const ContainedInfo: ContainedStory = {
  args: {
    ...ContainedTemplate.args,
    color: 'info',
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
export const OutlinedDefault: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'default',
  }
}

export const OutlinedPrimary: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'primary',
  }
}

export const OutlinedSecondary: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'secondary',
  }
}

export const OutlinedError: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'error',
  }
}

export const OutlinedInfo: OutlinedStory = {
  args: {
    ...OutlinedTemplate.args,
    color: 'info',
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