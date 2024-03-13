import {useState, useEffect} from 'react'
import {Category, Product} from "../types";
import { getProducts } from '../services/http';

interface ProductProps{
    token: string;
    categories: undefined | Category[];
}

const Products:React.FC<ProductProps>  = ({token, categories}) =>{
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(()=>{
        if (!categories) return
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
    loading ? 'loading...' :
    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {products.map((product:Product)=>
            (<tr key={product.id as any}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td></td>
                </tr>)
        )}
        </tbody>
    </table>)
}

  export default Products