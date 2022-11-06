import { matchSorter } from "match-sorter"

const FuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys : [row => row.values[id]]})
}

export default FuzzyTextFilterFn