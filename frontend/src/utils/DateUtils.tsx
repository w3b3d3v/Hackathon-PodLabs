import { useState } from 'react';

export function useDateFormatter(language) {
  const [languageFormat, setLanguageFormat] = useState<string>(language);

  function getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (languageFormat === 'pt-BR') {
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  return { getFormattedDate, languageFormat, setLanguageFormat };
}
