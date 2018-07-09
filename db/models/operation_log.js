'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('OperationLog', {
		operationId: {
			type: DataTypes.STRING,
			field: 'operation_id'
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at'
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