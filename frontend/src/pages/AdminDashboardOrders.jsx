import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import jsPDF autotable
import { Button } from "@mui/material"; // Import Button for generating PDF

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Orders Report", 14, 16);

    // Prepare data for the table
    const orderData = adminOrders.map((item) => ({
      id: item._id,
      itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
      total: item.totalPrice,
      status: item.status,
      createdAt: item.createdAt.slice(0, 10),
    }));

    // Create a table in the PDF
    doc.autoTable({
      head: [["Order ID", "Items Qty", "Total", "Status", "Order Date"]],
      body: orderData.map((order) => [
        order.id,
        order.itemsQty,
        order.total + " $",
        order.status,
        order.createdAt,
      ]),
      startY: 20, // Starting Y position for the table
    });

    // Save the PDF
    doc.save("admin_orders_report.pdf");
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        const status = params.value; // Access status directly
        return status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: item.totalPrice + " $",
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex flex-col justify-between">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
              {/* Button to generate PDF positioned at the bottom right */}
              <Button
                variant="contained"
                color="primary"
                onClick={generatePDF}
                style={{
                  marginTop: "20px",
                  alignSelf: "flex-end", // Align to the right
                  padding: "5px 10px", // Smaller padding
                }}
              >
                Generate PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
