import { useEffect, useMemo } from 'react'
import { useTable, useFilters, usePagination } from 'react-table'
import DefaultColumnFilter from './DefaultColumnFilter'
import FuzzyTextFilterFn from './FuzzyTextFilterFn'
import styled from 'styled-components'

const Styles = styled.div`
  display: block;
  max-width: 100%;

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
  }

  table {
    width: 100%;
    border-spacing: 0;
  
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tbody tr:hover {
      background-color: grey;
      color: white;
      cursor: pointer;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      width: 1%;
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

//remove filter if search is empty
FuzzyTextFilterFn.autoRemove = val => !val

const BatchTable = ({columns, data, setSelectedBatch, rowClicked, setRowClicked, setEditing, fetchData, loading, pageCount: controlledPageCount}) => {

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
    prepareRow,
    page,
    canPreviousPage, 
    canNextPage, 
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      initialState: {
        hiddenColumns: ['pk'],
        pageIndex: 0
        },  
      columns,
      data,
      defaultColumn,
      filterTypes,
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useFilters,
    usePagination
  )

  useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  return (
    <Styles>
      <div className="tableWrap">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {/* column filter */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))} 
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} style={{backgroundColor: i === rowClicked ? "grey" : ""}} onClick={() => {
                  setRowClicked(i);
                  setSelectedBatch(row.original);
                  setEditing(true)
                }}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>
                    {cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}

            <tr>
              {loading ? (
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                  results
                </td>
              )}
            </tr>
          </tbody>
        </table>

        <div className='pagination'>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page {' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Styles>
  )
}

export default BatchTable