import { SequelizeOptions } from 'sequelize-typescript';
import { Line } from './models/line.model';

const sequelizeConfig: SequelizeOptions = {
  dialect: 'mysql',
  host: '46.229.128.194',
  port:  23306,
  username: 'olp',
  password: '100278',
  database: 'OLP',
  define: {
    timestamps: false,
  },
  models: [Line],
};

export default sequelizeConfig;