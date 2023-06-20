export default (plugin) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return ctx.unauthorized('Unauthorized', {});
    }

    const response = await strapi.entityService.update(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      { data: ctx.request.body },
    );

    delete response.password;
    delete response.resetPasswordToken;
    delete response.confirmationToken;

    ctx.response.status = 200;
    ctx.response.body = response;
  };

  plugin.controllers.user.interested = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return ctx.unauthorized('Unauthorized', {});
    }

    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      {
        populate: '*',
      },
    );

    const userInterested = user.interested;

    const isInterested = userInterested
      .map((interested) => interested.id)
      .includes(ctx.request.body.recruitmentId);

    if (isInterested) {
      const index = userInterested
        .map((interested) => interested.id)
        .indexOf(ctx.request.body.recruitmentId);

      if (index > -1) {
        userInterested.splice(index, 1);
      }
    } else {
      userInterested.push({
        id: ctx.request.body.recruitmentId,
      });
    }

    await strapi.entityService.update(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      {
        data: {
          interested: userInterested,
        },
      },
    );

    ctx.response.status = 200;
    ctx.response.body = 'OK';
  };

  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/user/me',
    handler: 'user.updateMe',
    config: {
      prefix: '',
    },
  });

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/user/interested',
    handler: 'user.interested',
    config: {
      prefix: '',
    },
  });

  return plugin;
};
