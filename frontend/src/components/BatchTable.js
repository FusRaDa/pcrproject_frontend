import { useState } from 'react'
import { useTable } from 'react-table'

const BatchTable = ({columns, data, pk, setPk, setEditing}) => {

  let [rowClicked, setRowClicked] = useState(null)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: ['pk']
    }
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} style={{backgroundColor: i === rowClicked ? "grey" : ""}} onClick={() => {
              setRowClicked(i)
              //if pk is different reset editing - prevent from going to CreateBatch.js
              if (pk !== row.values.pk) {
                setEditing(false)
              };
              //get pk from selected row
              setPk(row.values.pk)}}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default BatchTable