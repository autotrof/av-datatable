<style scoped>
	.datatable-wrapper {
		width: 100%;
	}
	table.default-table {
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
</style>

<style>
	.datatable-wrapper table .sort-icon {
		margin-right: 3px;
		stroke: rgb(109, 109, 109);
	}
</style>

<template>
	<div class="datatable-wrapper">
		<div class="top-section" v-if="options.paging || options.searching">
			<div class="paging-section" v-if="options.paging">
				Menampilkan
				<select v-model="options.pageLength">
					<option v-for="(page_length, length_menu_index) in options.lengthMenu[0]" :key="page_length" :value="page_length">{{ options.lengthMenu[1][length_menu_index] }}</option>
				</select>
				Data
			</div>
			<div class="search-section" v-if="options.searching">
				Pencarian <input type="text" v-model="options.search" placeholder="pencarian">
			</div>
		</div>

		<table ref="table" :class="options.tableClassName">
			<thead>
				<tr v-if="columns_html.length == 0">
					<slot name="header"></slot>
				</tr>
				<tr v-else>
					<th v-for="(column, index) in columns_html" :key="index" v-html="getHeaderHtml(index)" :data-sortable="column.sortable" @click="sortData(index)"/>
				</tr>
			</thead>

			<tbody>
				<!-- kalau bukan data lokal, biar parent yang proses datanya -->
				<slot v-if="options.data.length>0 || loading" :data="data_shown"/>
				<!-- terakhir, kalau ga ada datanya -->
				<tr v-else>
					<td colspan="columns_html.length" class="data-not-found">
						Data Not Found
					</td>
				</tr>
			</tbody>
		</table>

		<div class="bottom-section" v-if="options.info || options.paging">
			<span v-if="options.info" class="info">{{ info }}</span>
			<div class="pagination" v-if="options.paging">
				<button :disabled="options.page <= 1" @click="firstPage()" type="button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M11 7l-5 5l5 5"></path><path d="M17 7l-5 5l5 5"></path></svg></button>
				<button :disabled="options.page <= 1" @click="prevPage()" type="button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-caret-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 6l-6 6l6 6v-12"></path></svg></button>
				<input type="number" :max="max_page" :min="1" v-model="options.page">
				<button :disabled="options.page >= max_page" @click="nextPage()" type="button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-caret-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 18l6 -6l-6 -6v12"></path></svg></button>
				<button :disabled="options.page >= max_page" @click="lastPage()" type="button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7l5 5l-5 5"></path><path d="M13 7l5 5l-5 5"></path></svg></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, nextTick, onUpdated, watch } from 'vue'

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
const options = ref({
	tableClassName: 'default-table',
	data: [],
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
	info: true
})


// METHOD
function manageColumn() {
	columns_html.value=[]
	const all_headers=table.value?.querySelector('thead tr')?.querySelectorAll('td,th')||[]
	for(let i = 0; i < all_headers.length; i++) {
		let sortable = true
		if(options.value.order[0][0] == i && isColumnSortable(all_headers[i]) === false) {
			sortable = false
			options.value.order[0][0]++
		}
		columns_html.value.push({elm: all_headers[i], sortable})
	}
}

function getHeaderHtml(index) {
	if(index == options.value.order[0][0]&&options.value.order[0][1]=='asc') {
		return `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-ascending sort-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="6" x2="11" y2="6"></line><line x1="4" y1="12" x2="11" y2="12"></line><line x1="4" y1="18" x2="13" y2="18"></line><polyline points="15 9 18 6 21 9"></polyline><line x1="18" y1="6" x2="18" y2="18"></line></svg>` + columns_html.value[index].elm.innerHTML
	} else if(index==options.value.order[0][0]&&options.value.order[0][1]=='desc') {
		return `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-descending sort-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="6" x2="13" y2="6"></line><line x1="4" y1="12" x2="11" y2="12"></line><line x1="4" y1="18" x2="11" y2="18"></line><polyline points="15 15 18 18 21 15"></polyline><line x1="18" y1="6" x2="18" y2="18"></line></svg>` + columns_html.value[index].elm.innerHTML
	}
	return columns_html.value[index].elm.innerHTML
}

function getData() {
	loading.value=true
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
		options.value.order = [new_order_column, new_order_dir]
	}
}


// COMPUTED
const storage_key = computed(() => {
	return `TABLE-${window.location.href}-${props.id||Math.random()}`
})

const current_page = computed(() => {
	return options.value.page > 0 ? options.value.page : 1
})

const data_shown = computed(() => {
	let { data } = options.value
	// if (options.value.searching && options.value.search && local_data.value) {
	// 	data = data.filter(d => {

	// 	})
	// }
	if (options.value.paging && local_data.value) {
		data = data.slice((current_page.value - 1) * options.value.pageLength, options.value.pageLength * current_page.value)
	}
	return data
})

const info = computed(() => {
	return `menampilkan ${current_data_length_state.value} dari ${options.value.data.length} data`
})

const max_page = computed(() => {
	return Math.ceil(options.value.data.length / options.value.pageLength)
})

const current_data_length_state = computed(() => {
	let page_length = options.value.pageLength
	if (options.value.pageLength == -1) {
		page_length = options.value.data.length
	}
	return `${data_shown.value.length}/${page_length}`
})


watch([() => options.value.pageLength, () => options.value.search] , () => options.value.page = 1)

onBeforeMount(() => {
	let storageOptions = {}
	if (props.options?.stateSave) {
		if (!props.id?.trim()) {
			const msg = "property Id harus diisi jika options.stateSave = true\nid diperlukan untuk mengidentifikasi table yang akan disimpan statenya"
			alert(msg)
			throw msg
		}
		if (localStorage.getItem(storage_key.value)) {
			storageOptions = JSON.parse(localStorage.getItem(storage_key)) || {}
		}
	}

	getData()
	options.value = {
		...options.value,
		...props.options,
		...storageOptions
	}
})

onMounted(() => {
	manageColumn()
	if (props.options.data) {
		options.value.data = props.options.data
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
			pageLength: options.value.pageLength || 10
		}))
	}
})
</script>
