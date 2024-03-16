import {createContext, useContext} from "react";
import { Category } from "../types";
import { GridRowsProp } from "@mui/x-data-grid";

interface IMainContext{
    token: string;
    setToken: (token: string) => void;
    currentCategory: Category;
    setCurrentCategory: (category: Category) => void;
}

const initContextData = {
  token: '', 
  setToken: () => {},
  currentCategory: {id:0, name:""},
  setCurrentCategory: () => {},
}

const MainContext = createContext<IMainContext>(initContextData);

const useMainContext = () => useContext(MainContext);

export {MainContext, useMainContext};