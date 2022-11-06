import { useMemo } from 'react'
import { useTable, useFilters, useGlobalFilter } from 'react-table'
import DefaultColumnFilter from './DefaultColumnFilter'
import FuzzyTextFilterFn from './FuzzyTextFilterFn'


FuzzyTextFilterFn.autoRemove = val => !val

const BatchTable = ({columns, data, setSelectedBatch, setFullSheet, rowClicked, setRowClicked}) => {

  const filterTypes = useMemo(() => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: FuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })},
      }), [])

  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter
  }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        hiddenColumns: ['pk']
        },
    },
    useFilters,
    useGlobalFilter,
  )

  //limit number of rows shown to 10
  const firstPageRows = rows.slice(0, 10)

  return (
    <>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                {/*Render the columns filter UI */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {firstPageRows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} style={{backgroundColor: i === rowClicked ? "grey" : ""}} onClick={() => {
              setRowClicked(i);
              setSelectedBatch(row.original);
              setFullSheet(false)}}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
    
    <br />
    <div>Showing the first 20 results of {rows.length} rows</div>
    <div>
      <pre>
        <code>{JSON.stringify(state.filters, null, 2)}</code>
      </pre>
    </div>
  </>
  )
}

export default BatchTable