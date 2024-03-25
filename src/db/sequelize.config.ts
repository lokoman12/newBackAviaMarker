import { SequelizeOptions } from 'sequelize-typescript';

const sequelizeConfig: SequelizeOptions = {
  // dialect: 'mysql',
  // host: '172.',
  // port:  3306,
  // username: 'olp',
  // password: '100278',
  // database: 'OLP',
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
  models: [__dirname + '/models'],
  // models: [Line, Point, Toi, AlaramAM, PositionAM, ZoneAM, Meteo, FlightPlan, Formular],
};

export default sequelizeConfig;