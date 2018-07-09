'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("CurrencyRate", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at'
		},
		currency: {
			allowNull: false,
			type: DataTypes.STRING
		},
		buyRate: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			field: 'buy_rate'
		},
		saleRate: {
			allowNull: false,
			type: DataTypes.DOUBLE,
			field: 'sale_rate'
		}
	}, {tableName: 'currency_rate'})
};