import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'

const App = () => {
  const [rowData,setRowData] = useState([
    {
      name:"Thatshinamoorthy R",
      Dept:"IT",
      year:1,
    },
    {
      name:"Velmurugan M",
      Dept:"IT",
      year:3,
    },
    {
      name:"Sabinesh V",
      Dept:"IT",
      year:3,
    },
    {
      name:"Balamurugan R",
      Dept:"IT",
      year:2,
    }
  ])
  const [colDef,setColDef] = useState([
    {
      field:"name",
      filter:"agTextColumnFilter"
    },
    {
      field:"Dept",
      filter:"agTextColumnFilter"
    },
    {
      field:"year",
      filter:"agNumberColumnFilter"
    },
  ])
  return (
    <div className='h-[100vh] w-[100vw]'>
      <AgGridReact rowData={rowData} columnDefs={colDef}/>
    </div>
  )
}

export default App
