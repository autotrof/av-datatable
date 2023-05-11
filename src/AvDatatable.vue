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
	.datatable-wrapper table .__sort {
		width: 18px;
		height: 18px;
		margin-right: 3px;
		margin-top: -3px;
	}
	.datatable-wrapper table thead .__sortable {
		cursor: pointer;
		transition: .2s;
	}
	.datatable-wrapper table thead .__sortable:hover {
		filter: brightness(0.9);
	}
	.datatable-wrapper table thead .__middle {
		vertical-align: middle;
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
			<thead v-if="!processed_header">
				<tr>
					<slot name="header"></slot>
				</tr>
			</thead>
			<thead ref="thead" v-else></thead>
			<tbody>
				<slot v-if="managed_local_data.length == 0 && local_data"></slot>
				<slot v-else-if="!local_data" :data="response_data"></slot>
			</tbody>
		</table>

		<div class="backdrop-loading" v-if="loading" v-html="options.language.processing"></div>

		<div class="bottom-section" v-if="options.info || options.paging">
			<span v-if="options.info" class="info">{{ info }} {{ info_filtered }}</span>
			<div class="pagination" v-if="options.paging">
				<button :disabled="options.page <= 1" @click="firstPage()" type="button" v-html="options.language.paginate.first"></button>
				<button :disabled="options.page <= 1" @click="prevPage()" type="button" v-html="options.language.paginate.previous"></button>
				<input type="number" @input="getDataWait" :max="max_page" :min="1" v-model="options.page">
				<button :disabled="options.page >= max_page" @click="nextPage()" type="button" v-html="options.language.paginate.next"></button>
				<button :disabled="options.page >= max_page" @click="lastPage()" type="button" v-html="options.language.paginate.last"></button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, nextTick, onUpdated, watch, useSlots, render, h, createTextVNode } from 'vue'
