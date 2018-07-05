let Twilio = require('twilio');
const TWILIO_ACCOUNT_SID = 'AC1a5600b017a803398a057be602eb82de';
const TWILIO_AUTH_TOKEN = 'e8b7945703a1fe06615aa7123dc2437d';

let twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = {
	send: function (text) {
		twilioClient.messages.create({
			to: '+48575874266',
			from: '+48799449108',
			body: text
		});
	}
};