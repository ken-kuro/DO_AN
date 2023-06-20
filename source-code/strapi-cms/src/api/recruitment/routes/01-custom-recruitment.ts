export default {
  routes: [
    {
      method: 'POST',
      path: '/recruitments/apply/:id',
      handler: 'recruitment.apply',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
