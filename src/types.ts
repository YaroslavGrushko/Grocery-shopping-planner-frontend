type Category= {
  id: number;
  name: string;
  isNew: boolean;
}

interface PostCategory{
  name: string;
}

interface Product{
    id: number;
    name: string;
    quantity: number;
    price: number;
    isNew: boolean;
    category: Category;
  }

  interface PostProduct{
    name: string;
    quantity: number;
    price: number;
    category: number;
  }

interface Credentials{
  username: string;
  password: string;
}

export type { Category, PostCategory, Product, PostProduct, Credentials };