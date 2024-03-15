import {createContext, useContext} from "react";
import { Category } from "../types";

interface IMainContext{
    token: string;
    setToken: (token: string) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    currentCategory: number;
    setCurrentCategory: (category: number) => void;
}

const initContextData = {
  token: '', 
  setToken: () => {},
  categories: [],
  setCategories: () => {},
  currentCategory: 0,
  setCurrentCategory: () => {},
}

const MainContext = createContext<IMainContext>(initContextData);

const useMainContext = () => useContext(MainContext);

export {MainContext, useMainContext};