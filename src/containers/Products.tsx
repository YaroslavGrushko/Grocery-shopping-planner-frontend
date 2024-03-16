import { useEffect, useState } from 'react';

import {
  GridRowsProp,
  GridColDef,
  GridRowModel,
} from '@mui/x-data-grid';


import {useMainContext} from '../context/MainContext'
import { deleteProduct, getProducts, postProduct, putProduct } from '../services/http';
import { Product } from '../types';

import TableCRUD from './TableCRUD'

 const Products = () => {
    const { token, currentCategory} = useMainContext()
    const [rows, setRows] = useState<GridRowsProp>([]);

    const processRowUpdate = async (rowToUpdate: GridRowModel) => {
      let updatedRow ={}
      const productToUpdate = 
          {
              name: rowToUpdate.name,
              quantity: rowToUpdate.quantity,
              price: rowToUpdate.price,
              category: currentCategory.id
          }
      if(rowToUpdate.isNew){
          // create product on backend
          updatedRow = await postProduct(productToUpdate, token)
      }else{
          // update product on backend
          updatedRow = await putProduct(productToUpdate, rowToUpdate.id, token)
      }
      updatedRow = { ...updatedRow, isNew: false };
      setRows(rows.map((row) => (row.id === rowToUpdate.id ? updatedRow : row)));
      return updatedRow;
    };

    const innerColumns: GridColDef[] = [
      { field: 'name', headerName: 'Name', editable: true, flex: 0.7 },
      { field: 'quantity', headerName: 'Quantity', editable: true, flex: 0.1 },
      { field: 'price', headerName: 'Price', editable: true, flex: 0.1 },
    ];

    const useProductsInit = ()=>{
      useEffect(() => {
          if (!currentCategory) return
          
          const init = async () => {
              const products:Product[] = await getProducts(currentCategory.id, token)
              const rows = products as GridRowsProp
              setRows(rows)
            }

              init()
          }, [currentCategory]);
  }

  return (

   <TableCRUD
      title={currentCategory.name}
      addRowTitle="Додати товар"
      rows={rows}
      setRows={setRows}
      useInit={useProductsInit}
      deleteRowBackend={deleteProduct}
      processRowUpdate={processRowUpdate}
      innerColumns={innerColumns}
   />
  );
}

export default Products;