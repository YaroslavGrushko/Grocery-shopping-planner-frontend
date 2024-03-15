import {useState} from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import './App.css'

import Products from './containers/Products'
import Login from './containers/Login'
import { Category } from './types'
import Categories from './containers/Categories'
import {MainContext} from './context/MainContext'

const theme = createTheme();

theme.typography.h3 = {
  fontSize: '2.5rem',
  fontWeight: 'normal',
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};

function App() {

  const [token, setToken] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])

  const mainContextData = {
    token, 
    setToken,
    categories,
    setCategories,
}


  return (
    <MainContext.Provider value={mainContextData}>
      <ThemeProvider theme={theme}>
        {token?
          <Stack style={{width: "100%"}}>
            <Grid container style={{width: "100%", display: 'flex', gap:"5%"}}>
              <Grid item xs={12} md={8} style={{paddingBottom: "30px"}}>
                <Products/>
              </Grid>
              <Grid item xs={12} md={3} style={{paddingBottom: "30px"}}>
                <Categories/>
              </Grid>
            </Grid> 
            
            <Box style={{width:'fitContent'}}>
              <Button fullWidth={false} variant="outlined" onClick={()=>setToken('')}>{"Logout"}</Button>
            </Box>
          </Stack>
        :
        <Login setToken={setToken}/>}
      </ThemeProvider>
    </MainContext.Provider>
  )
}

export default App
