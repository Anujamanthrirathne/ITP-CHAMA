import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@mui/x-data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState('Processing');

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "Status",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Request Given At",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <BsPencil
          size={20}
          className={`${params.row.status !== "Processing" ? 'hidden' : ''} mr-5 cursor-pointer`}
          onClick={() => setOpen(true) || setWithdrawData(params.row)}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`, {
        sellerId: withdrawData.shopId,
      }, { withCredentials: true })
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const row = [];

  data && data.forEach((item) => {
    row.push({
      id: item._id,
      shopId: item.seller._id,
      name: item.seller.name,
      amount: "US$ " + item.amount,
      status: item.status,
      createdAt: item.createdAt.slice(0, 10),
    });
  });

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add Title
    doc.setFontSize(20);
    doc.text("Withdraw Requests Report", 14, 22);
  
    // Extract meaningful data for the PDF, excluding unnecessary fields like MongoDB ids
    const pdfData = row.map((item) => ({
      "Shop Name": item.name,
      "Amount": item.amount,
      "Status": item.status,
      "Request Given At": item.createdAt,
    }));
  
    // Use jsPDF autoTable to create a well-formatted table
    autoTable(doc, {
      head: [["Shop Name", "Amount", "Status", "Request Given At"]], // New column headers
      body: pdfData.map((item) => [
        item["Shop Name"],
        item["Amount"],
        item["Status"],
        item["Request Given At"],
      ]),
      startY: 30, // To ensure the table is placed below the title
      theme: "grid", // Optional: gives the table a clean grid look
      styles: {
        fontSize: 10, // Optional: adjust to fit the page better
      },
      headStyles: {
        fillColor: [41, 128, 185], // Optional: customize table header color (blue in this case)
        textColor: [255, 255, 255], // Header text in white
      },
      margin: { top: 10 },
    });
  
    // Save the generated PDF with a proper filename
    doc.save("Withdraw_Requests_Report.pdf");
  };
  

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Generate PDF
        </button>
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw Status
            </h1>
            <br />
            <select
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value="Succeed">Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
