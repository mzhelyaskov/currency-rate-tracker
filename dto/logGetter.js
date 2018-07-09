let db = require('../db');
let OperationLog = db['OperationLog'];
let dateformat = require('dateformat');

module.exports = {
	getLast: function (limit = 50, operationId) {
		return OperationLog.findAll({
			where: operationId ? {operationId: operationId} : {},
			limit: limit,
			order: [['id', 'DESC']]
		}).then(rows => {
			return rows
				.sort((a, b) => a.id - b.id)
				.map((row, index) => {
					return convertToDTO(index + 1, row);
				});
		});
	}
};

function convertToDTO(index, row) {
	return {
		rowNum: index,
		id: row.id,
		operationId: row.operationId,
		timestamp: dateformat(row.created_at, 'dd-mm HH:MM'),
		operationName: row.operationName,
		status: row.status,
		description: row.description
	}
}