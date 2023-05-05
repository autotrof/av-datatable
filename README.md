# av-datatable

This is Vue3 component that can render a table like datatable without jquery
Unlike the other table libraries, av-datatable keeping the reactivity & the listener.
it's compatible with yajra datatable also

### installation
```
npm i @autotrof/av-datatable
```

## How To Use

- import AvDatatable from 'av-datatable'
- use it inside your component

## Example Render Client Side
```
<template>
  ...your code
  <AvDatatable :options="table_options" id="table-1">
    <template #header>
      <th data-sortable="false">Gambar</th>
      <th>Item</th>
      <th>Kategori</th>
      <th>Total Stock</th>
      <th>Harga Beli</th>
      <th>Harga Jual</th>
      <th>Margin</th>
    </template>
    <tr v-for="(d, index) in data" :key="index" @click="trClicked(index)" class="table-danger">
		<td>{{ d.gambar }}</td>
		<td>{{ d.name }}</td>
		<td>{{ d.kategori }}</td>
		<td>{{ d.total_stock }}</td>
		<td>{{ d.harga_beli }}</td>
		<td>
			<Link href="/catalog">Special Component still works here. 😎</Link>
		</td>
		<td></td>
	</tr>
  </AvDatatable>
  ... another code
</template>

<script setup>
import AvDatatable from 'av-datatable'
import 'av-datatable/style.css'

function trClicked(index) {
  console.log('tr ' + index + 'clicked. yeay')
}

let data = your array data write here
const table_options = {
	tableClassName: 'table table-hover table-striped',
	stateSave: true,
	fixedHeader: true,
	language: {
		lengthMenu: "Menampilkan _MENU_ data tiap halaman",
		infoEmpty: "Tidak ada data yang bisa ditampilkan",
		zeroRecords: "Data tidak ditemukan",
		search: "Cari:",
		info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
		infoFiltered: "(difilter dari _MAX_ total keseluruhan data)",
	}
}
</script>
```
this component will automatically render pagination and add filtering in your table

## Example Using Ajax (Server Side)

```
<template>
  ...your code
	<AvDatatable ref="table_1" :options="table_options" id="table-1">
		<template #header>
			<th>SKU</th>
			<th>Name</th>
			<th>Margin</th>
			<th></th>
		</template>
		<template v-slot="{data}">
			<tr v-for="item in data.data">
				<td>{{ item.sku }}</td>
				<td>{{ item.name }}</td>
				<td>{{ item.margin }}</td>
				<td><Link href="/anything">Tour SPA Link</Link></td>
			</tr>
		</template>
	</AvDatatable>
  ... another code
</template>

<script setup>
import AvDatatable from 'av-datatable'
import 'av-datatable/style.css'

function trClicked(index) {
  console.log('tr ' + index + 'clicked. yeay')
}

let data = your array data write here
const table_options = {
	tableClassName: 'table table-hover table-striped',
	stateSave: true,
	fixedHeader: true,
	language: {
		lengthMenu: "Menampilkan _MENU_ data tiap halaman",
		infoEmpty: "Tidak ada data yang bisa ditampilkan",
		zeroRecords: "Data tidak ditemukan",
		search: "Cari:",
		info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
		infoFiltered: "(difilter dari _MAX_ total keseluruhan data)",
	}
}
</script>
```

## Options

```
{
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
}
```

## Note
property id is required when options.stateSave = true
add data-sortable="false" at th element if the column is not sortable

### Todo
- add another properties to be look like datatable
