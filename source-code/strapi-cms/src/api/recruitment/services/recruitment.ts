/**
 * recruitment service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::recruitment.recruitment',
  ({ strapi }) => ({
    async search({ fields, filters, sort, populate }) {
      return strapi.entityService.findMany('api::recruitment.recruitment', {
        fields,
        filters,
        sort,
        populate,
        publicationState: 'live',
      });
    },

    async apply(ctx) {
      const recruitmentId = ctx.params.id;
      const userId = ctx.state.user.id;
      const { resume } = ctx.request.body;

      const data = await strapi.entityService.findOne(
        'api::recruitment.recruitment',
        recruitmentId,
        {
          populate: {
            candidates: {
              populate: {
                user: {
                  fields: ['id'],
                },
              },
            },
          },
        },
      );

      const candidatesMap: Map<number, { id?: string; resume: number }> =
        new Map(
          data.candidates.map((obj) => [
            obj.user.id,
            {
              id: obj.id,
              resume: obj.resume,
            },
          ]),
        );

      const candidateComponent = candidatesMap.get(userId);

      const componentData = candidateComponent
        ? { id: candidateComponent.id, resume: resume, user: userId }
        : { resume: resume, user: userId };

      candidatesMap.set(userId, componentData);

      const candidates = Array.from(candidatesMap, ([key, value]) => {
        const result: { id?: string; user: number; resume: number } = {
          user: key,
          resume: value.resume,
        };

        if (value.id) {
          result.id = value.id;
        }

        return result;
      });

      await strapi.entityService.update(
        'api::recruitment.recruitment',
        recruitmentId,
        {
          data: {
            candidates,
          },
        },
      );

      return {
        ok: true,
      };
    },
  }),
);
