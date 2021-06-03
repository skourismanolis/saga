const Base = require('./Base');

module.exports = class PaginatedList extends Base {
	/**
	 * @param {Object} client a SagaClient object
	 * @param {String} options.url url used to fetch the connected resource
	 * @param {Function} options.dataTransformer a function that takes an array of the resource
	 *                                           as returned from the api, transforms it
	 *                                           (i.e. calls a constructor) and returns the array
	 *                                           of the api to expose to the user
	 */
	constructor(client, { url, dataTransformer }) {
		super(client);
		this._url = url;
		this._offset = 0; //pagination offset
		this._total = 0; //how many of the resource exist currently
		this._content = []; //the actual resources
		this._perPage = this.client._perPage; //how many of the connected resource to get per page
		this._dataTransformer = dataTransformer;
	}

	async refresh() {
		let { data, headers } = await this.axios({
			method: 'GET',
			url: this._url,
			headers: {
				'X-Pagination-Limit': this._perPage,
				'X-Pagination-Offset': this._offset,
			},
		});

		this._total = Number(headers['x-pagination-total']);

		this._content = this._dataTransformer(data);
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