import regex_like from '@autotrof/regex-like'
import debounce from 'underscore/modules/debounce'

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
		data: {},
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
      		"Content-Type": "application/json",
      		// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
	},
	sortIcon: {
		asc: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAMAAAAJixmgAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9tVJtUAAAAI3RSTlMAAgMEBgcMU1dYi5GSoKGip6ipv8TN1tnc3uDh4vX29/r7/MbURHIAAAABYktHRCS0BvmZAAADSElEQVR42u2cW1fiMBRG6ciIFQel3uiIIPb//0efvGCTtE1P0nNg70fWIitbjrk1X2czAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBTZV6uN4dGhMNmXc7H9OXy5uWtad5ebi7T+S62jSjbRXxfrt8/W3m/TqRbLBtxlkVcXy4ef7byeJFEOIFv0yzj/vZPx608pzBeNEmIqeri/ncrD/LG8zqN8P+/w31v281U4sZlk4irwb7/XM3cSRtXqYQrEV954zqVcC3jK268TyW8F/KVNt6lEn6V8hU2VlHSYV9ZYw2DVpevqLGCaanbV9J4+oVHH19J46mXlv18JY2n3Tz09RU0nnR7WKz6N7oqxKp6sgOA/r+v8Mg10RHPMN8EO4nMDPW1bjzc17ZxjK9l4zhfu8ZD5qNUs5OF39fqbzzG16LxOF97xmN9rRmP97VlLOFryVjG145x/PxrdD4W3HwvLfiGDpRWvT8c8YQyM6Ejw7s/rk9D//IRTyhzU4Z8Z66Pg4PclXrhKjgEOYVDw1ylXrgODrlu4YBxrV54769nv7C/qvfqhXchX6+w1/jVaEl/LiG8wr6qrm0OWl9LJr+wx1j/oFX66zks7K5q/dOSY+Hx7RsUdhkbWHi0l5Y/twBBYUdVG1hatjYPR1uesHDL2MTm4dezyuOnjB3Cwe9qruqt7yljl3Dou6pHrnK9ObieMnYL+79rkh7CpwXCCCOMMMIII3wOwkqyh9mEtWQPMwnryR5mEtaTPcwjrCh7mEVYUfYwj7Ce7GEmYTXZw1zCWrKH2YSVZA/zCevIHlLSDFpMSyw8WFqyeTjX7eHZHQCc4REPp5YII4wwwggjjDDCCCOMMMIII4wwwggjjDDCCCOMMMIII4wwwggjjDDCCCOMMMJ2LqaNuaxm9uph7HVEw5dL4y6cWr4+HHWl2PQF8ZhL46YjADGxANshj4jgh+0YT0S0x3ZQKyK8ZTt7GJFHtJ09jMgj7kQSjIZKuhZJMBoatCqRBKOhaakUSTAaWni0+5Li3aSKlpbtviR5l6OezUOrL2neTapne5jt3aRaDgCO+5Ly3aRKjni++3Iy7yYFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOjNB45vKHvz0SPuAAAAAElFTkSuQmCC`,
		desc: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAMAAAAJixmgAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9tVJtUAAAAI3RSTlMAAgMEBgcMU1dYi5GSoKGip6ipv8TQ1tnc3uDh4vX29/r7/BecCEUAAAABYktHRCS0BvmZAAADYElEQVR42u2cYXPTMAxAEzrWdh2lKwxWttFt+f//kQ0obMV241RSpPLex94l53fVxZZsuWkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE6Vs/nVzWOnxuPN1fysaixVT9QzvevUuZvWjqXvE9W0i86ERVs7lj5PDMDI93n81WNZqMRzZ8a0eiwKUX22sRP+9r52LIeeGMC8M2RWPZaZuPDaUnhdPZa1uPDGUnhTPZaNuPDWUnhbPZatuPB3S+H78lhSj5x0SJsIe/pomQh7mpZMhD0tPEyEPS0tbYQdJQ9Gwn7SQyNhPwUAM2EvJR47YScgjDDCCCOMMMIII4wwwggjjDDCCCOMMMIII4wwwggjjDDCCCOMMMIII4wwwgifrLDgwbRjugbDHj0c2jUY+HDpsK7ByMeHF36FlQ6IT70Ka7UADOkajN3kMXMqrNbGs3YqrNbUsnEqrNZ7uHUqrNZ7eE9I89FiWmLhwdKS5IH0kAIAJR6qlggjjDDCCCOMMMInI5y9m7SHsMW9pnqpyn6ScVjY4F5T3WT0bRp5SNjkXlPlcsOy7S/cLgWKDObxvC/02rgsvO+rcq+pQclwNekn3H4QKRQakyoK/zUuCSd8Ne41lSZZ9v8T1QXhf+N5YLHfmHQRfGecF077KtxrKk1mr/J3VGeFk/HcadxrKk1ur/KXcU445ztkh9JFSO+iOiOciecQIZ3fq3wxTgvnfQN8tAp7lc9RnRTOxnOIaam0V7mapH4t+QZYeBT3Kpe9f4yztBTdqwyRPJQ+QZUsY6SHxY9QDat3USoeMsZxfGWMI/lKGMfyPd44mu+xxvF8jzOO6HvMfBxl/pX6j2P+v8ON4/oOM47sO8RYynesg2m1xlK+4x09rDMW8h31cGnN7CQ1H417fLj/fywWzyMfEO9rLPa9Gr0FoJ+x2HzkoMmjj7Hc/OuhjeewseB6w0Wj1iFjyfWVj97D8uwkmh856T0s/cey62cvvYd5Y+F8wU3vYc5YOj/y03uYNhbPBx31HrYfE3Ein/866j1sP+2/5bNGvu+n97Bpv7x9y1eV+oaf3sOmmVy/fsv1RKnU4qX38IWLp91bni70iktOeg9/cn55+9B1D7eX5w0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAwP/ED+OLKGcQLl+wAAAAAElFTkSuQmCC`
	}
})

const thead = ref(null)
const the_tr = ref(null)
const processed_header = ref(false)
const render_times = ref(0)

// METHOD
function objectToQueryParams(obj) {
  if (!obj) return ""
  const query = [];

  function traverse(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newPrefix = prefix ? `${prefix}[${key}]` : key;

      if (value === null) {
        query.push(`${encodeURIComponent(newPrefix)}=null`);
      } else if (typeof value === 'object') {
        traverse(value, newPrefix);
      } else if (Array.isArray(value)) {
        query.push(...value.map((val, i) => `${encodeURIComponent(newPrefix)}[${i}]=${encodeURIComponent(val)}`));
      } else {
        query.push(`${encodeURIComponent(newPrefix)}=${encodeURIComponent(value)}`);
      }
    }
  }

  traverse(obj);

  return decodeURI(query.join('&'));
}

