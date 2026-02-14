import { Sequelize, Dialect } from "sequelize";
const DB_NAME: string = process.env.ANANTRAJ_DATABASE_NAME as string;
const DB_USER: string = process.env.ANANTRAJ_DATABASE_USERNAME as string;
const DB_PASS: string = process.env.ANANTRAJ_DATABASE_PASSWORD as string;
const DB_HOST: string = process.env.ANANTRAJ_DATABASE_HOST as string;
const DB_DIALECT: Dialect = "postgres";
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false , //console.log, 
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    
    // },
  },
  pool: {
    max: 10,
    min: 0, 
    acquire: 30000, 
    idle: 10000,
  },
  define: {
    underscored: true,
  },
});


export { sequelize };
