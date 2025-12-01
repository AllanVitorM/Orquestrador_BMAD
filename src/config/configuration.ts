export default () => ({
  database: {
    host: process.env.mongo_uri,
  },
  jwt: {
    secret: process.env.jwt_secret,
  },
  Agents: {
    frontend: process.env.Agent_Frontend,
    ux: process.env.Agent_Ux,
    database: process.env.Agent_Database,
    testes: process.env.Agent_Testes,
    backend: process.env.Agent_Backend,
    devops: process.env.Agent_Devops,
  },
});