function manageColumn() {
	const header_slot = slots.header()

	let list_th = []
	for (let i = 0; i < header_slot.length; i++) {
		const vdom_th = header_slot[i]
		let th_props = vdom_th.props

		if (!th_props) th_props = {}
		if (!th_props.class) th_props.class = ""
		if (th_props['data-sortable'] == undefined) th_props['data-sortable'] = 'true'


		let sortable = !(th_props['data-sortable'] === 'false')
		if (options.value.order[0][0] === i && !sortable) options.value.order[0][0]++

		let new_children = []

		if (options.value.order[0][0] == i) {
			new_children.push(sort_image.value)
		}

		if (sortable) th_props.class += " __sortable"
		else th_props.class += " __middle"
		th_props.onClick = () => sortData(i)

		if (typeof vdom_th.children == 'string') new_children.push(h(createTextVNode(vdom_th.children)))
		else new_children = new_children.concat(vdom_th.children)

		const new_header = h(vdom_th.type, th_props, new_children)

		list_th.push(new_header)
	}
	render_times.value++
	the_tr.value = h('tr', {key: render_times.value}, list_th)
	processed_header.value = true

	nextTick(() => {
		render(the_tr.value, thead.value)
	})
}

async function getData() {
	loading.value = true
	let data = {
		...options.value.ajax?.data,
		search: {
			value: options.value.search
		},
		start: (options.value.page - 1) * options.value.pageLength,
		length: options.value.pageLength,
		draw: response_data.value.draw,
		order: [
			{
				column: options.value.order[0][0],
				dir: options.value.order[0][1],
			}
		]
	}

	let opt = {
		method: options.value.ajax.type,
		mode: options.value.ajax.mode,
		cache: options.value.ajax.cache,
		credentials: options.value.ajax.credentials,
			headers: options.value.ajax.headers,
		redirect: options.value.ajax.redirect,
		referrerPolicy: options.value.ajax.referrerPolicy
	}
	let { url } = options.value.ajax
	if (opt.method == "GET") {
		if (!url.includes("?")) url += "?"
		else url += "&"
		url += objectToQueryParams(data)
	} else {
		opt.body = JSON.stringify(data)
	}
	const response = await fetch(url, opt)
	const json = await response.json()
	loading.value = false
	response_data.value = json
}

function firstPage() {
	if (options.value.page > 1) options.value.page = 1
	if (!local_data.value) {
		nextTick(() => {
			getData()
		})
	}
}

function prevPage() {
	if (options.value.page > 1) options.value.page--
	if (!local_data.value) {
		nextTick(() => {
			getData()
		})
	}
}

function nextPage() {
	if (options.value.page < max_page.value) options.value.page++
	if (!local_data.value) {
		nextTick(() => {
			getData()
		})
	}
}

function lastPage() {
	options.value.page = max_page.value
	if (!local_data.value) {
		nextTick(() => {
			getData()
		})
	}
}

function sortData(column_index) {
	const column = the_tr.value.children[column_index]

	if (column.props['data-sortable'] === 'true') {
		let new_order_dir = 'asc'
		if (options.value.order[0][0] == column_index) new_order_dir = options.value.order[0][1] == 'asc' ? 'desc' : 'asc'
		options.value.order = [[column_index, new_order_dir]]

		for (let index in the_tr.value.children) {
			const th = the_tr.value.children[index]
			if (th.children[0].type == 'img' && th.children[0].props.class.includes('__sort')) {
				the_tr.value.children[index].children.splice(0, 1)
			}
		}

		the_tr.value.children[column_index].children = [sort_image.value].concat(the_tr.value.children[column_index].children)
		render_times.value++

		let current_props = the_tr.value.props
		current_props.key = render_times.value
		const new_tr = h('tr', current_props, the_tr.value.children)

		nextTick(() => {
			render(new_tr, thead.value)
		})
	}
}

