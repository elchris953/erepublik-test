const db = require('./db')

const createTableIfNotExists = (callback) => {
  db.query(`
		CREATE TABLE IF NOT EXISTS \`score\` (
			\`user_id\` int(10) unsigned NOT NULL,
			\`score\` int(10) unsigned NOT NULL,
			\`timestamp\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			KEY \`user_id_idx\` (\`user_id\`),
			KEY \`score_idx\` (\`score\`),
			KEY \`timestamp_idx\` (\`timestamp\`)
		);
	`, function (error, results, fields) {
    if (error) {
      callback(error, null)
      return;
    }

    callback(null, results)
  })
}

const seedData = (callback) => {
  db.query(`
		SELECT (user_id) FROM score;
	`, function (error, results, fields) {
    if (error) {
      callback(error, null);
      return;
    }

    if(results.length === 0) {
      db.query(`
			INSERT INTO score (user_id, score, timestamp)
			VALUES
			(25, 150, 20190601151343),
			(25, 2531, 20190601151343),
			(25, 14, 20190601151343),
			(1, 15, 20110601151343),
			(1, 150, 20110601151343),
			(1, 12, 20110601151343),
			(5, 320, 20130601151343),
			(5, 23, 20130601151343),
			(5, 3123, 20130601151343),
			(98, 5032, 20120601151343),
			(98, 50, 20120601151343),
			(98, 123, 20120601151343),
			(98, 405, 20120601151343),
			(98, 12, 20120601151343),
			(2, 11, 20100601151343),
			(2, 123, 20100601151343),
			(2, 54, 20100601151343),
			(2, 1, 20100601151343);
		`, function (error, result, fields) {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, true)
      })
    } else {
      callback(null, true)
    }
  })
}

const queryData = (callback) => {
  db.query(`
    SELECT user_id, MAX(score)
    FROM score
    GROUP BY user_id
  `, function (error, result, fields){
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, result)
  })
}

module.exports = {
  createTableIfNotExists,
  seedData,
  queryData
}