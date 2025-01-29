import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <button onClick={() => changeLanguage('en')}>
        <img src="/src/assets/flags/uk.png" alt="English" width="32" className="text-xl" />
      </button>
      <button onClick={() => changeLanguage('es')}>
        <img src="/src/assets/flags/es.png" alt="Español" width="32" className="text-xl" />
      </button>
    </div>
  );
};

export default LanguageSelector;
