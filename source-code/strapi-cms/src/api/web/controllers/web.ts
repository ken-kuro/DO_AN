export default {
  async topProfessions(ctx) {
    return (strapi as any).service('api::web.web').getTopProfessions(ctx);
  },
};
