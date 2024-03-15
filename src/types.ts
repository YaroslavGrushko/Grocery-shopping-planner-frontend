interface Category{
  id: number;
  name: string;
}

interface Product{
    id: number;
    name: string;
    quantity: number;
    price: number;
    isNew: boolean;
  }

interface Credentials{
  username: string;
  password: string;
}

export type { Category, Product, Credentials };