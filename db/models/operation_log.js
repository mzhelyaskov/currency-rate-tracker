'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('OperationLog', {
		operationId: {
			type: DataTypes.STRING,
			field: 'operation_id'
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at',
			set(date) {
				date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
				this.setDataValue('createdAt', date);
			}
		},
		operationName: {
			type: DataTypes.STRING,
			field: 'operation_name'
		},
		status: DataTypes.STRING,
		description: DataTypes.STRING
	}, {
		tableName: 'operation_log'
	});
};