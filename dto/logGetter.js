let db = require('../db');
let OperationLog = db['OperationLog'];
let dateformat = require('dateformat');

module.exports = {
	getAll: function (limit) {
		return OperationLog.findAll({limit: limit}).then(logs => {
			return logs.map((log, index) => {
				return convertToDTO(index + 1, log);
			});
		});
	}
};

function convertToDTO(row, log) {
	return {
		row: row,
		operationId: log.operationId,
		timestamp: dateformat(log.created_at, 'yyyy-mm-dd HH:MM'),
		operationName: log.operationName,
		status: log.status,
		description: log.description
	}
}