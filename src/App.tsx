import React, { useState, useEffect } from 'react';
import { Meal } from './types';
import MealCard from './MealCard';
import './App.css';

const App: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [debouncedSelectedCategory, setDebouncedSelectedCategory] =
    useState<string>(selectedCategory);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const mealsPerPage = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/categories.php',
        );
        const data = await response.json();

        setCategories(data.categories.map((cat: any) => cat.strCategory));
      } catch (error) {}
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSelectedCategory(selectedCategory);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedCategory]);

  useEffect(() => {
    const fetchMealsByCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          debouncedSelectedCategory === 'All'
            ? 'https://www.themealdb.com/api/json/v1/1/search.php?s='
            : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${debouncedSelectedCategory}`,
        );
        const data = await response.json();

        setMeals(data.meals || []);
        setCurrentPage(1);
        setSelectedMeal(null);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMealsByCategory();
  }, [debouncedSelectedCategory]);

  const totalPages = Math.ceil(meals.length / mealsPerPage);
  const currentMeals = meals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage,
  );

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const category = event.target.value;

    setSelectedCategory(category);
  };

  const renderPagination = () => {
    const paginationItems = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage > 4) {
        paginationItems.push(<span key="ellipsis-start">...</span>);
      }

      for (
        let i = Math.max(4, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage < totalPages - 3) {
        paginationItems.push(<span key="ellipsis-end">...</span>);
      }

      paginationItems.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={currentPage === totalPages ? 'active' : ''}
        >
          {totalPages}
        </button>,
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &#60;
        </button>
        {paginationItems}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &#62;
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Recipes App</h1>
      {selectedMeal && (
        <button onClick={() => setSelectedMeal(null)} className="back-button">
          Back to list
        </button>
      )}
      <label htmlFor="category-select">Filter by category:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="All">All</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : selectedMeal ? (
        <MealCard meal={selectedMeal} />
      ) : (
        <div className="meal-container">
          {currentMeals.map(meal => (
            <div
              key={meal.idMeal}
              onClick={() => handleMealSelect(meal)}
              className="meal-card-preview"
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <h2>{meal.strMeal}</h2>
              <p>Category: {meal.strCategory}</p>
              <p>Origin: {meal.strArea}</p>
            </div>
          ))}
        </div>
      )}
      {!selectedMeal && renderPagination()}
    </div>
  );
};

export default App;
