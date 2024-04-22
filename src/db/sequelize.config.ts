import { SequelizeModuleOptions } from '@nestjs/sequelize';


const getSequelizeConfig = (uri: string): SequelizeModuleOptions => {
  return {
    uri,
    define: {
      timestamps: false,
    },
    models: [__dirname + '/models'],
  }
};

export default getSequelizeConfig;