import { createContext, useContext, useState, useEffect, useMemo } from 'react';

type FontSize = 'default' | 'large' | 'xlarge';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

interface FontSizeProviderProps {
  children: React.ReactNode;
}

export function FontSizeProvider(props: Readonly<FontSizeProviderProps>) {
  const { children } = props;
  const [fontSize, setFontSize] = useState<FontSize>('default');

  useEffect(() => {
    const savedSize = localStorage.getItem('fontSize') as FontSize;
    if (savedSize) {
      setFontSize(savedSize);
    }
  }, []);

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const value = useMemo(() => ({ fontSize, setFontSize: handleSetFontSize }), [fontSize]);

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}