import React from "react";
import AgGridTable from "./AgGridTable";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <AgGridTable />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#222",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      />
    </div>
  );
};

export default App;
