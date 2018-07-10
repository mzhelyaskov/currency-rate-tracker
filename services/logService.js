let OperationLog = require('../db')['OperationLog'];
let shortid = require('shortid');

module.exports = {
	getDefault: function () {
		return new Logger();
	},
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
			status: 'S',
			description: parameters.description
		});
	}

	error(parameters) {
		this.log({
			operationName: parameters.operationName,
			status: 'E',
			description: parameters.description
		});
	}

	info(parameters) {
		this.log({
			operationName: parameters.operationName,
			status: 'I',
			description: parameters.description
		});
	}

	log(parameters) {
		let self = this;
		OperationLog.create({
			operationId: this.operationId || `$${shortid.generate()}`,
			operationName: parameters.operationName,
			status: parameters.status,
			description: parameters.description
		}).catch(error => {
			console.error('OperationLog.create', error.message);
			self.error({
				operationName: 'OperationLog.create',
				description: error.message
			})
		});
	}
}