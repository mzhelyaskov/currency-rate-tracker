'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('currency_rate', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			currency: {
				allowNull: false,
				type: Sequelize.STRING
			},
			buy_rate: {
				allowNull: false,
				type: Sequelize.DOUBLE
			},
			sale_rate: {
				allowNull: false,
				type: Sequelize.DOUBLE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('currency_rate');
	}
};