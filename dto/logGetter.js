let db = require('../db');
let OperationLog = db['OperationLog'];
let dateformat = require('dateformat');
let moment = require('moment');
const Op = db.Sequelize.Op;

module.exports = {
	getLast: function (operationId) {
		return OperationLog.findAll({
			where: getWhereConditions(operationId),
			limit: 50,
			order: [['id', 'DESC']]
		}).then(rows => {
			return rows.map((row, index) => {
				return convertToDTO(index + 1, row);
			});
		});
	}
};

function getWhereConditions(operationId) {
	let where = {
		createdAt: {[Op.gte]: moment().startOf('day').valueOf()}
	};
	if (operationId) {
		where.operationId = operationId
	}
	return where;
}

function convertToDTO(index, row) {
	return {
		rowNum: index,
		id: row.id,
		operationId: row.operationId,
		timestamp: dateformat(row.created_at, 'HH:MM'),
		operationName: row.operationName,
		status: row.status,
		description: row.description
	}
}