import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'ecommercedb',
    entities: [],
    synchronize: false,
    logging: false,
    migrations: [],
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;