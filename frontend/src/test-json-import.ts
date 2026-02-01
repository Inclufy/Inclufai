import en from './i18n/en.json';
import nl from './i18n/nl.json';

console.log('EN nav:', en.nav);
console.log('NL nav:', nl.nav);

export const testImports = () => {
  return { en, nl };
};
