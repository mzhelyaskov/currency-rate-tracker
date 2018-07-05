let sqlite3 = require('sqlite3').verbose();
let fs = require('fs');
let db = new sqlite3.Database('./db/currency-rates.db', function(err) {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the currency-rates database.');
});

module.exports = {
	db: db,
	run: function (scriptName, params, callback) {
		readScript(scriptName, function (err, sql) {
			if (err) {
				callback(err);
				return;
			}
			db.run(sql, params, callback);
		});
	},
	getAll: function (scriptName, params, callback) {
		readScript(scriptName, function (err, sql) {
			if (err) {
				callback(err);
				return;
			}
			db.all(sql, params, callback);
		});
	},
	init: function (callback) {
		db.serialize(() => {
			this.run('currencyRatesInit', [], callback);
		});
	}
};

function readScript(scriptName, callback) {
	fs.readFile(getPath(scriptName), (err, sql) => {
		if (err) {
			callback(err);
			return;
		}
		callback(null, sql.toString());
	});
}

function getPath(scriptName) {
	return './db/scripts/' + scriptName + '.sql';
}
