import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef, useState } from "react";
// import data from './Data/data'
import SubTable from "./SubTable";
import {
  getStudentsData,
  addStudentsData,
  deleteStudentData,
  updateStudentData,
} from "./API/stuAPI";
import { Button, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Form, Input, Modal, Popconfirm, Select } from "antd";
import toast from "react-hot-toast";

const AgGridCRUD = () => {
  const [form] = Form.useForm();
  const [openModel, setModalOpen] = useState(false);
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const fetchData = async () => {
    const res = await getStudentsData();
    const { data } = res;
    setRowData(data);
  };
  const handleModalCancel = () => {
    setModalOpen(false);
  };
  const updateStudentDetail = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newData = {
          ...values,
          attendance_percentage: Number(values?.attendance_percentage),
        };
        if (gridRef?.current?.applyTransaction) {
          gridRef.current.applyTransaction({
            update: [newData],
          });
        }
        form.resetFields();
        setIsEdit(false);
        setModalOpen(false);
        const res = await updateStudentData(values);
        const { error, message } = res;
        if (message) {
          toast.success(message);
        } else {
          toast.error(error);
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Please Fill all Field");
        }
      });
  };
  const addStudentDetail = () => {
    let flag = true;
    form
      .validateFields()
      .then(async (values) => {
        if (gridRef?.current?.forEachNode && values) {
          gridRef.current.forEachNode((val) => {
            if (val?.data?.student_id === values.student_id) {
              flag = false;
            }
          });
        }
        if (!flag) {
          toast.error("Student Exist with same Student ID");
          return;
        }
        const newData = {
          ...values,
          attendance_percentage: Number(values?.attendance_percentage),
        };
        if (gridRef?.current?.applyTransaction) {
          gridRef.current.applyTransaction({
            add: [newData],
          });
        }
        form.resetFields();
        setModalOpen(false);
        const res = await addStudentsData(values);
        const { error, message } = res;
        if (message) {
          toast.success(message);
        } else {
          toast.error(error);
        }
      })
      .catch((err) => {
        if (err) toast.error("Please Fill all Data");
      });
  };
  const deleteStudentDetail = async (delId) => {
    if (gridRef?.current?.applyTransaction) {
      gridRef.current.applyTransaction({
        remove: [{ student_id: delId }],
      });
    }
    const res = await deleteStudentData(delId);
    const { error, message } = res;
    if (message) {
      toast.success(message);
    } else {
      toast.error(error);
    }
  };
  const colDef = [
    {
      headerName: "S.No",
      width: "100",
      cellRenderer: "agGroupCellRenderer",
      valueGetter: (params) => params?.node?.rowIndex + 1,
    },
    {
      headerName: "Student ID",
      field: "student_id",
      flex: 1,
      valueGetter: (params) => params?.data?.student_id,
    },
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Standard", field: "std", flex: 1 },
    { headerName: "Gender", field: "gender", flex: 1 },
    { headerName: "Attendance%", field: "attendance_percentage", flex: 1 },
    { headerName: "Club", field: "club", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                setIsEdit(true);
                setModalOpen(true);
                form.setFieldsValue(params?.data);
              }}
            >
              <EditOutlinedIcon color="success" />
            </IconButton>
            <Popconfirm
              title="Confirm to Delete Student Data"
              okText="Confirm"
              onConfirm={() => deleteStudentDetail(params?.data?.student_id)}
            >
              <IconButton>
                <DeleteOutlineOutlinedIcon color="error" />
              </IconButton>
            </Popconfirm>
          </div>
        );
      },
      flex: 1,
    },
  ];
  const handleQuickFilter = ()=>{
    if(gridRef?.current?.setGridOption){
        gridRef.current.setGridOption("quickFilterText",document.getElementById('quickFilter').value)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex justify-center items-center h-[100vh] w-[100vw] bg-blue-900">
      <div className="h-[80vh] w-[80vw] bg-blue-100 rounded-md p-2 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <span className="flex items-center">Quick Filter:</span>
            <span className="flex items-center">
              <Input onInput={handleQuickFilter} id="quickFilter"/>
            </span>
          </div>
          <div>
            <Button
              variant="contained"
              style={{ backgroundColor: "#0456d9" }}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Add+
            </Button>
          </div>
        </div>
        <Modal
          title="Student Form"
          open={openModel}
          onOk={isEdit ? updateStudentDetail : addStudentDetail}
          onCancel={handleModalCancel}
          okText={isEdit ? "Update" : "Submit"}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Student ID"
              name="student_id"
              rules={[{ required: true, message: "Please Enter Student ID" }]}
            >
              <Input disabled={isEdit} />
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
              <Input />
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
              label="Attendance%"
              name="attendance_percentage"
              rules={[{ required: true, message: "Please Enter Attendance %" }]}
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
        <div className="w-full h-full">
          <AgGridReact
            onGridReady={(params) => {
              gridRef.current = params?.api;
            }}
            rowData={rowData}
            columnDefs={colDef}
            pagination={true}
            paginationAutoPageSize={true}
            cellSelection={true}
            enableCharts={true}
            masterDetail={true}
            detailCellRenderer={(params) => <SubTable prop={params?.data} />}
            // groupDefaultExpanded={true} //open all master detail on first grid load
            getRowId={(params) => String(params?.data?.student_id)}
          />
        </div>
      </div>
    </div>
  );
};

export default AgGridCRUD;