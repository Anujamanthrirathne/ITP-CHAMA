import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent, getAllEventsShop,} from '../../redux/actions/event';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../../components/Shop/Layout/Loader';

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id))
     window.location.reload()
      
  };

  const columns = [
    { field: 'id', headerName: 'Product Id', minWidth: 150, flex: 0.7 },
    { field: 'name', headerName: 'Name', minWidth: 180, flex: 1.4 },
    { field: 'price', headerName: 'Price', minWidth: 100, flex: 0.6 },
    { field: 'stock', headerName: 'Stock', type: 'number', minWidth: 80, flex: 0.5 },
    { field: 'sold', headerName: 'Sold out', type: 'number', minWidth: 130, flex: 0.6 },
    {
      field: 'preview',
      headerName: 'preview',
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, '-');
        return (
          <Link to={`/product/${product_name}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
   
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = events ? events.map((item) => ({
    id: item._id,
    name: item.name,
    price: `US$ ${item.discountPrice}`,
    stock: item.stock,
    sold:   10,      /*item.sold */
  })) : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='w-full mx-8 pt-1 mt-10 bg-white'>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllEvents;
