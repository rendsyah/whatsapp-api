// Import Modules
import { DataSource } from 'typeorm';
import * as appRoot from 'app-root-path';

// Define DataSource Migration
export default new DataSource(require(`${appRoot}/datasource.config.json`));
