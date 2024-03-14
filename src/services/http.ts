import {Category, Product, Credentials} from "../types"

const baseUrl = 'http://127.0.0.1:8000'

const getCategories = async (token: string)=>{
    const url = `${baseUrl}/api/categories`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
      })
    
    const categories:Category[]  = await response.json()
    
    return categories
}

const getProducts = async (categoryId: number, token: string)=>{
    const url = `${baseUrl}/api/products/?category_id=${categoryId}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
      })
    
    const products:Product[]  = await response.json()

    return products
}

const getToken = async (credentials:Credentials)=>{
    const url = `${baseUrl}/accounts/login/`
    const {username, password} = credentials;
    const body =  {
        username: username,
        password: password
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

    const {token} = await response.json()

    return token
}

const registerUser = async (credentials:Credentials)=>{
  const url = `${baseUrl}/accounts/register/`
  const {username, password} = credentials;
  const body =  {
      username: username,
      password: password
  }

  const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

  const {token} = await response.json()

  return token
}

export {getCategories, getProducts, getToken, registerUser}