import { SequelizeOptions } from 'sequelize-typescript';

const sequelizeConfig: SequelizeOptions = {
  // Пулково
  // dialect: 'mysql',
  // host: '172.16.127.10',
  // port:  3306,
  // username: 'olp',
  // password: '100278',
  // database: 'OLP',
  // define: {
  //   timestamps: false,
  // },
  // Шарик
  // dialect: 'mysql',
  // host: '10.248.157.162',
  // port:  3306,
  // username: 'olp',
  // password: '100278',
  // database: 'OLP',
  // define: {
  //   timestamps: false,
  // },
  // Алмаз
  // dialect: 'mysql',
  // host: '46.229.128.194',
  // port: 23306,
  // username: 'olp',
  // password: '100278',
  // database: 'OLP',
  // define: {
  //   timestamps: false,
  // },
  // Local
  dialect: 'mysql',
  host: '192.168.6.124',
  port: 3306,
  username: 'olp',
  password: '100278',
  database: 'OLP',
  define: {
    timestamps: false,
  },
  models: [__dirname + '/models'],
};

export default sequelizeConfig;