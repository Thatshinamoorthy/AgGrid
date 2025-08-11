import { AgGridReact } from "ag-grid-react"
import data from "./Data/data"

const SubTable = ({prop}) => {
    const colDefs = [
        {headerName:"S.No",width:100,
      cellRenderer:"agGroupCellRenderer",
      valueGetter:params=>params?.node?.rowIndex+1
    },
    {headerName:"Student ID",field:"student_id",flex:1},
    {headerName:"Name",field:"name",flex:1},
    {headerName:"Standard",field:"std",flex:1},
    ]
  return (
    <div className="w-full h-full">
      <AgGridReact rowData={[prop]} columnDefs={colDefs}/>
    </div>
  )
}

export default SubTable