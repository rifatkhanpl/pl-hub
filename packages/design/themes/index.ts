// Theme Management for PracticeLink Design System
import { colors, spacing, typography, borderRadius, shadows } from '../tokens';

export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  mode: 'light' | 'dark';
}

// Default Light Theme
export const lightTheme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  mode: 'light',
};

// Dark Theme (future implementation)
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...colors,
    // Override colors for dark mode
    primary: {
      ...colors.primary,
      50: colors.primary[900],
      100: colors.primary[800],
      // ... invert the scale
    },
  },
  mode: 'dark',
};

// Theme Creator Function
export const createTheme = (overrides?: Partial<Theme>): Theme => ({
  ...lightTheme,
  ...overrides,
  colors: { ...lightTheme.colors, ...overrides?.colors },
  spacing: { ...lightTheme.spacing, ...overrides?.spacing },
  typography: { ...lightTheme.typography, ...overrides?.typography },
});

// CSS Variables Generator
export const generateCSSVariables = (theme: Theme): Record<string, string> => {
  const variables: Record<string, string> = {};

  // Generate color variables
  Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'object') {
      Object.entries(colorValue).forEach(([shade, value]) => {
        variables[`--color-${colorName}-${shade}`] = value;
      });
    }
  });

  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });

  return variables;
};

// Apply theme to document
export const applyTheme = (theme: Theme) => {
  const variables = generateCSSVariables(theme);
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  root.setAttribute('data-theme', theme.mode);
};

// Theme Hook for React
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(lightTheme);
  
  const switchTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('pl-theme', JSON.stringify(theme));
  };
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('pl-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
        applyTheme(theme);
      } catch (error) {
        console.warn('Failed to parse saved theme:', error);
      }
    }
  }, []);
  
  return {
    theme: currentTheme,
    switchTheme,
    isLight: currentTheme.mode === 'light',
    isDark: currentTheme.mode === 'dark',
  };
};

// Export default theme
export default lightTheme;