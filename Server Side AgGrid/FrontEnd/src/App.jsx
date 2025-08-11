import { useCallback, useState, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import IconButton from "@mui/material/IconButton";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Button } from "@mui/material";
import { Form, Input, Modal } from "antd";
import toast from "react-hot-toast";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const gridRef = useRef();
  const [form] = Form.useForm();

  const handleDelete = async (delId) => {
    try {
      const res = await axios.delete("http://localhost:4000/api/del-user", {
        data: { id: delId },
      });
      const { success, message } = res?.data;
      if (success) {
        toast.success(message);
      }
    } catch (error) {
      console.error("Error in delete user : ", error?.response?.data?.message);
      toast.error("Error in delete user : ", error?.response?.data?.message);
    }
  };

  const columnDefs = [
    { field: "id", flex: 1 },
    { field: "name", flex: 1, filter: "agTextColumnFilter" },
    {
      field: "age",
      flex: 1,
      filter: "agNumberColumnFilter",
      // rowGroup: true,
      // hide: false,
    },
    { field: "email", flex: 1 },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                setIsEdit(true);
                setModalOpen(true);
                form.setFieldsValue({
                  id: params.data.id,
                  name: params.data.name,
                  age: params.data.age,
                  email: params.data.email,
                });
              }}
            >
              <EditTwoToneIcon color="success" />
            </IconButton>
            <IconButton onClick={() => handleDelete(params?.data?.id)}>
              <DeleteTwoToneIcon color="error" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const datasource = {
    getRows: async (params) => {
      const {
        startRow,
        endRow,
        sortModel,
        filterModel,
        // rowGroupCols,
        // groupKeys,
      } = params.request;
      const sortField = sortModel[0]?.colId;
      const sortOrder = sortModel[0]?.sort;

      try {
        const response = await axios.get("http://localhost:4000/api/users", {
          params: {
            startRow,
            endRow,
            sortField,
            sortOrder,
            filterModel: JSON.stringify(filterModel),
            // rowGroupCols: JSON.stringify(rowGroupCols),
            // groupKeys: JSON.stringify(groupKeys)
          },
        });

        const { data } = response;
        await params.success({
          rowData: data?.data,
          rowCount: data?.totalCount,
        });
        if (data?.success) {
          toast.success(data?.message);
        }
      } catch (error) {
        console.error("Error loading rows:", error);
        // params.failCallback();
        toast.error(error?.response?.data?.message);
      }
    },
  };

  const onGridReady = useCallback((params) => {
    if (params?.api) {
      gridRef.current = params.api;
      params.api.setGridOption("serverSideDatasource", datasource);
    }
  }, []);

  const handleModalCancel = () => {
    form.resetFields();
    setIsEdit(false);
    setModalOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const userData = {
        ...values,
        id: Number(values?.id),
        age: Number(values?.age),
      };
      try {
        const res = await axios.post(
          "http://localhost:4000/api/add-user",
          userData
        );
        const { success, message } = res?.data;
        if (success) {
          toast.success(message);
          form.resetFields();
          handleModalCancel();
        }
      } catch (error) {
        console.error("Error adding user:", error?.response?.data?.message);
        toast.error("Error adding user:", error?.response?.data?.message);
      }
    });
  };

  const handleUpdateUser = () => {
    form.validateFields().then(async (values) => {
      const userData = {
        ...values,
        id: Number(values?.id),
        age: Number(values?.age),
      };
      try {
        const res = await axios.put(
          "http://localhost:4000/api/update-user",
          userData
        );
        const { success, message } = res?.data;
        if (success) {
          toast.success(message);
          form.resetFields();
          handleModalCancel();
          setIsEdit(false);
        }
      } catch (error) {
        console.error("Error updating user:", error?.response?.data?.message);
        toast.error("Error updating user:", error?.response?.data?.message);
      }
    });
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center flex-col gap-2 justify-center">
      <div className="flex justify-end w-[90%]">
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add+
        </Button>
      </div>
      <Modal
        onOk={isEdit ? handleUpdateUser : handleSubmit}
        onCancel={handleModalCancel}
        okText={isEdit ? "Update" : "Add"}
        cancelText="Cancel"
        open={modalOpen}
      >
        <Form
          layout="vertical"
          labelCol={{ style: { marginBottom: "1px", paddingBottom: "1px" } }}
          form={form}
          style={{ width: "80%", margin: "1px auto" }}
        >
          <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: "Please Enter Id.." }]}
            style={{ marginBottom: "3px" }}
          >
            <Input type="number" disabled={isEdit} />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please Enter Name.." }]}
            style={{ marginBottom: "3px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please Enter Email.." }]}
            style={{ marginBottom: "3px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please Enter Age.." }]}
            style={{ marginBottom: "3px" }}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="w-[90%] h-[80%]">
        <AgGridReact
          columnDefs={columnDefs}
          rowModelType={"serverSide"}
          pagination={true}
          paginationPageSize={50}
          onGridReady={onGridReady}
          defaultColDef={{ sortable: true, resizable: true }}
          cacheBlockSize={50}
          getRowId={(params)=>String(params?.data?.id)}
          // serverSideDatasource={datasource}
        />
      </div>
    </div>
  );
};

export default App;
