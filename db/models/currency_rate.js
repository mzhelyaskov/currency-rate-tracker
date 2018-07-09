'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("CurrencyRate", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		created_at: {
			type: DataTypes.DATE,
			get() {
				const createdAt = this.getDataValue('created_at');
				createdAt.setTime(createdAt.getTime() + (2 * 60 * 60 * 1000));
				return createdAt;
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