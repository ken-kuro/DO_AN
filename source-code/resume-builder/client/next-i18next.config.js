const path = require('path');

const i18nConfig = {
  i18n: {
    locales: ['vi'],
    defaultLocale: 'vi',
  },
  nsSeparator: '.',
  returnNull: false,
  localePath: path.resolve('./public/locales'),
  ns: ['common', 'modals', 'landing', 'dashboard', 'builder'],
};

module.exports = i18nConfig;
