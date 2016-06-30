module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'todo'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'todo'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: process.env.DATABASE_URL
}
