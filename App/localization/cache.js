import {NativeModules} from 'react-native';

const defaultSysLanguageKey = 'languageSet';

const cache = {};

const getObject = (key, defval = null) => {
  let v = cache[key];
  if (v === undefined) v = defval;
  return v;
};

const setObject = (key, value) => {
  cache[key] = value;
};

const removeObject = key => {
  if (Object.keys(cache).indexOf(key) > -1) {
    delete cache[key];
  }
};

const getLanguage = () => {
  return getObject(defaultSysLanguageKey);
};

const setLanguage = language => {
  removeObject(defaultSysLanguageKey);
  setObject(defaultSysLanguageKey, language);
  // if (language.length > 0) {
    // NativeModules.LanguagesManager.setLanuage(language);
  // }
};

export default {
  getObject,
  setObject,
  removeObject,
  defaultSysLanguageKey,
  getLanguage,
  setLanguage,
};
