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
			field: 'created_at',
			set(date) {
				date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
				this.setDataValue('createdAt', date);
			}
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