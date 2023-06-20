export default [
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:3000',
        'https://strapi.hieuhm.com',
        'https://resume-builder.hieuhm.com',
        'https://cms.cuongts.com',
        'https://web.cuongts.com',
      ],
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'minio.hieuhm.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'minio.hieuhm.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
