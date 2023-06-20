export default ({ strapi }) => ({
  async getTopProfessions() {
    const professions = await strapi.entityService.findMany(
      'api::profession.profession',
    );

    const data = await Promise.all(
      professions.map(async (profession) => {
        const recruitment = await strapi.entityService.findMany(
          'api::recruitment.recruitment',
          {
            filters: {
              profession: profession.id,
            },
          },
        );

        return {
          name: profession.name,
          count: recruitment.length,
        };
      }),
    );

    return data.filter((v) => v.count > 0).sort((a, b) => b.count - a.count);
  },
});
