export default {
  routes: [
    {
      method: 'GET',
      path: '/web/top-professions',
      handler: 'web.topProfessions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
