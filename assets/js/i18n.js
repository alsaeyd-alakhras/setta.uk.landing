/*
 * Language switching (English is the source text in index.html).
 * Every translatable node carries data-i18n="key" (text) or
 * data-i18n-attr="attr:key;attr:key" (attributes). Other languages live in
 * assets/lang/<code>.json and are loaded on demand.
 * To add a language: add an entry to LANGS and a matching JSON file.
 */
(() => {
  const LANGS = [
    { code: 'en', short: 'EN', label: 'English', dir: 'ltr' },
    { code: 'ar', short: 'AR', label: 'العربية', dir: 'rtl' },
  ];
  const DEFAULT = LANGS[0];
  const STORAGE_KEY = 'setta-lang';

  const root = document.documentElement;
  const find = (code) => LANGS.find((l) => l.code === code);
  const originals = new Map();
  const cache = {};

  const stored = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  };
  const remember = (code) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
  };

  const setRoot = (lang) => {
    root.lang = lang.code;
    root.dir = lang.dir;
  };

  const load = (code) => {
    if (!cache[code]) {
      cache[code] = fetch('assets/lang/' + code + '.json').then((res) => {
        if (!res.ok) throw new Error('Missing language file: ' + code);
        return res.json();
      });
    }
    return cache[code];
  };

  const collect = () => {
    if (originals.size) return;
    document.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach((el) => {
      const attrs = {};
      (el.dataset.i18nAttr || '').split(';').forEach((pair) => {
        const name = pair.split(':')[0].trim();
        if (name) attrs[name] = el.getAttribute(name);
      });
      originals.set(el, { html: el.innerHTML, attrs });
    });
  };

  const apply = (dict) => {
    collect();
    originals.forEach((orig, el) => {
      if (el.dataset.i18n) {
        const text = dict && dict[el.dataset.i18n];
        if (text != null) el.textContent = text;
        else el.innerHTML = orig.html;
      }
      (el.dataset.i18nAttr || '').split(';').forEach((pair) => {
        const [name, key] = pair.split(':').map((p) => p.trim());
        if (!name || !key) return;
        const text = dict && dict[key];
        el.setAttribute(name, text != null ? text : orig.attrs[name]);
      });
    });
  };

  const current = () => find(root.lang) || DEFAULT;

  const set = async (code) => {
    const lang = find(code) || DEFAULT;
    try {
      apply(lang === DEFAULT ? null : await load(lang.code));
    } catch (e) {
      console.warn(e);
      setRoot(DEFAULT);
      apply(null);
      root.removeAttribute('data-i18n-pending');
      return DEFAULT;
    }
    setRoot(lang);
    remember(lang.code);
    root.removeAttribute('data-i18n-pending');
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    return lang;
  };

  const initial = find(new URLSearchParams(location.search).get('lang')) || find(stored()) || DEFAULT;
  setRoot(initial);
  if (initial !== DEFAULT) root.setAttribute('data-i18n-pending', '');

  document.addEventListener('DOMContentLoaded', () => {
    if (initial !== DEFAULT) set(initial.code);
  });
  // never leave the page hidden if the dictionary is slow or missing
  setTimeout(() => root.removeAttribute('data-i18n-pending'), 2500);

  window.SettaI18n = { langs: LANGS, current, set };
})();
