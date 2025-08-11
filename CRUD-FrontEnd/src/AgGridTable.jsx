import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import data from "./Data/data.js";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Modal, Popconfirm } from "antd";
import toast from "react-hot-toast";

const AgGridTable = () => {
  const gridRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    std: "",
    gender: "",
    attendance: "",
    club: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = (delId) => {
    setRowData((prev) => {
      const newPrev = [...prev];
      newPrev.splice(delId, 1);
      return newPrev;
    });
    toast.success("Data Deleted Successfully..!")
  };
  const [rowData, setRowData] = useState(data);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Student ID", field: "student_id", width: 150 },
    { headerName: "Name", field: "name", width: 200 },
    { headerName: "Standard", field: "std", width: 100 },
    { headerName: "Gender", field: "gender", width: 200 },
    { headerName: "Attendance %", field: "attendance_percentage", width: 130 },
    { headerName: "Club", field: "club", width: 150 },
    {
      headerName: "Actions",
      width: 150,
      cellRenderer: (params) => {
        return (
          <div className="w-full flex justify-around">
            <IconButton
              onClick={() => {
                setFormData({
                  id: params.data.student_id || "",
                  name: params.data.name || "",
                  std: params.data.std || "",
                  gender: params.data.gender || "",
                  attendance: params.data.attendance_percentage || "",
                  club: params.data.club || "",
                });
                setIsEdit(true);
                setEditIndex(params?.node?.rowIndex || -1);
                setIsModalOpen(true);
              }}
            >
              <ModeEditOutlineIcon color="success" />
            </IconButton>
            <Popconfirm
              title="Confirm to Delete the data"
              okText="confirm"
              cancelText="cancel"
              onConfirm={() => handleDelete(params?.node?.rowIndex || null)}
            >
              <IconButton>
                <DeleteRoundedIcon color="error" />
              </IconButton>
            </Popconfirm>
          </div>
        );
      },
    },
  ]);
  const handleCancel = () => {
    setFormData({
      id: "",
      name: "",
      std: "",
      gender: "",
      attendance: "",
      club: "",
    });
    setIsModalOpen(false);
  };
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleAddStu = () => {
    if (
      !formData?.attendance ||
      !formData?.club ||
      !formData?.gender ||
      !formData?.id ||
      !formData?.name ||
      !formData?.std
    ) {
      alert("please Enter all field..!");
      return;
    }
    const modData = {
      student_id: formData?.id || "",
      name: formData?.name || "",
      std: formData?.std || "",
      gender: formData?.gender || "",
      attendance_percentage: Number(formData?.attendance) || "",
      club: formData?.club || "",
    };
    setRowData((prev) => {
      return [...prev, modData];
    });
    setFormData({
      id: "",
      name: "",
      std: "",
      gender: "",
      attendance: "",
      club: "",
    });
    handleCancel();
    setIsEdit(false);
    toast.success("Data Added Successfully..!");
  };

  const handleUpdateStu = () => {
    if (
      !formData?.attendance ||
      !formData?.club ||
      !formData?.gender ||
      !formData?.id ||
      !formData?.name ||
      !formData?.std
    ) {
      alert("please Enter all field..!");
      return;
    }
    const modData = {
      student_id: formData?.id || "",
      name: formData?.name || "",
      std: formData?.std || "",
      gender: formData?.gender || "",
      attendance_percentage: Number(formData?.attendance) || "",
      club: formData?.club || "",
    };
    setRowData((prev) => {
      const newPrev = [...prev];
      newPrev.splice(editIndex, 1, modData);
      return newPrev;
    });
    setFormData({
      id: "",
      name: "",
      std: "",
      gender: "",
      attendance: "",
      club: "",
    });
    handleCancel();
    setIsEdit(false);
    toast.success("Data Updated Successfully..!");
  };
  const handleQuickFilter = () => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("quick-filter").value
    );
  };

  return (
    <div className="min-h-[100vh] flex flex-col justify-evenly items-center pb-3">
      <div className="w-[85vw] flex justify-end">
        <Button
          variant="contained"
          style={{ backgroundColor: "#028fed" }}
          onClick={() => {
            setIsEdit(false);
            setEditIndex(-1);
            setFormData({
              id: "",
              name: "",
              std: "",
              gender: "",
              attendance: "",
              club: "",
            });
            setIsModalOpen(true);
          }}
        >
          Add+
        </Button>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        title="Add student Details"
        okText={isEdit ? "Update" : "Submit"}
        onOk={isEdit ? handleUpdateStu : handleAddStu}
      >
        <div className="flex justify-center">
          <form action="" className="w-[90%] flex flex-col p-1 mt-1 gap-2.5">
            <TextField
              variant="outlined"
              label="Student ID"
              type="number"
              onChange={handleInput}
              value={formData?.id}
              name="id"
            />
            <TextField
              variant="outlined"
              label="Name"
              type="text"
              onChange={handleInput}
              value={formData?.name}
              name="name"
            />
            <TextField
              variant="outlined"
              label="Standard"
              type="number"
              onChange={handleInput}
              value={formData?.std}
              name="std"
            />
            <FormControl fullWidth>
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender"
                id="gender"
                label="Gender"
                onChange={handleInput}
                value={formData?.gender}
                name="gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              label="Attendance Percentage"
              type="number"
              onChange={handleInput}
              value={formData?.attendance}
              name="attendance"
            />
            <TextField
              variant="outlined"
              label="Club"
              type="text"
              onChange={handleInput}
              value={formData?.club}
              name="club"
            />
          </form>
        </div>
      </Modal>
      <div className="w-[85vw] h-[80vh]">
        <div className="flex gap-2">
          <span>Quick Filter:</span>
          <input
            type="text"
            className="border h-8 rounded-sm px-1"
            id="quick-filter"
            onInput={handleQuickFilter}
          />
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          ref={gridRef}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
    </div>
  );
};

export default AgGridTable;
