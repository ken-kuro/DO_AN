export default ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-minio-ce',
      providerOptions: {
        accessKey: env('MINIO_ACCESS_KEY'),
        secretKey: env('MINIO_SECRET_KEY'),
        bucket: env('MINIO_BUCKET'),
        endPoint: env('MINIO_ENDPOINT'),
        port: env('MINIO_PORT'),
        useSSL: env('MINIO_USE_SSL'),
        host: env('MINIO_HOST'),
        folder: env('MINIO_FOLDER'),
      },
    },
  },
});
