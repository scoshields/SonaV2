import React from 'react';
import { THERAPY_CATEGORIES } from '../utils/therapy/categories';
import type { TherapyType } from '../utils/therapy/categories';

interface TherapyTypeSelectorProps {
  value: string;
  onChange: (typeId: string) => void;
  disabled?: boolean;
}

export function TherapyTypeSelector({ value, onChange, disabled }: TherapyTypeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>(() => {
    // Initialize with the category of the current value
    const category = THERAPY_CATEGORIES.find(cat => 
      cat.types.some(type => type.id === value)
    );
    return category?.id || THERAPY_CATEGORIES[0].id;
  });

  const currentCategory = THERAPY_CATEGORIES.find(cat => cat.id === selectedCategory);
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // Select the first type in the new category
    const category = THERAPY_CATEGORIES.find(cat => cat.id === newCategory);
    if (category && category.types.length > 0) {
      onChange(category.types[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Therapy Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={disabled}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          {THERAPY_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {currentCategory && (
        <div className="space-y-2">
          <label htmlFor="therapyType" className="block text-sm font-medium text-gray-700">
            Type of Therapy
          </label>
          <select
            id="therapyType"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          >
            {currentCategory.types.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}