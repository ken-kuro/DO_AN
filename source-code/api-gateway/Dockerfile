FROM kong:alpine
USER root

ENV KONG_PLUGINS='bundled, external-auth'

COPY ./external-auth /usr/local/share/lua/5.1/kong/plugins/external-auth

USER kong
