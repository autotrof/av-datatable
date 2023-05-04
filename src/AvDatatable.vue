<style scoped>
	.datatable-wrapper {
		width: 100%;
	}
	table.default-table {
		position: relative;
		border-collapse: collapse;
		width: 100%;
	}
	table.default-table thead tr td, table.default-table thead tr th {
		padding: 5px 10px;
	}
	table.default-table thead {
		background: #36304a;
	}
	table.default-table thead tr th {
		color: whitesmoke;
		font-weight: 500;
	}
	table thead tr th {
		user-select: none;
	}
	table thead tr th[data-sortable='true'] {
		cursor: pointer;
	}
	table thead tr th[data-sortable='true']:hover {
		filter: brightness(0.95);
	}
	table thead tr th[data-sortable='true']:active {
		filter: brightness(0.9);
	}
	table.default-table tr td, table.default-table tr th {
		border: 1px solid #36304a;
		padding: 8px 0;
	}
	table.default-table .data-not-found {
		text-align: center;
		color: indianred;
	}
	.datatable-wrapper .bottom-section, .datatable-wrapper .top-section {
		display: flex;
		align-items: center;
	}
	.datatable-wrapper .bottom-section {
		padding: 0 15px 15px 15px;
	}
	.datatable-wrapper .top-section {
		padding: 15px;
	}
	.datatable-wrapper .bottom-section .info {
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex: 1;
	}
	.datatable-wrapper .bottom-section .pagination {
		display: flex;
		align-items: center;
	}
	.datatable-wrapper .bottom-section .pagination input{
		min-width: 40px;
		outline: none;
		text-align: center;
		border-radius: 0;
		border: 1px solid #a1a1a1;
		color: #383838;
		padding: 2px 0;
	}
	.datatable-wrapper .bottom-section .pagination button {
		background: white;
		border-collapse: collapse;
		border-top: 1px solid #a1a1a1;
		border-bottom: 1px solid #a1a1a1;
		padding: 2px 3px;
		transition: 0.1s;
	}
	.datatable-wrapper .bottom-section .pagination button:hover {
		filter: brightness(0.9);
	}
	.datatable-wrapper .bottom-section .pagination button:active {
		filter: brightness(0.8);
	}
	.datatable-wrapper .bottom-section .pagination button:nth-child(1), .datatable-wrapper .bottom-section .pagination button:nth-child(5) {
		border-right: 1px solid #a1a1a1;
		border-left: 1px solid #a1a1a1;
	}
	.datatable-wrapper .bottom-section .pagination button:nth-child(2), .datatable-wrapper .bottom-section .pagination button:nth-child(4) {
		border-right: 0px;
		border-left: 0px;
	}
	.datatable-wrapper .top-section .paging-section, .datatable-wrapper .top-section .search-section {
		display: flex;
		align-items: center;
	}
	.datatable-wrapper .top-section .paging-section {
		flex: 1;
	}
	.datatable-wrapper .top-section .search-section input {
		margin-left: 7px;
	}
	.datatable-wrapper .top-section .paging-section select {
		margin: 0 7px;
	}
	.datatable-wrapper .backdrop-loading {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #06050536;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}
	.input-search, .input-display-length {
		border: 1px solid lightgray;
	}
	.input-search:focus, .input-display-length:focus {
		outline: none;
	}
	.header-sticky {
		position: sticky;
		top: 0;
	}
</style>

<style>
	.datatable-wrapper table .sort-icon {
		margin-right: 3px;
		stroke: rgb(109, 109, 109);
	}
	@keyframes rotation {
		from {
			transform: rotate(359deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
	.datatable-wrapper .backdrop-loading svg {
		width: 100px;
		height: 100px;
		animation: rotation 2s infinite linear;
	}
</style>

<template>
	<div class="datatable-wrapper">
		<div class="top-section" v-if="options.paging || options.searching">
			<div class="paging-section" v-if="options.paging">
				{{ displayLengthMenu[0] || '' }}
				<select v-if="displayLengthMenu[2]" v-model="options.pageLength" class="input-display-length">
					<option v-for="(page_length, length_menu_index) in options.lengthMenu[0]" :key="page_length" :value="page_length">{{ options.lengthMenu[1][length_menu_index] }}</option>
				</select>
				{{ displayLengthMenu[1] || '' }}
			</div>
			<div class="search-section" v-if="options.searching">
				{{ options.language.search }} <input type="text" v-model="options.search" class="input-search">
			</div>
		</div>

		<table ref="table" :class="options.tableClassName">
			<thead>
				<tr v-if="columns_html.length == 0">
					<slot name="header"></slot>
				</tr>
				<tr v-else>
					<th v-for="(column, index) in columns_html" :key="index" v-html="header_html[index]" :data-sortable="column.sortable" @click="sortData(index)" :class="{'header-sticky': options.fixedHeader}"/>
				</tr>
			</thead>

			<tbody>
				<slot v-if="managed_local_data.length == 0"></slot>
			</tbody>
		</table>

		<div class="backdrop-loading" v-if="loading" v-html="options.language.processing"></div>

		<div class="bottom-section" v-if="options.info || options.paging">
			<span v-if="options.info" class="info">{{ info }} {{ info_filtered }}</span>
			<div class="pagination" v-if="options.paging">
				<button :disabled="options.page <= 1" @click="firstPage()" type="button" v-html="options.language.paginate.first"></button>
				<button :disabled="options.page <= 1" @click="prevPage()" type="button" v-html="options.language.paginate.previous"></button>
				<input type="number" :max="max_page" :min="1" v-model="options.page">
				<button :disabled="options.page >= max_page" @click="nextPage()" type="button" v-html="options.language.paginate.next"></button>
				<button :disabled="options.page >= max_page" @click="lastPage()" type="button" v-html="options.language.paginate.last"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, nextTick, onUpdated, watch, useSlots, render, h } from 'vue'
import regex_like from '@autotrof/regex-like'

const slots = useSlots()
const props = defineProps({
	id: {
		type: String,
		required: false
	},
	options: {
		type: Object,
		required: false,
		default: {}
	},
})

const table = ref(null)
const columns_html = ref([])
const loading = ref(true)
const local_data = ref(true)
const response_data = ref({
	data: [],
	recordsTotal: 0,
	recordsFiltered: 0,
	draw: 0
})
const local_records_filtered = ref(0)
const managed_local_data = ref([])
const vdoms = ref([])

const options = ref({
	tableClassName: 'default-table',
	ajax: {
		url: null,
		type: "GET",
		data: {}
	},
	fixedHeader: false,
	paging: true,
	searching: true,
	ordering: true,
	stateSave: false,
	info: true,
	lengthMenu: [[10, 25, 50, 100, -1], ['10', '25', '50', '100', 'All']],
	pageLength: 10,
	page: 1,
	search: '',
	order: [[0, 'asc']],
	initComplete: null,
	info: true,
	language: {
		info: 			"Showing _START_ to _END_ of _TOTAL_ entries",
		infoEmpty: 		"Showing 0 to 0 of 0 entries",
		infoFiltered: 	"(filtered from _MAX_ total entries)",
		lengthMenu: 	"Show _MENU_ entries",
		processing: 	`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh-dot" width="64" height="64" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>`,
		search: 		"Search:",
		zeroRecords: 	"No matching records found",
		paginate: {
			first: 		`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M11 7l-5 5l5 5"></path><path d="M17 7l-5 5l5 5"></path></svg>`,
			last: 		`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7l5 5l-5 5"></path><path d="M13 7l5 5l-5 5"></path></svg>`,
			next: 		`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg>`,
			previous: 	`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 6l-6 6l6 6"></path></svg>`
		}
	}
})


// METHOD
function manageColumn() {
	const all_headers = table.value?.querySelector('thead tr')?.querySelectorAll('td,th') || []
	for (let i = 0; i < all_headers.length; i++) {
		let sortable = true
		if (options.value.order[0][0] == i && isColumnSortable(all_headers[i]) === false) {
			sortable = false
			options.value.order[0][0]++
		}
		columns_html.value.push({elm: all_headers[i].innerHTML, sortable})
	}
}

function getData() {
	loading.value = true
}

function isColumnSortable(column) {
	if (column.dataset.sortable === 'false') return false
	return true
}

function firstPage() {
	if (options.value.page > 1) options.value.page = 1
}

function prevPage() {
	if (options.value.page > 1) options.value.page--
}

function nextPage() {
	if (options.value.page < max_page.value) options.value.page++
}

function lastPage() {
	options.value.page = max_page.value
}

function sortData(column_index) {
	const column = columns_html.value[column_index]
	if (column.sortable) {
		let new_order_column = column_index;
		let new_order_dir = 'asc'

		const current_order_column = options.value.order[0][0]

		if (current_order_column == column_index) {
			new_order_dir = options.value.order[0][1] == 'asc' ? 'desc' : 'asc'
		}
		options.value.order = [[new_order_column, new_order_dir]]
	}
}

// COMPUTED
const header_html = computed(() => {
	let columns = []
	for (let index in columns_html.value) {
		if (index == options.value.order[0][0] && options.value.order[0][1] == 'asc') {
			columns.push(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-ascending sort-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="6" x2="11" y2="6"></line><line x1="4" y1="12" x2="11" y2="12"></line><line x1="4" y1="18" x2="13" y2="18"></line><polyline points="15 9 18 6 21 9"></polyline><line x1="18" y1="6" x2="18" y2="18"></line></svg>` + columns_html.value[index].elm)
		} else if(index == options.value.order[0][0] && options.value.order[0][1] == 'desc') {
			columns.push(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-descending sort-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="6" x2="13" y2="6"></line><line x1="4" y1="12" x2="11" y2="12"></line><line x1="4" y1="18" x2="11" y2="18"></line><polyline points="15 15 18 18 21 15"></polyline><line x1="18" y1="6" x2="18" y2="18"></line></svg>` + columns_html.value[index].elm)
		} else {
			columns.push(columns_html.value[index].elm)
		}
	}
	return columns
})

const displayLengthMenu = computed(() => {
	const text = options.value.language.lengthMenu
	if (text.includes('_MENU_')) {
		const fist_part = text.substring(0, text.indexOf('_MENU_')).trim()
		const second_part = text.substring(text.indexOf('_MENU_') + 6).trim()
		return [fist_part, second_part, true]
	} else {
		return ['', '', false]
	}
})

const count_records_total = computed(() => {
	if (local_data.value) {
		return managed_local_data.value?.length || 0
	} else {
		return response_data.value.recordsTotal
	}
})

const count_records_filtered = computed(() => {
	if (local_data.value) {
		return local_records_filtered.value
	} else {
		return response_data.value.recordsFiltered
	}
})

const storage_key = computed(() => {
	return `TABLE-${window.location.href}-${props.id||Math.random()}`
})

const current_page = computed(() => {
	return options.value.page > 0 ? options.value.page : 1
})

const data_shown = computed(() => {
	let data = JSON.parse(JSON.stringify(managed_local_data.value))

	// LOCAL DATA FILTERING
	if (options.value.searching && options.value.search?.trim() !== '' && options.value.search !== undefined && options.value.search !== null) {
		const regex = regex_like(options.value.search)
		data = data.filter((obj, index) => {
			for (let value of obj.data) {
				if (typeof value == 'number') {
					value += ''
				}
				if (typeof value != 'string') continue
				if (regex.test(value)) {
					return true
				}
			}
		})
	}

	local_records_filtered.value = data.length

	// LOCAL DATA SORTING
	const order = options.value.order
	if (order[0][0] < columns_html.value.length && order[0][0] >= 0) {
		data.sort((a, b) => {
			if ( a.data[order[0][0]] < b.data[order[0][0]] ) return order[0][1] == 'asc' ? -1 : 1
			if ( a.data[order[0][0]] > b.data[order[0][0]] ) return order[0][1] == 'asc' ? 1 : -1
			return 0
		})
	}

	if (options.value.paging && local_data.value) {
		data = data.slice((current_page.value - 1) * options.value.pageLength, options.value.pageLength * current_page.value)
	}
	let indexes = data.map(d=>parseInt(d.index))
	let new_vdoms = []
	for (let vdom of vdoms.value) {
		if (indexes.includes(vdom.key)) new_vdoms.push(vdom)
	}
	if (table.value) {
		let tbody = h('tbody',new_vdoms)
		render(tbody, table.value)
	}
	return data
})

const info = computed(() => {
	const start = (options.value.page - 1) * options.value.pageLength + 1
	const end = options.value.pageLength != -1 ? start + data_shown.value.length - 1 : count_records_filtered.value
	return options.value.language.info.replace('_START_', start).replace('_END_', end).replace('_TOTAL_', count_records_filtered.value)
})

const info_filtered = computed(() => {
	return options.value.language.infoFiltered.replace('_MAX_', count_records_total.value)
})

const max_page = computed(() => {
	return Math.ceil(count_records_filtered.value / options.value.pageLength)
})

watch([() => options.value.pageLength, () => options.value.search] , () => options.value.page = 1)

onBeforeMount(() => {
	let storageOptions = {}
	if (props.options?.stateSave) {
		if (!props.id?.trim()) {
			const msg = "property Id is required if options.stateSave = true"
			throw msg
		}
		if (localStorage.getItem(storage_key.value)) {
			storageOptions = JSON.parse(localStorage.getItem(storage_key.value)) || {}
		}
	}

	// gabungin semua data
	const props_options = props.options
	if (props.options?.language) {
		options.value.language = {
			...options.value.language,
			...props_options.language
		}
		delete props_options.language
	}

	options.value = {
		...options.value,
		...props_options,
		...storageOptions
	}
})

onMounted(() => {
	manageColumn()

	if (!props.options.ajax?.url) {
		const tr_elms = table.value.querySelectorAll('tbody tr')
		const body_slot = slots.default()

		let ld = []
		for (const index in body_slot[0].children) {
			render(body_slot[index], table.value.querySelector('tbody'))
			const vdom = body_slot[0].children[index]
			vdoms.value.push(vdom)
			let data = []
			for (let index_td in vdom.children) {
				data.push(tr_elms[index].querySelectorAll(`td,th`)[index_td].innerText)
			}
			ld.push({index, data})
		}
		managed_local_data.value = ld
		loading.value = false
	} else {
		local_data.value = false
	}

	if (options.value.initComplete != null) {
		nextTick(() => {
			options.value.initComplete(options.value)
		})
	}
})

onUpdated(() => {
	if (options.value.stateSave) {
		localStorage.setItem(storage_key.value, JSON.stringify({
			page: options.value.page || 1,
			order: options.value.order,
			pageLength: options.value.pageLength || options.value.lengthMenu[0][0] || 10
		}))
	}
})
</script>
