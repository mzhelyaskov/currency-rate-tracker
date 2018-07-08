'use strict';

let fs = require('fs');
let path = require('path');
let Sequelize = require('sequelize');
let basename = path.basename(__filename);
let env = process.env.NODE_ENV || 'development';
let config = require(__dirname + '/db-config.json')[env];
let db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, {
	dialect: "sqlite",
	storage: path.join(__dirname, 'currency-rates.db'),
	define: {
		underscored: true,
		freezeTableName: true
	}
});

const modelsPath = path.join(__dirname, 'models');
fs
	.readdirSync(modelsPath)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		let model = sequelize['import'](path.join(modelsPath, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
