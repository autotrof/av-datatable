# av-datatable

This is Vue3 component that can render a table like datatable without jquery

## How To Use

- import AvDatatable from 'av-datatable'
- use it inside your component
- example
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
    <template v-slot="{data}">
      <tr v-for="(d, index) in data" :key="index" @click="trClicked(index)">
        <td>{{ d.gambar }}</td>
        <td>{{ d.name }}</td>
        <td>{{ d.kategori }}</td>
        <td>{{ d.total_stock }}</td>
        <td>{{ d.harga_beli }}</td>
        <td></td>
        <td></td>
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
</script>
```

this component will automatically render pagination and add filtering in your table

properties : 
```
{
  id: '',
  options: {
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
  }
}
```

## NOTE
property id is required when options.stateSave = true

### TODO
- add ajax
- add filter
- add another properties to be look like datatable