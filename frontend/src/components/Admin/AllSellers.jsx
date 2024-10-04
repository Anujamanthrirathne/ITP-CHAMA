import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button, TextField } from "@mui/material"; // Import TextField for search
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  const handleDownloadPDF = (seller) => {
    const doc = new jsPDF();
  
    // Add custom title and basic seller details
    doc.setFontSize(22);
    doc.text("Seller Report", 14, 20);
  
    doc.setFontSize(14);
    doc.text(`Seller Name: ${seller.name}`, 14, 40);
    doc.text(`Email: ${seller.email}`, 14, 50);
    doc.text(`Address: ${seller.address || "N/A"}`, 14, 60);
    doc.text(`Joined At: ${seller.joinedAt}`, 14, 70);
  
    // Add a styled table for additional seller details (if any)
    doc.autoTable({
      startY: 80,
      head: [["Field", "Details"]],
      body: [
        ["Name", seller.name],
        ["Email", seller.email],
        ["Address", seller.address || "N/A"],
        ["Joined At", seller.joinedAt],
        // Add more rows if needed
      ],
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },  // Custom header color
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
  
    // Footer or additional notes section
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);
  
    // Save the PDF with a clean filename
    doc.save(`seller_report_${seller.name}.pdf`);
  };
  
  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 130, flex: 0.7 },
    { field: "email", headerName: "Email", minWidth: 130, flex: 0.7 },
    { field: "address", headerName: "Seller Address", minWidth: 130, flex: 0.7 },
    { field: "joinedAt", headerName: "Joined At", minWidth: 130, flex: 0.8 },
    {
      field: "previewShop",
      headerName: "Preview Shop",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/preview/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "downloadPDF",
      headerName: "Download PDF",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDownloadPDF(params.row)}>
          Download PDF
        </Button>
      ),
    },
    {
      field: "deleteSeller",
      headerName: "Delete Seller",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  // Filter sellers based on search query
  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare row data for the DataGrid
  const rows = filteredSellers.map((item) => ({
    id: item._id,
    name: item?.name,
    email: item?.email,
    joinedAt: item.createdAt.slice(0, 10),
    address: item.address,
  }));

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Seller Details</h3>

        {/* Search Bar */}
        <div className="mb-4">
          <TextField
            label="Search Seller"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full min-h-[45vh] bg-white rounded">
          {/* DataGrid table */}
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>

        {/* Delete confirmation modal */}
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this seller?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
