async function runQuery(pool, queries) {
	let conn;
	let results = [];
	let flag = false;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		queries.forEach(async function (item) {
			try {
				let [result] = await conn.query(item);
				results.push(result);
			} catch (e) {
				flag = true;
			}
		});
		if (flag) {
			throw 'error';
		}
		await conn.commit();
	} catch (error) {
		if (conn != null) conn.rollback();
	} finally {
		if (conn != null) conn.release();
	}
	return results;
}

module.exports = runQuery;
