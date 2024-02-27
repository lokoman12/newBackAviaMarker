import { SequelizeOptions } from 'sequelize-typescript';
import { Line } from './models/line.model';
import { Point } from './models/point.model';
import { Toi } from './models/toi.model';
import { AlaramAM } from './models/alarm.model';

const sequelizeConfig: SequelizeOptions = {
  // dialect: 'mysql',
  // host: '192.168.6.95',
  // port:  3306,
  // username: 'bvs',
  // password: 'bvsbvsbvs',
  // database: 'BVS',
  // define: {
  //   timestamps: false,
  // },
  dialect: 'mysql',
  host: '46.229.128.194',
  port:  23306,
  username: 'olp',
  password: '100278',
  database: 'OLP',
  define: {
    timestamps: false,
  },
  models: [Line, Point, Toi, AlaramAM],
};

export default sequelizeConfig;