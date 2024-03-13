import { useState} from 'react'

import './App.css'

import Products from './containers/Products'
import Login from './containers/Login'
import { Category } from './types'
import Categories from './containers/Categories'

function App() {

  const [token, setToken] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>()

  return (
    token?
      <>
        <Categories token={token} categories={categories} setCategories={setCategories}/>
        <Products token={token} categories={categories}/>
        <input type="button" onClick={()=>setToken('')} value="Logout"/>
      </>
    :
    <Login setToken={setToken}/>
  )
}

export default App
