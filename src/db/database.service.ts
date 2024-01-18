import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from './sequelize.config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(sequelizeConfig);

      try {
        await sequelize.authenticate();
        console.log(sequelize._model);
        console.log('Connection to the database has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
      }

      await sequelize.sync(); // Опционально: автоматически создает таблицы, если их нет
      return sequelize;
    },
  },
];