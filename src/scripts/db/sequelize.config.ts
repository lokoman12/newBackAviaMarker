import { SequelizeOptions } from 'sequelize-typescript';

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
};

export default sequelizeConfig;