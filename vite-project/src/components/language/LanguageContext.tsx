import React, { createContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt' | 'es'; // Adicione mais idiomas conforme necessário

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
}

const initialState: LanguageProviderState = {
  language: 'pt',
  setLanguage: () => null,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export default function LanguageProvider({
  children,
  defaultLanguage = 'pt',
  storageKey = 'app-language',
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    localStorage.setItem(storageKey, language);
  }, [language, storageKey]);

  const value = {
    language,
    setLanguage,
  };

  return (
    <LanguageProviderContext.Provider value={value} {...props}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = React.useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};