import { useEffect, useState } from "react";
import { Category } from "../types"
import { getCategories } from "../services/http";

interface CategoryProps {
    token : string;
    categories: undefined | Category[];
    setCategories: (categories: Category[]) => void;
}
const Categories: React.FC<CategoryProps> = ({token, categories, setCategories}) => {
    const [loading, setLoading] = useState<boolean>(false)

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
        loading ? 'loading...' :
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {categories?.map((category:Category)=>
                (<tr key={category.id as any}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td></td>
                    </tr>)
            )}
            </tbody>
        </table>)
}

export default Categories