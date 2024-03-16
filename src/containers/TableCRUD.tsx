import { useEffect, useState } from "react";

import CircularProgress from '@mui/material/CircularProgress';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
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

import {useMainContext} from '../context/MainContext'
import Box from "@mui/material/Box";


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface TableCRUDProps {
    title: string;
    addRowTitle: string;
    rows: GridRowsProp;
    setRows: (rows: GridRowsProp) => void;
    useInit: () => void;
    deleteRowBackend: (id: number, token: string) => void;
    processRowUpdate: (rowToUpdate: GridRowModel) => {};
    innerColumns: GridColDef[];
}

const TableCRUD = (props: TableCRUDProps) => {
    const {title, 
        addRowTitle, 
        rows, 
        setRows, 
        useInit, 
        deleteRowBackend, 
        processRowUpdate,
        innerColumns} = props

    const {token} = useMainContext()
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [loading, setLoading] = useState<boolean>(false)

    function EditToolbar(props: EditToolbarProps) {
        const { setRows, setRowModesModel } = props;
      
        const handleClick = () => {
          const id = randomId();
          console.log(id)
          setRows((oldRows) => [...oldRows, { id: id, name: '', isNew: true }]);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
          }));
        };
      
        return (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
              {addRowTitle}
            </Button>
          </GridToolbarContainer>
        );
      }
  
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
      await deleteRowBackend(id as number, token)
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

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const idColumn=[{field: 'id', headerName: 'ID', width: 10}]
    const actionsColumn = [
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

    const columns = [...idColumn, ...innerColumns, ...actionsColumn]

    useInit()

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
        <Typography variant="h3" style={{marginBottom: "20px"}}>{title}</Typography>
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

export default TableCRUD