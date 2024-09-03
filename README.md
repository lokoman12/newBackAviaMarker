<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">newBackAviaMarker</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/lokoman12/newBackAviaMarker/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/lokoman12/newBackAviaMarker/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [О проекте](#about)
- [Начало работы](#getting_started)
- [Развёртывание](#deployment)
- [Используемые технологии](#built_using)
- [Команда проекта](#authors)

## 🧐 О проекте <a name = "about"></a>

Серверная часть для авиапортала шарика.

## 🏁 Начало работы <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

## 🚀 Развёртывание <a name = "deployment"></a>

Клонировать репозитарий 

```
git clone git@github.com:lokoman12/newBackAviaMarker.git
```

Установить зависимости

```
npm i
```

Настроить окружение, задав в переменных:
- Путь до базы
- Координаты Пулково и Шереметьево
- Аэропорт по умолчанию
- Сеттинги кафки
- Срок протухания ключей (как долго будет актуален пароль)
- Сеттинги для копирования истории в соответствующие таблицы
- Глубину хранения истории в днях

Инициализировать таблицы

```
npm run build
npm run db:create-history-tables
```

Запустите бэкэнд командой

```
npm run start
```

## ⛏️ Испрользуемые технологии <a name = "built_using"></a>

- [Mysql](https://www.mysql.com/) - Database
- [NestJS](https://nestjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Sequelize TypeScript](https://sequelize.org/docs/v6/other-topics/typescript/) - Orm
- [Typescript](https://sequelize.org/docs/v6/other-topics/typescript/) - Language
- [Day.JS](https://www.npmjs.com/package/dayjs) - Datetime util
- [Axios](https://www.npmjs.com/package/axios) - Http client
- [Winston](https://www.npmjs.com/package/winston) - Logging
- [Toad-scheduler](https://www.npmjs.com/package/toad-scheduler) - Scheduling
- [Dotenv](https://www.npmjs.com/package/dotenv) - Work with environment


## ✍️ Команда проекта <a name = "authors"></a>

- [@ngolosin](https://github.com/tperepelkin) - Idea & Initial work
- [@erazgulayev](https://github.com/lokoman12) - Idea & Initial work
