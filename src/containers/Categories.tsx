import { useEffect, useState } from "react";


import CircularProgress from '@mui/material/CircularProgress';

import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { Category } from "../types"
import { getCategories } from "../services/http";

interface CategoryProps {
    token : string;
    categories: [] | Category[];
    setCategories: (categories: Category[]) => void;
}
const Categories: React.FC<CategoryProps> = ({token, categories, setCategories}) => {
    const [loading, setLoading] = useState<boolean>(false)

    const columns = [
        {field: 'id', headerName: 'ID', flex: 0.2},
        {field: 'name', headerName: 'Name', flex: 0.8},
    ]

    useEffect(()=>{
        const init = async ()=>{
            setLoading(true)
            const categories = await getCategories(token)
            setCategories(categories)
            setLoading(false)
        } 
        init()
    },[])
    return(
        loading ? <CircularProgress /> :
        <div  style={{ width: '100%' }}>
            <Typography variant="h3" style={{marginBottom: "20px"}}>Categories</Typography>
            <DataGrid rows={categories} columns={columns} hideFooter={true}/>
        </div>)
}

export default Categories