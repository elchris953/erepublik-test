const {
	createTableIfNotExists,
	seedData,
	queryData
} = require('../../../services/scoreService')

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  next(null, {code: 200, msg: 'SCV good to go, sir.'});
};

/**
 * Does binary functionality
 *
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.doBinary = function(msg, session, next) {
	if(isNaN(parseInt(msg))) {
		next(null, { code: 400, msg: 'Please insert an integer!' })
		return;
	}

	const binary = parseInt(msg).toString(2);

	let currentGap = 0;
	let gaps = [0];


	for(let i = 0; i < binary.length; i++) {
		if(parseInt(binary[i]) === 0) {
			currentGap++;

			if(parseInt(binary[i + 1]) === 1) {
				gaps.push(currentGap);
				currentGap = 0;
			}
		}
	}

	next(null, {
		code: 200,
		msg: `Longest consecutive 0's in binary is: ${Math.max(...gaps)}. Binary code for number ${msg} is ${binary}`
	})
}

/**
 * Create table if not exists pre-seed with data and show last score
 *
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.getData = function (msg, session, next) {
	// First we create the table if not exists
	createTableIfNotExists((err) => {
		if(err) {
			next(null, {code: 500, msg: `Internal server error. Trace: ${err.stack}`})
		}
	})

	// Second we verify if table has data, if not we insert data into it
	seedData((err) => {
		if(err) {
			next(null, {code: 500, msg: `Internal server error. Trace: ${err.stack}`})
		}
	})

	// Third we query the data
	queryData((err, data) => {
		if(err) {
			next(null, {code: 500, msg: `Internal server error. Trace: ${err.stack}`})
		}

		next(null, {code: 200, msg: JSON.stringify(data)})
	})
}


/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
