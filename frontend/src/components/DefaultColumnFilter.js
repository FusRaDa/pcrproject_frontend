import { useState } from "react"

const DefaultColumnFilter = ({column: { filterValue, preFilteredRows, setFilter }}) => {
  const count = preFilteredRows.length

  let [isSearch, setIsSearch] = useState(false)

  return (
    <div>
    <button onClick={() => setIsSearch(!isSearch)}>{!isSearch ? 'S' : 'Collapse'}</button>
    {isSearch && <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />}
    </div>
  )
}

export default DefaultColumnFilter