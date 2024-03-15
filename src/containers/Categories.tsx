import { useEffect, useState } from "react";

import CircularProgress from '@mui/material/CircularProgress';

import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import { getCategories } from "../services/http";
import {useMainContext} from '../context/MainContext'


const Categories = () => {
    const {token, categories, setCategories, setCurrentCategory} = useMainContext()
    const [loading, setLoading] = useState<boolean>(false)

    interface INameButton{
       params: GridRenderCellParams
    }
    const ButtonName = (props: INameButton)=>{
        const {params} = props;
        const category = {
            id: params.row.id,
            name: params.row.name,
        }
        const onClick= ()=>{
            setCurrentCategory(category)
            console.log('Button Works ..')
        }
        return <Button variant="text" onClick={onClick}>{category.name}</Button>
    }
    const columns = [
        {field: 'id', headerName: 'ID', flex: 0.2},
        {field: 'name', headerName: 'ReadOnlyName', flex: 0.8},
        {field: 'actions', headerName: 'Name', flex: 0.8, renderCell: (params: GridRenderCellParams) => <ButtonName params={params}/>}
    ]

    useEffect(()=>{
        const init = async ()=>{
            setLoading(true)
            const categories = await getCategories(token)
            const rows = categories as GridRowsProp
            setCategories(rows)
            if(categories.length){
                setCurrentCategory(categories[0])
            }
            setLoading(false)
        } 
        init()
    },[])
    return(
        loading ? <CircularProgress /> :
        <div  style={{ width: '100%' }}>
            <Typography variant="h3" style={{marginBottom: "20px"}}>Categories</Typography>
            <DataGrid 
                rows={categories} 
                columns={columns} 
                hideFooter={true} 
                initialState={{
                    columns: {
                      columnVisibilityModel: {
                        name: false,
                      },
                    },
                  }}
                />
        </div>)
}

export default Categories