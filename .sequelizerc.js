import { resolve } from "path";

export default {
  "config": resolve(process.cwd(), "src/config/config"),
  "models-path": resolve(process.cwd(), "src/models"),
  "seeders-path": resolve(process.cwd(), "src/seeders"),
  "migrations-path": resolve(process.cwd(), "src/migrations")
};
