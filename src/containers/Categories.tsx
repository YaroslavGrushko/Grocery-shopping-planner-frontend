import { useEffect, useState } from "react";

import Visibility from '@mui/icons-material/Visibility';

import {
    GridRowsProp,
    GridActionsCellItem,
    GridRowModel,
  } from '@mui/x-data-grid';


import { deleteCategory, getCategories, postCategory, putCategory } from "../services/http";
import {useMainContext} from '../context/MainContext'

import TableCRUD from './TableCRUD'
import { Category } from "../types";

const Categories = () => {
    const {token, setCurrentCategory} = useMainContext()
    const [rows, setRows] = useState<GridRowsProp>([]);

    const handleShowProducts= (params: any) => {
      console.log(params)
      const category = params.row
      setCurrentCategory(category)
    };

    const processRowUpdate = async (rowToUpdate: GridRowModel) => {
      let updatedRow: Category;
      const categoryToUpdate = 
          {
              name: rowToUpdate.name,
          }
      if(rowToUpdate.isNew){
          // create category on backend
          updatedRow = await postCategory(categoryToUpdate, token)
      }else{
          // update category on backend
          updatedRow = await putCategory(categoryToUpdate, rowToUpdate.id, token)
      }
  
      updatedRow = { ...updatedRow, isNew: false };
      setRows(rows.map((row) => (row.id === rowToUpdate.id ? updatedRow : row)));
    
      handleShowProducts(
        {
          row: {
            id: updatedRow.id,
            name: updatedRow.name
          }
        })
      return updatedRow;
    };

    const onDeleteCategory = async (id: number, token: string)=>{
      await deleteCategory(id, token)
      setCurrentCategory(null)
    }

    const innerColumns = [
        {
          field: 'showProducts',
          type: 'actions',
          headerName: '',
          width: 10,
          cellClassName: 'actions',
          getActions: (params: any) => {
            return [
              <GridActionsCellItem
                icon={<Visibility />}
                label="Показати список"
                className="textPrimary"
                onClick={()=>{handleShowProducts(params)}}
                color="inherit"
              />
            ];
          },
        },
        {field: 'name', headerName: 'Назва', editable: true, flex: 1},
    ]


  const useCategoriesInit=()=>{
      useEffect( ()=>{
          const init= async ()=>{
              const categories = await getCategories(token)
              const rows = categories as GridRowsProp
              setRows(rows)
              if(categories.length){
                  setCurrentCategory(categories[0])
              }
          }

        init()
      },[])
  }
    
    return(
        <TableCRUD
          title= "Списки товарів"
          addRowTitle="Додати список"
          rows={rows}
          setRows={setRows}
          useInit={useCategoriesInit}
          checkOnCreateRow={() => true}
          deleteRowBackend={onDeleteCategory}
          processRowUpdate={processRowUpdate}
          innerColumns={innerColumns}
        />)
}

export default Categories