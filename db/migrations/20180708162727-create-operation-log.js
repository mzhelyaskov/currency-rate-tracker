'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('operation_log', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			operation_id: {
				type: Sequelize.STRING
			},
			operation_name: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('operation_log');
	}
};