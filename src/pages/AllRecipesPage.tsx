import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeals, fetchCategories } from '../services/mealService';
import RecipeList from '../components/RecipeList';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

interface Category {
  idCategory: string;
  strCategory: string;
}

const AllRecipesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const mealsPerPage = 10;

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[],
    Error
  >({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: meals = [], isLoading } = useQuery<Meal[], Error>({
    queryKey: ['meals', search, selectedCategory],
    queryFn: () => fetchMeals(selectedCategory, search),
    enabled: Boolean(selectedCategory || search),
  });

  const toggleSelect = (id: string) => {
    setSelectedRecipes(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading || isLoadingCategories) {
    return <div className="loading">Loading...</div>;
  }

  const filteredMeals: Meal[] = selectedCategory
    ? meals.filter(meal => meal.strCategory === selectedCategory)
    : meals;

  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="all-recipes">
      <div className="category-buttons">
        {categories.map((category: Category) => (
          <button
            key={category.idCategory}
            className="category-button"
            onClick={() => setSelectedCategory(category.strCategory)}
          >
            {category.strCategory}
          </button>
        ))}
        <button
          className="category-button"
          onClick={() => setSelectedCategory('')}
        >
          All
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search recipes"
        value={search}
        onChange={handleSearchChange}
      />

      <RecipeList
        meals={currentMeals}
        onSelect={toggleSelect}
        isSelected={id => selectedRecipes.includes(id)}
      />

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className="page-button"
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllRecipesPage;
