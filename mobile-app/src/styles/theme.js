export const theme = {
  colors: {
    primary: '#0f8066',
    secondary: '#FFE44E',
    background: '#FFFFFF',
    text: {
      primary: '#1F2226',
      secondary: '#585F66',
      light: '#FFFFFF',
      placeholder: '#8E8E93',
    },
    border: '#E5E5E5',
    error: '#FF3B30',
    success: '#34C759',
    gradient: {
      start: '#0f8066',
      end: '#1A9B7D',
    }
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}; 