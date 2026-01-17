import knex from "knex";
import { knexSnakeCaseMappers } from "objection";

const config: any = {
    client: "pg",
    connection: {
        port: Number(process.env.DB_PORT) || 5432,
        host: 'localhost',
        user: 'postgres',
        password: 'root',
        database: 'weather_analytics',
    },
    ...knexSnakeCaseMappers()
}

const knexInstance = knex(config);

knexInstance.raw("SELECT 1").then(() =>
    console.log("DB connected")
).catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});
export default knexInstance;