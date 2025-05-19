
import { Product } from '../store/productSlice';

// API url for fetching products
const API_URL = 'https://fakestoreapi.com/products';

// Types to match the incoming API data structure
interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Transform API data to match our app's product structure
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  // Map categories to ensure they match our app's categories
  let category = apiProduct.category;
  if (category.includes('men')) category = 'Men';
  else if (category.includes('women')) category = 'Women';
  else if (category.includes('jewelery')) category = 'Accessories';
  else category = 'Other';

  // Calculate a random discount for some products
  const hasDiscount = Math.random() > 0.6;
  const discountPercentage = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
  const originalPrice = hasDiscount ? Math.round(apiProduct.price * (100 / (100 - discountPercentage))) : undefined;

  // Generate random properties needed by our app
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    brand: apiProduct.category.split(' ')[0],
    category,
    price: Math.round(apiProduct.price * 80), // Convert to rupees for our Myntra clone
    originalPrice: originalPrice ? Math.round(originalPrice * 80) : undefined,
    discountPercentage: discountPercentage || undefined,
    image: apiProduct.image,
    description: apiProduct.description,
    rating: apiProduct.rating.rate,
    sizes: ['S', 'M', 'L', 'XL'].filter(() => Math.random() > 0.3),
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#ffffff' },
      { name: 'Blue', code: '#0000ff' },
      { name: 'Red', code: '#ff0000' },
    ].filter(() => Math.random() > 0.5),
    isTrending: Math.random() > 0.7,
    isNewArrival: Math.random() > 0.7,
  };
};

// Fetch all products from API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const apiProducts: ApiProduct[] = await response.json();
    return apiProducts.map(transformApiProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Search products from API
export const searchProductsApi = async (query: string): Promise<Product[]> => {
  try {
    // For this demo, we'll fetch all products and filter client-side
    // In a real app, you would use a proper search endpoint
    const allProducts = await fetchProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
