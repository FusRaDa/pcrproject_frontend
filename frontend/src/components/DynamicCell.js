import React, { useState } from "react"

const DynamicCell = ({ cell, toggleAllRowsExpanded, setEditRow }) => {
  let [isEdit, setIsEdit] = useState(false)

  let notEditable = () => {
    //these column cannot be edited
    if (cell.column.id === 'assay.name' || cell.column.id === 'assay.code' || cell.column.id === 'batchDate' || cell.value === null) {
      alert('cannot change this cell')
    } else {
      setIsEdit(true)
      toggleAllRowsExpanded(false)
      setEditRow(true)
    }
  }

  let handleKeyDown = e => {
    if (e.key === 'Enter') {
      setIsEdit(false)
    }
  }

  return (
    <td {...cell.getCellProps()} onDoubleClick={() => notEditable()} onKeyDown={handleKeyDown} onMouseLeave={() => {setIsEdit(false); setEditRow(false)}}>
      {isEdit ? cell.render('EditCell', {setIsEdit}) : cell.render('Cell')}
    </td>
  )
}

export default DynamicCell