import {useState, useEffect} from 'react'
import {Product} from "../types";
import { getProducts } from '../services/http';

import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import {useMainContext} from '../context/MainContext'

const Products = () =>{
    const { token, categories } = useMainContext()

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const columns = [
        {field: 'id', headerName: 'ID', flex: 0.1},
        {field: 'name', headerName: 'Name', flex: 0.7},
        {field: 'quantity', headerName: 'Quantity', flex: 0.1},
        {field: 'price', headerName: 'Price', flex: 0.1},
    ]

    useEffect(()=>{
        if (!categories || !categories.length) return
        const categoryId = categories[0].id 

        const init = async () => {
        setLoading(true)
        const products:Product[] = await getProducts(categoryId, token)
        setProducts(products)
        setLoading(false)
        }
        init()
        
    },[categories])
return ( 
    loading ? <CircularProgress /> :
    <div  style={{ width: '100%' }}>
        <Typography variant="h3" style={{marginBottom: "20px"}}>Products</Typography>
        <DataGrid rows={products} columns={columns} hideFooter={true}/>
    </div>)
}

  export default Products