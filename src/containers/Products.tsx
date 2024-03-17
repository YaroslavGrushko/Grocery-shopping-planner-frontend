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

import swal from 'sweetalert2'

 const Products = () => {
    const { token, currentCategory} = useMainContext()
    const [rows, setRows] = useState<GridRowsProp>([]);

    
    const checkOnCreateProduct = () =>{
      if(!currentCategory){
        swal.fire({
          title: "Перед створенням товару, будь ласка, створіть список товарів!",
          icon: "warning",
          toast: true,
          timer: 6000,
          position: 'center-center',
          timerProgressBar: true,
          showConfirmButton: false,
          input: null,
      } as any)

        return false
      }
      return true
    }

    const processRowUpdate = async (rowToUpdate: GridRowModel) => {
      let updatedRow ={}
      if (!currentCategory) return

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
      { field: 'name', headerName: 'Назва', editable: true, flex: 1 },
      { field: 'quantity', headerName: 'К-ть', editable: true, width: 70 },
      { field: 'price', headerName: '₴', editable: true, width: 70,

     },
    ];

    const CustomFooter = () =>{
      const prices = rows.map(row=>Number(row.price))
      const sum = prices.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      },0);
      
      return <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '17px'}}>Загалом: <b>{sum}</b> ₴</div>
    }

    const useProductsInit = ()=>{
      useEffect(() => {
          if (!currentCategory) {
            setRows([])
            return
          }
          
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
      title={currentCategory?.name || ''}
      addRowTitle="Додати товар"
      rows={rows}
      setRows={setRows}
      useInit={useProductsInit}
      checkOnCreateRow={checkOnCreateProduct}
      deleteRowBackend={deleteProduct}
      processRowUpdate={processRowUpdate}
      innerColumns={innerColumns}
      CustomFooter={CustomFooter}
   />
  );
}

export default Products;