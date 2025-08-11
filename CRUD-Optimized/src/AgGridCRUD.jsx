import { AgGridReact } from "ag-grid-react";
import React, { useRef, useState } from "react";
import data from "./Data/data";
import { Button, IconButton } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Form, Input, Modal, Select } from "antd";

const AgGridCRUD = () => {
  const [form] = Form.useForm();
  const gridRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const handleCancelModal = () => {
    setOpen(false);
  };
  const handleAddData = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const newData = {
        ...values,
        attendance_percentage: Number(values?.attendance_percentage || 0),
      };
      console.log(newData);
      if (gridRef?.current?.applyTransaction) {
        gridRef.current.applyTransaction({ add: [newData] });
      }
      form.resetFields();
      handleCancelModal();
    });
  };
  const handleEditData = () => {
    form.validateFields().then((values) => {
      const newData = {
        ...values,
        attendance_percentage: Number(values?.attendance_percentage || null)
      };
      if (gridRef?.current?.applyTransaction) {
        gridRef.current.applyTransaction({
          update: [newData],
        });
      }
      setIsEdit(false);
      handleCancelModal();
      form.resetFields();
    });
  };
  const handleDeleteNode = (val) => {
    if (gridRef?.current?.applyTransaction) {
      gridRef.current.applyTransaction({
        remove: [val],
      });
    }
  };
  const [rowData, setRowData] = useState(data);
  const [colDef, setColDef] = useState([
    { headerName: "Student ID", field: "student_id", width: 100 },
    { headerName: "Name", field: "name", width: 200 },
    { headerName: "Standard", field: "std", width: 100 },
    { headerName: "Gender", field: "gender", width: 200 },
    { headerName: "Attendance %", field: "attendance_percentage", width: 130 },
    { headerName: "Club", field: "club", width: 150 },
    {
      headerName: "Actions",
      width: 120,
      cellRenderer: (params) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                setOpen(true);
                setIsEdit(true);
                form.setFieldsValue(params.data);
              }}
            >
              <ModeEditOutlineIcon color="success" />
            </IconButton>
            <IconButton onClick={() => handleDeleteNode(params?.data || {})}>
              <DeleteRoundedIcon color="error" />
            </IconButton>
          </div>
        );
      },
    },
  ]);
  return (
    <div className="min-h-[100vh] bg-blue-900 flex justify-center items-center">
      <div className="w-[80vw] h-[80vh] bg-blue-100 rounded-md p-2 flex flex-col gap-2">
        <div className="flex justify-end-safe">
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
              setIsEdit(false);
              form.resetFields();
            }}
          >
            Add+
          </Button>
        </div>
        <Modal
          title={isEdit ? "Update Student Data" : "Add Student Data"}
          okText={isEdit ? "Update" : "Submit"}
          cancelText="Cancel"
          onCancel={handleCancelModal}
          onOk={isEdit ? handleEditData : handleAddData}
          open={open}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Student ID"
              name="student_id"
              rules={[{ required: true, message: "Please Enter Student ID" }]}
            >
              <Input type="number" disabled={isEdit} />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please Enter Name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Standard"
              name="std"
              rules={[{ required: true, message: "Please Enter Standard" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please Enter Gender" }]}
            >
              <Select
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Others", value: "Others" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Attendance Percentage"
              name="attendance_percentage"
              rules={[{ required: true, message: "Please Enter Attendance%" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Club"
              name="club"
              rules={[{ required: true, message: "Please Enter Club" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <div className="h-[93%] w-[100%]">
          <AgGridReact
            onGridReady={(params) => {
              gridRef.current = params?.api;
            }}
            rowData={rowData}
            columnDefs={colDef}
            pagination={true}
            paginationAutoPageSize={true}
            getRowId={(params) => String(params?.data?.student_id)}
          />
        </div>
      </div>
    </div>
  );
};

export default AgGridCRUD;
