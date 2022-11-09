import React, { useEffect, useMemo } from 'react'
import { useTable, useFilters, usePagination, useColumnOrder, useExpanded } from 'react-table'
import DefaultColumnFilter from './DefaultColumnFilter'
import FuzzyTextFilterFn from './FuzzyTextFilterFn'
import styled from 'styled-components'
import EditableCell from '../components/EditableCell'
import DynamicCell from './DynamicCell'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

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

  .batch_row: hover {
    background-color: grey;
    color: white;
    cursor: pointer;
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

const BatchTable = ({columns, data, rowClicked, setRowClicked, fetchData, loading, pageCount: controlledPageCount }) => {

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
    Filter: DefaultColumnFilter,
    EditCell : EditableCell,
  }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    toggleAllRowsExpanded,
    //column order
    visibleColumns,
    setColumnOrder,
    //pagination
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
        pageIndex: 0,
        columnOrder: JSON.parse(localStorage.getItem('columnOrder'))
        },  
      columns,
      data,
      defaultColumn,
      filterTypes,
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useExpanded,
    useFilters,
    usePagination,
    useColumnOrder,
  )

  let moveColumnRight = (column) => {
    let currentIndex = visibleColumns.indexOf(column, 0)
    visibleColumns[currentIndex] = visibleColumns.splice(currentIndex + 1, 1, visibleColumns[currentIndex])[0]
    localStorage.setItem('columnOrder', JSON.stringify(visibleColumns.map(d => d.id)))
    setColumnOrder(visibleColumns.map(d => d.id))
  }

  let moveColumnLeft = (column) => {
    let currentIndex = visibleColumns.indexOf(column, 0)
    visibleColumns[currentIndex] = visibleColumns.splice(currentIndex - 1, 1, visibleColumns[currentIndex])[0]
    localStorage.setItem('columnOrder', JSON.stringify(visibleColumns.map(d => d.id)))
    setColumnOrder(visibleColumns.map(d => d.id))
  }

  let expandRow = (row) => {
    if (row.isExpanded) {
      row.toggleRowExpanded()
    } else {
      toggleAllRowsExpanded(false)
      row.toggleRowExpanded()
    }
  }

  let handleRowClicked = (i) => {
    if (i !== rowClicked) {
      setRowClicked(i)
    } else {
      setRowClicked(null)
    }
  }

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
                    <div>
                      {visibleColumns.indexOf(column) !== 0 && <button onClick={() => moveColumnLeft(column)}>left</button> }
                      {visibleColumns.indexOf(column) !== visibleColumns.length - 1 && <button onClick={() => moveColumnRight(column)}>right</button>}
                    </div>
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
                <React.Fragment key={row.id}>
                  <tr className='batch_row' {...row.getRowProps()} style={{backgroundColor: i === rowClicked ? "grey" : ""}}
                    onClick={() => { handleRowClicked(i); expandRow(row); }}>
                    {row.cells.map(cell => {
                      return (
                        <DynamicCell 
                          key={cell.column.Header} 
                          cell={cell}
                        />
                      )
                    })}
                  </tr>

                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      <Row>
                      <Button>Delete</Button>
                      <Button>View Details</Button>
               
                      </Row>
                    </td>
                  </tr>
                ) : null}
                </React.Fragment>
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