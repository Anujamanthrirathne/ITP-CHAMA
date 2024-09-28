import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  // Function to delete a seller
  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  // Function to download a PDF for each seller
  const handleDownloadPDF = (seller) => {
    const doc = new jsPDF();

    // Add seller details to the PDF
    doc.text(`Seller Report`, 10, 10);
    doc.text(`Seller ID: ${seller.id}`, 10, 20);
    doc.text(`Name: ${seller.name}`, 10, 30);
    doc.text(`Email: ${seller.email}`, 10, 40);
    doc.text(`Address: ${seller.address}`, 10, 50);
    doc.text(`Joined At: ${seller.joinedAt}`, 10, 60);

    // Save the PDF
    doc.save(`seller_report_${seller.name}.pdf`);
  };

  // Define table columns with a button to download individual seller PDF
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

  // Prepare row data for the DataGrid
  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Employee Details</h3>

        <div className="w-full min-h-[45vh] bg-white rounded">
          {/* The table displaying seller data */}
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>

        {/* Confirmation modal for deleting a seller */}
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
