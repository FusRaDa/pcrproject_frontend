import React, { useState } from "react";

const DynamicCell = ({ cell }) => {
  let [isEdit, setIsEdit] = useState(false)

  let notEditable = () => {
    //these column cannot be edited
    if (cell.column.id === 'assay.name' || cell.column.id === 'assay.code' || cell.value === null) {
      alert('cannot change this cell')
    } else {
      setIsEdit(true)
    }
  }

  let handleKeyDown = e => {
    if (e.key === 'Enter') {
      setIsEdit(false)
    }
  }

  return (
    <td {...cell.getCellProps()} onDoubleClick={() => notEditable()} onKeyDown={handleKeyDown}>
      {isEdit ? cell.render('EditCell') : cell.render('Cell')}
    </td>
  )
}

export default DynamicCell