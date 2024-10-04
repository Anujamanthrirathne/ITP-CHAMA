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
        console.log(res.data.products); // Log the products to check the structure
        setData(res.data.products);
      })
      .catch((err) => console.error("Error fetching products:", err));
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
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "sellerName",
      headerName: "Seller Name",
      minWidth: 180,
      flex: 1.5,
    },
  ];

  // Prepare row data for the DataGrid
  const row = data.map((item) => ({
    id: item._id,
    name: item.name,
    price: "US$ " + item.discountPrice.toFixed(2),
    Stock: item.stock,
    sold: item.sold_out,
    sellerName: item.shop?.name || "Unknown Seller", // Accessing the shop's name
  }));

  const generatePDF = () => {
    const doc = new jsPDF("portrait", "pt", "A4");

    // Add a title with styling
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("All Products Report", 40, 40);

    // Add a subtitle or date
    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${date}`, 40, 60);

    // Define the column headers for the table
    const tableColumn = ["#", "Category", "Product Name", "Price", "Stock", "Sold", "Seller Name"];
    const tableRows = [];

    // Loop through the data and prepare rows
    data.forEach((item, index) => {
      const productData = [
        index + 1,
        item.category || "Unknown Category",
        item.name,
        "US$ " + item.discountPrice.toFixed(2),
        item.stock,
        item.sold_out,
        item.shop?.name || "Unknown Seller", // Accessing the shop's name for PDF
      ];
      tableRows.push(productData);
    });

    // Add the table to the PDF with enhanced styling
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10, cellPadding: 8 },
      alternateRowStyles: { fillColor: [239, 248, 255] },
      margin: { top: 80 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 30);
      },
    });

    // Save the PDF locally
    doc.save("advanced_products_report.pdf");
  };

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />

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
  );
};

export default AllProducts;