const sort_image = computed(() => {
	return h('img',{src: options.value.sortIcon[options.value.order[0][1]], class: '__sort'})
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
		data = data.filter((val, index) => {
			for (let value of val) {
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
	if (order[0][0] < (the_tr.value?.children?.length || 0) && order[0][0] >= 0) {
		data.sort((a, b) => {
			if ( a[order[0][0]] < b[order[0][0]] ) return order[0][1] == 'asc' ? -1 : 1
			if ( a[order[0][0]] > b[order[0][0]] ) return order[0][1] == 'asc' ? 1 : -1
			return 0
		})
	}

	if (options.value.paging && local_data.value) {
		data = data.slice((current_page.value - 1) * options.value.pageLength, options.value.pageLength * current_page.value)
	}


	if (table.value) {
		const indexes = data.map(d => d[(d.length-1)])
		let new_vdoms = []
		for (let index of indexes) {
			new_vdoms.push(vdoms.value[index])
		}
		const tbody = h('tbody', new_vdoms)
		render(tbody, table.value)
	}

	return data
})

const info = computed(() => {
	const start = (options.value.page - 1) * options.value.pageLength + 1
	let end = 0
	let total = 0
	if (local_data.value) {
		end = options.value.pageLength != -1 ? start + data_shown.value.length - 1 : count_records_filtered.value
		total = count_records_filtered.value
	} else {
		end = options.value.pageLength != -1 ? start + response_data.value?.data?.length - 1 : response_data.value?.recordsFiltered
		total = response_data.value?.recordsTotal
	}
	return options.value.language.info.replace('_START_', start).replace('_END_', end).replace('_TOTAL_', total)
})

const info_filtered = computed(() => {
	const max = local_data.value ? count_records_total.value : (response_data.value?.recordsTotal)
	return options.value.language.infoFiltered.replace('_MAX_', max)
})

const max_page = computed(() => {
	if (local_data.value) return Math.ceil(count_records_filtered.value / options.value.pageLength)
	return Math.ceil(response_data.value?.recordsFiltered / options.value.pageLength)
})

const getDataWait = debounce(getData, 250)

watch([
		() => options.value.pageLength,
		() => options.value.search
	] ,
	() => {
		if (options.value.page != 1) {
			options.value.page = 1
		}
})

watch([
		() => options.value.pageLength,
		() => options.value.search,
		() => options.value.order
	] ,
	() => {
		if (!local_data.value) {
			getDataWait()
		}
})

onBeforeMount(() => {
	// STATE SAVE
	const default_options = JSON.stringify(options.value)
	let storageOptions = {}
	if (props.options?.stateSave) {
		if (!props.id?.trim()) {
			const msg = "property Id is required if options.stateSave = true"
			throw msg
		}
		if (localStorage.getItem(storage_key.value)) {
			storageOptions = JSON.parse(localStorage.getItem(storage_key.value)) || {}
		}
	} else {
		localStorage.removeItem(storage_key.value)
	}

	const props_options = props.options

	let new_options = options.value
	// LANGUAGE
	if (props.options?.language) {
		new_options.language = {
			...new_options.language,
			...props_options.language
		}
		delete props_options.language
	}

	// AJAX
	if (props.options?.ajax) {
		local_data.value = true
		new_options.ajax = {
			...new_options.ajax,
			...props_options.ajax
		}
		delete props_options.ajax
	}


	// COMBINING props.options dengan options default & storage options
	options.value = {
		...new_options,
		...props_options,
		...storageOptions
	}

	// cek apakah parameter ajax terisi. kl terisi berarti local_data = false
	if (options.value.ajax?.url) {
		local_data.value = false
		// if same, then the watcher wont be run.
		if (default_options == JSON.stringify(options.value) || options.value.stateSave == false) {
			getData()
		}
	}
})

onMounted(() => {
	manageColumn()
	// kalau datanya lokal. kita manage sendiri
	if (local_data.value) {
		const tr_elms = table.value.querySelectorAll('tbody tr')

		let ld = []
		for (const index in tr_elms) {
			const tr_elm = tr_elms[index]
			if (typeof tr_elm != 'object') continue
			const tds = tr_elm?.querySelectorAll('td')
			let data = []
			for (let index_td in tds) {
				const td_elm = tds[index_td]
				if (typeof td_elm != 'object') continue
				data.push(td_elm.innerText)
			}
			data.push(index)
			ld.push(data)
			vdoms.value.push(tr_elm.__vnode)
		}
		managed_local_data.value = ld
		loading.value = false

		if (options.value.initComplete != null) {
			nextTick(() => {
				options.value.initComplete(options.value)
			})
		}
	}
})

onUpdated(() => {
	if (options.value.stateSave) {
		localStorage.setItem(storage_key.value, JSON.stringify({
			search: options.value.search || '',
			page: options.value.page || 1,
			order: options.value.order,
			pageLength: options.value.pageLength || options.value.lengthMenu[0][0] || 10
		}))
	}
})
</script>
