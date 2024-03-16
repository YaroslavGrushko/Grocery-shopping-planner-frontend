import { useEffect, useState } from "react";

import CircularProgress from '@mui/material/CircularProgress';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
  } from '@mui/x-data-grid';

import {randomId} from '@mui/x-data-grid-generator';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import { deleteCategory, getCategories, postCategory, putCategory } from "../services/http";
import {useMainContext} from '../context/MainContext'
import Box from "@mui/material/Box";


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    console.log(id)
    setRows((oldRows) => [...oldRows, { id: id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Додати список
      </Button>
    </GridToolbarContainer>
  );
}

const Categories = () => {
    const {token, setCurrentCategory} = useMainContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleShowProducts= (params: any) => () => {
      console.log(params)
      const category = params.row
      setCurrentCategory(category)
    };
  
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (
      params,
      event
    ) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };
  
    const handleEditClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    const handleSaveClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    const handleDeleteClick = (id: GridRowId) => async () => {
      await deleteCategory(id as number, token)
      setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow!.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };

    const processRowUpdate = async (rowToUpdate: GridRowModel) => {
      let updatedRow ={}
      const categoryToUpdate = 
          {
              name: rowToUpdate.name,
          }
      if(rowToUpdate.isNew){
          // create product on backend
          updatedRow = await postCategory(categoryToUpdate, token)
      }else{
          // update product on backend
          updatedRow = await putCategory(categoryToUpdate, rowToUpdate.id, token)
      }
      updatedRow = { ...updatedRow, isNew: false };
      setRows(rows.map((row) => (row.id === rowToUpdate.id ? updatedRow : row)));
      return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 10},
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
                onClick={handleShowProducts(params)}
                color="inherit"
              />
            ];
          },
        },
        {field: 'name', headerName: 'Name', editable: true},
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 70,
          cellClassName: 'actions',
          getActions: (params: any) => {
            const {id} = params;
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
    
            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
    ]


    useEffect(()=>{
        const init = async ()=>{
            setLoading(true)
            const categories = await getCategories(token)
            const rows = categories as GridRowsProp
            setRows(rows)
            if(categories.length){
                setCurrentCategory(categories[0])
            }
            setLoading(false)
        } 
        init()
    },[])
    return(
        loading ? <CircularProgress /> :
        <Box
        sx={{
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <Typography variant="h3" style={{marginBottom: "20px"}}>Списки товарів</Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          hideFooter={true}
        />
      </Box>)
}

export default Categories