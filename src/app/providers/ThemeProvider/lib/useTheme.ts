import { useContext } from 'react';
import { LOCAL_STORAGE_THEME_KEY, ThemeContext, Themes } from './ThemeContext';

interface UseThemeResult {
  toggleTheme: () => void;
  theme: Themes;
}

export function useTheme(): UseThemeResult {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    let newTheme: Themes;

    switch (theme) {
      case Themes.DARK:
        newTheme = Themes.LIGHT;
        break;
      case Themes.LIGHT:
        newTheme = Themes.DARK;
        break;
      default:
        newTheme = Themes.DARK;
        break;
    }

    setTheme?.(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  return { theme: theme || Themes.LIGHT, toggleTheme };
}