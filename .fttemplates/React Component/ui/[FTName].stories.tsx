import type { Meta, StoryObj } from '@storybook/react';

import { [FTName] } from './[FTName]';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Themes } from 'app/providers/ThemeProvider';

const meta: Meta<typeof [FTName]> = {
  title: 'shared/[FTName]',
  component: [FTName],
};

export default meta;
type Story = StoryObj<typeof [FTName]>;

export const Normal: Story = {
  args: {
    
  },
  decorators: [ThemeDecorator(Themes.LIGHT)],
};
