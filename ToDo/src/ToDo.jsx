import { Button, IconButton } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { Input, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const ToDo = () => {
  const gridRef = useRef(null);
  const [selNode, setSelNode] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [rowData, setRowData] = useState([
    { todo: "Complete task", completed: false },
    { todo: "Complete task quickly", completed: false },
  ]);

  const handleDelete = (delId) => {
    setRowData((prev) => {
      const newData = [...prev];
      newData.splice(delId, 1);
      return newData;
    });
  };

  const handleAddToDo = () => {
    if (!inputVal) {
      alert("Please enter a task!");
      return;
    }
    setRowData((prev) => [...prev, { todo: inputVal, completed: false }]);
    setInputVal("");
  };

  const handleRowSelection = () => {
    if (gridRef.current) {
      const selectedNodes = gridRef.current.getSelectedNodes();
      setSelNode(selectedNodes);
    }
  };

  const handleBulkDelete = () => {
    const selectedIndexes = selNode.map((node) => node.rowIndex);
    setRowData((prev) =>
      prev.filter((_, index) => !selectedIndexes.includes(index))
    );
    setSelNode([]);
  };

  const handleMarkComplete = () => {
    const selectedIndexes = selNode.map((node) => node.rowIndex);
    setRowData((prev) =>
      prev.map((item, index) =>
        selectedIndexes.includes(index) ? { ...item, completed: true } : item
      )
    );
    setSelNode([]);
  };

  const [colDef, setColDef] = useState([
    {
      headerName: "S.No",
      width:"100",
      cellRenderer: (params) => {
        const sno = params?.node?.rowIndex || "";
        return <div>{sno + 1}</div>;
      },
    },
    {
      headerName: "ToDo",
      field: "todo",
      width:"370",
      cellRenderer: (params) => {
        const isCompleted = params?.data?.completed;
        return (
          <span className={isCompleted ? "line-through text-gray-500" : "none"}>
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "Completed",
      cellRenderer: (params) => {
        const handleCheckboxChange = () => {
          setRowData((prev) => {
            const newData = prev.map((item, index) => {
              if (index === params.node.rowIndex) {
                return { ...item, completed: !item.completed };
              }
              return item;
            });
            return newData;
          });
        };

        return (
          <div className="flex justify-center items-center w-full h-full">
            <input
              type="checkbox"
              checked={params.data?.completed || false}
              onChange={handleCheckboxChange}
              className="w-6 h-6"
            />
          </div>
        );
      },
    },
    {
      headerName: "Action",
      cellRenderer: (params) => {
        return (
          <div>
            <Popconfirm
              title="Confirm to delete Todo"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(params?.node?.rowIndex || "")}
            >
              <IconButton>
                <DeleteOutlineOutlinedIcon color="error" />
              </IconButton>
            </Popconfirm>
          </div>
        );
      },
    },
  ]);

  return (
    <div className="min-h-[100vh] bg-blue-900 flex justify-center items-center">
      <div className="flex flex-col w-[70vw] h-[80vh] bg-blue-100 p-2 rounded-md gap-2">
        <div
          className={
            selNode.length > 0 ? "flex justify-between" : "flex justify-end"
          }
        >
          {selNode.length > 0 && (
            <div className="w-[40%] flex gap-3">
              <Button
                variant="contained"
                size="small"
                onClick={handleBulkDelete}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleMarkComplete}
              >
                Complete
              </Button>
            </div>
          )}
          <div className="flex gap-2 justify-end w-[60%]">
            <Input
              size="large"
              placeholder="Enter ToDo.."
              style={{ width: "50%" }}
              value={inputVal}
              onChange={(e) => setInputVal(e?.target?.value)}
            />
            <Button variant="contained" onClick={handleAddToDo}>
              Add+
            </Button>
          </div>
        </div>
        <div className="w-full h-full ag-theme-alpine">
          <AgGridReact
            onGridReady={(params) => {
              gridRef.current = params?.api || null;
            }}
            rowData={rowData}
            columnDefs={colDef}
            pagination={true}
            paginationAutoPageSize={true}
            rowSelection="multiple"
            onSelectionChanged={handleRowSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default ToDo;
