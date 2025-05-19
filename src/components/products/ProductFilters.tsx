
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setFilter, 
  clearFilters, 
  selectFilters
} from '@/lib/store/productSlice';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    size: true,
    color: true,
    sort: true,
  });
  
  const categories = ['Men', 'Women', 'Kids', 'Sports', 'Accessories', 'Electronics'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40'];
  const colors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Navy', code: '#000080' },
    { name: 'Grey', code: '#808080' },
  ];
  const priceRanges = [
    { label: 'Under ₹500', range: [0, 500] },
    { label: '₹500 - ₹1000', range: [500, 1000] },
    { label: '₹1000 - ₹2000', range: [1000, 2000] },
    { label: 'Above ₹2000', range: [2000, 10000] },
  ];
  const sortOptions = [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
  ];
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleCategoryChange = (category: string) => {
    dispatch(setFilter({ filterType: 'category', value: category === filters.category ? null : category }));
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    dispatch(setFilter({ 
      filterType: 'priceRange', 
      value: JSON.stringify(range) === JSON.stringify(filters.priceRange) ? null : range 
    }));
  };
  
  const handleSizeChange = (size: string) => {
    dispatch(setFilter({ filterType: 'size', value: size === filters.size ? null : size }));
  };
  
  const handleColorChange = (color: string) => {
    dispatch(setFilter({ filterType: 'color', value: color === filters.color ? null : color }));
  };
  
  const handleSortChange = (sort: 'price-asc' | 'price-desc' | 'rating') => {
    dispatch(setFilter({ filterType: 'sort', value: sort === filters.sort ? null : sort }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== null);
  
  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <div className="border-b pb-4 mb-4">
      <div 
        className="flex justify-between items-center py-2 cursor-pointer"
        onClick={() => toggleSection(section)}
      >
        <h3 className="font-medium">{title}</h3>
        {expandedSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      <div className={`mt-2 ${expandedSections[section] ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filters toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>Filters & Sort</span>
          {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {/* Filters sidebar */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-background rounded-lg border p-4 sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-myntra-purple-dark transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          <FilterSection title="Categories" section="categories">
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <button
                    className={`w-full text-left py-1 px-2 rounded-md text-sm ${
                      filters.category === category
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                  {filters.category === category && (
                    <button 
                      onClick={() => handleCategoryChange(category)}
                      className="text-primary hover:text-myntra-purple-dark transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FilterSection>
          
          <FilterSection title="Price Range" section="price">
            <div className="space-y-2">
              {priceRanges.map(({ label, range }) => (
                <div key={label} className="flex items-center">
                  <button
                    className={`w-full text-left py-1 px-2 rounded-md text-sm ${
                      JSON.stringify(filters.priceRange) === JSON.stringify(range)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handlePriceRangeChange(range)}
                  >
                    {label}
                  </button>
                  {JSON.stringify(filters.priceRange) === JSON.stringify(range) && (
                    <button 
                      onClick={() => handlePriceRangeChange(range)}
                      className="text-primary hover:text-myntra-purple-dark transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FilterSection>
          
          <FilterSection title="Size" section="size">
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`flex items-center justify-center h-8 min-w-[32px] px-2 rounded-md text-sm border ${
                    filters.size === size
                      ? 'bg-primary text-white border-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>
          
          <FilterSection title="Color" section="color">
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full border-2 ${
                    filters.color === color.name
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'hover:opacity-90'
                  }`}
                  style={{ backgroundColor: color.code, borderColor: color.code === '#FFFFFF' ? '#e2e8f0' : color.code }}
                  onClick={() => handleColorChange(color.name)}
                  aria-label={`Filter by color: ${color.name}`}
                  title={color.name}
                />
              ))}
            </div>
          </FilterSection>
          
          <FilterSection title="Sort By" section="sort">
            <div className="space-y-2">
              {sortOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <button
                    className={`w-full text-left py-1 px-2 rounded-md text-sm ${
                      filters.sort === option.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleSortChange(option.value as any)}
                  >
                    {option.label}
                  </button>
                  {filters.sort === option.value && (
                    <button 
                      onClick={() => handleSortChange(option.value as any)}
                      className="text-primary hover:text-myntra-purple-dark transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
