import { SequelizeModuleOptions } from '@nestjs/sequelize';

const sequelizeConfig: SequelizeModuleOptions = {
  // Пулково
  // uri: 'mysql://olp:100278@172.16.127.10:3306/OLP',
  // Шарик
  // uri: 'mysql://olp:100278@10.248.157.162:3306/OLP',
  // NGolosin Local
  // uri: 'mysql://olp:100278@192.168.6.124:3306/OLP',
  // Алмаз
  uri: 'mysql://olp:100278@192.168.6.109:3306/OLP',
  define: {
    timestamps: false,
  },
  models: [__dirname + '/models'],
};

export default sequelizeConfig;