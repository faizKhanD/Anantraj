require("dotenv").config();

module.exports = {
  development: {
    username: process.env.ANANTRAJ_DATABASE_USERNAME,
    password: process.env.ANANTRAJ_DATABASE_PASSWORD,
    database: process.env.ANANTRAJ_DATABASE_NAME,
    host: process.env.ANANTRAJ_DATABASE_HOST,
    dialect: "postgres",
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
    },
  },
  test: {
    username: process.env.ANANTRAJ_DATABASE_USERNAME,
    password: process.env.ANANTRAJ_DATABASE_PASSWORD,
    database: process.env.ANANTRAJ_DATABASE_NAME,
    host: process.env.ANANTRAJ_DATABASE_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.ANANTRAJ_DATABASE_USERNAME,
    password: process.env.ANANTRAJ_DATABASE_PASSWORD,
    database: process.env.ANANTRAJ_DATABASE_NAME,
    host: process.env.ANANTRAJ_DATABASE_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
