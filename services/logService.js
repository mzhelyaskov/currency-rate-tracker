let OperationLog = require('../db')['OperationLog'];

module.exports = {
	getLogger: function (operationsId) {
		return new Logger(operationsId);
	}
};

class Logger {

	constructor(operationId) {
		this.operationId = operationId;
	}

	success(parameters) {
		this.log({
			operationName: parameters.operationName,
			status: 'SUCCESS',
			description: parameters.description
		});
	}

	error(parameters) {
		this.log({
			operationName: parameters.operationName,
			status: 'ERROR',
			description: parameters.description
		});
	}

	info(parameters) {
		this.log({
			operationName: parameters.operationName,
			status: 'INFO',
			description: parameters.description
		});
	}

	log(parameters) {
		OperationLog.create({
			operationId: this.operationId,
			operationName: parameters.operationName,
			status: parameters.status,
			description: parameters.description
		});
	}
}