import { SequelizeOptions } from 'sequelize-typescript';
import { Toi } from './models/toi.model';
import { AlaramAM } from './models/alarm.model';
import { PositionAM } from './models/position.model';
import { ZoneAM } from './models/zone.model';
import { Meteo } from './models/meteo.model';
import { FlightPlan } from './models/fpln.model';
import { Formular } from './models/Formular.model';
import { Strips } from './models/strips.model';
import { Reta } from './models/reta.model';
import { Retd } from './models/retd.model';
import { VppStatus } from './models/vppStatus.model';


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
  dialect: 'mysql',
  host: '46.229.128.194',
  port:  23306,
  username: 'olp',
  password: '100278',
  database: 'OLP',
  define: {
    timestamps: false,
  },
  models: [Toi, AlaramAM, PositionAM, ZoneAM, Meteo, FlightPlan, Formular, Strips, Reta, Retd, VppStatus],
};

export default sequelizeConfig;