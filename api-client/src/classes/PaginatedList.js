const Base = require('./Base');

module.exports = class PaginatedList extends Base {
	/**
	 * @param {Object} client a SagaClient object
	 * @param {String} options.url url used to fetch the connected resource
	 */
	constructor(client, { url }) {
		super(client);
		this._url = url;
		this._offset = 0; //pagination offset
		this._total = 0; //how many of the resource exist currently
		this._content = []; //the actual resources
		this._perPage = this.client._perPage; //how many of the connected resource to get per page
	}

	async refresh() {
		let { data, headers } = this.axios({
			method: 'GET',
			url: this._url,
			headers: {
				'X-Pagination-Limit': this._perPage,
				'X-Pagination-Offset': this._offset,
			},
		});

		this._total = Number(headers['X-Pagination-Total']);

		this._content = data;
	}

	/**
	 * Change the current "page size". Resets to the first page and refreshes.
	 * @param {Number} perPage
	 */
	async setPerPage(perPage) {
		if (perPage <= 0) throw 'Invalid page size. Must be greater than 0.';
		this._perPage = perPage;
		this._offset = 0;
		await this.refresh();
	}

	/**
	 * Jumps to specific page and refreshes
	 * @param {Number} index page index, must be greater than 0 obv
	 */
	async setPage(index) {
		if (index <= 0) throw 'Invalid index. Must be greater than 0.';
		this._offset = this._total - this._perPage;
		if (this._offset < 0) this._offset = 0;
		await this.refresh();
	}

	/**
	 * Manually set offset and refersh
	 * @param {Number} offset
	 */
	async setOffset(offset) {
		if (offset < 0) throw 'Invalid offset. Must not be negative';
		this._offset = offset;
		await this.refresh();
	}

	/**
	 * Move to next page
	 */
	async nextPage() {
		this._offset += this._perPage;
		await this.refresh();
	}

	get currentPage() {
		if (this._total === 0) return null;
		return this._offset / this._total;
	}

	get pageCount() {
		let pageCount = this._total / this._perPage;
		if (this._total % this._perPage > 0) pageCount++;
		return pageCount;
	}

	get lastPage() {
		return this._offset + this._perPage >= this._total;
	}

	get total() {
		return this._total;
	}

	get content() {
		return this._content;
	}
};
