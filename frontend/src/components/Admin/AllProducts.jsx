import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { server } from "../../server";

const AllProducts = () => {
  const [data, setData] = useState([]);

  // Fetch product data on component mount
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  // Define table columns
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  // Prepare row data for the DataGrid
  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  // PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("All Products Report", 14, 16);

    // Prepare the data for the table in PDF
    const tableColumn = ["Product Id", "Name", "Price", "Stock", "Sold"];
    const tableRows = [];

    data.forEach((item) => {
      const productData = [
        item._id,
        item.name,
        "US$ " + item.discountPrice,
        item.stock,
        item.sold_out,
      ];
      tableRows.push(productData);
    });

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
    });

    // Save the PDF locally
    doc.save("all_products_report.pdf");
  };

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        {/* DataGrid displaying product data */}
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />

        {/* Button to generate PDF */}
        <div className="flex justify-end mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
          >
            Generate PDF Report
          </Button>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
