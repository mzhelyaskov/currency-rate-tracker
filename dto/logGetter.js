let db = require('../db');
let OperationLog = db['OperationLog'];
let moment = require('moment');
const Op = db.Sequelize.Op;

module.exports = {
	getLog: function (operationId) {
		return OperationLog.findAll({
			where: getWhereConditions(operationId),
			limit: 50,
			order: [['id', 'DESC']]
		}).then(rows => {
			let length = rows.length;
			return rows.map(row => {
				return convertToDTO(length--, row);
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

function convertToDTO(rowNum, row) {
	return {
		rowNum: rowNum,
		operationId: row.operationId,
		timestamp: moment(row.created_at).add(2, 'hour').format('HH:mm'),
		operationName: row.operationName,
		status: row.status,
		description: row.description
	}
}