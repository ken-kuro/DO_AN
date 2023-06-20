/**
 * recruitment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::recruitment.recruitment',
  ({ strapi }) => ({
    async apply(ctx) {
      return (strapi as any).service('api::recruitment.recruitment').apply(ctx);
    },
  }),
);
