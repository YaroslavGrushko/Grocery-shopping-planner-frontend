import {createContext, useContext} from "react";
import { Category } from "../types";
import { GridRowsProp } from "@mui/x-data-grid";

interface IMainContext{
    token: string;
    setToken: (token: string) => void;
    currentCategory: Category | null;
    setCurrentCategory: (category: Category | null) => void;
}

const initContextData = {
  token: '', 
  setToken: () => {},
  currentCategory: null,
  setCurrentCategory: () => {},
}

const MainContext = createContext<IMainContext>(initContextData);

const useMainContext = () => useContext(MainContext);

export {MainContext, useMainContext};