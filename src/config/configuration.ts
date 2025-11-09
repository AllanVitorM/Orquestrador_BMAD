export default () => ({
  database: {
    host: process.env.mongo_uri,
  },
  jwt: {
    secret: process.env.jwt_secret,
  },
});
