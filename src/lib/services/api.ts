
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

// Map API categories to our app categories
const mapCategory = (apiCategory: string): string => {
  if (apiCategory.includes('men')) return 'Men';
  if (apiCategory.includes('women')) return 'Women';
  if (apiCategory.includes('jewelery')) return 'Accessories';
  if (apiCategory.includes('electronics')) return 'Electronics';
  return 'Other';
};

// Generate appropriate brand name based on product data
const generateBrand = (apiProduct: ApiProduct): string => {
  const category = apiProduct.category.toLowerCase();
  
  if (category.includes('men')) {
    return ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'H&M'][Math.floor(Math.random() * 5)];
  }
  
  if (category.includes('women')) {
    return ['Zara', 'H&M', 'Forever 21', 'Mango', 'Gucci'][Math.floor(Math.random() * 5)];
  }
  
  if (category.includes('jewelery')) {
    return ['Tiffany', 'Cartier', 'Pandora', 'Swarovski', 'Tanishq'][Math.floor(Math.random() * 5)];
  }
  
  if (category.includes('electronics')) {
    return ['Apple', 'Samsung', 'Sony', 'LG', 'Bose'][Math.floor(Math.random() * 5)];
  }
  
  return apiProduct.category.split(' ')[0];
};

// Transform API data to match our app's product structure
const transformApiProduct = (apiProduct: ApiProduct): Product => {
  // Map categories to ensure they match our app's categories
  const category = mapCategory(apiProduct.category);

  // Calculate a random discount for some products
  const hasDiscount = Math.random() > 0.6;
  const discountPercentage = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
  const originalPrice = hasDiscount ? Math.round(apiProduct.price * (100 / (100 - discountPercentage))) : undefined;

  // Generate appropriate sizes based on category
  const sizes = (() => {
    if (category === 'Men' || category === 'Women') {
      return ['S', 'M', 'L', 'XL'].filter(() => Math.random() > 0.3);
    }
    if (category === 'Electronics' || category === 'Accessories') {
      return ['One Size'];
    }
    return ['S', 'M', 'L'].filter(() => Math.random() > 0.3);
  })();

  // Generate appropriate colors based on category
  const colors = (() => {
    const allColors = [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#ffffff' },
      { name: 'Blue', code: '#0000ff' },
      { name: 'Red', code: '#ff0000' },
      { name: 'Green', code: '#008000' },
      { name: 'Yellow', code: '#ffff00' },
      { name: 'Pink', code: '#ffc0cb' },
      { name: 'Purple', code: '#800080' },
      { name: 'Gray', code: '#808080' },
    ];
    
    // Select 2-4 random colors
    return allColors.filter(() => Math.random() > 0.7);
  })();

  // Generate random properties needed by our app
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    brand: generateBrand(apiProduct),
    category,
    price: Math.round(apiProduct.price * 80), // Convert to rupees for our Myntra clone
    originalPrice: originalPrice ? Math.round(originalPrice * 80) : undefined,
    discountPercentage: discountPercentage || undefined,
    image: apiProduct.image,
    description: apiProduct.description,
    rating: apiProduct.rating.rate,
    sizes,
    colors,
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

// Fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    return allProducts.filter(product => product.category === category);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
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
