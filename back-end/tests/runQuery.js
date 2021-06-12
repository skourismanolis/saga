async function runQuery(pool, queries) {
	let conn;
	let results = [];
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		queries.forEach(async function (item) {
			let [result] = await conn.query(item);
			results.push(result);
		});

		await conn.commit();
	} catch (error) {
		if (conn != null) conn.rollback();
	} finally {
		if (conn != null) conn.release();
	}
	return results;
}

module.exports = runQuery;
