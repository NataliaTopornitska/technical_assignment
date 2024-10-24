import React, { useState, useEffect, useMemo } from 'react';
import { Meal } from './types';
import usePagination from './usePagination';

interface FavoritesProps {
  favoriteMeals: Meal[];
  onMealSelect: (meal: Meal) => void;
}

const Favorites: React.FC<FavoritesProps> = ({
  favoriteMeals: initialFavoriteMeals,
  onMealSelect,
}) => {
  const [expandedMealIds, setExpandedMealIds] = useState<Set<string>>(
    new Set(),
  );
  const [favoriteMeals, setFavoriteMeals] =
    useState<Meal[]>(initialFavoriteMeals);
  const mealsPerPage = 10;

  const { currentPage, totalPages, goToPage, nextPage, prevPage } =
    usePagination(favoriteMeals.length, mealsPerPage);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteMeals');

    if (savedFavorites) {
      setFavoriteMeals(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
  }, [favoriteMeals]);

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');

    if (savedPage) {
      goToPage(parseInt(savedPage, 10));
    }
  }, [goToPage]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  const currentMeals = useMemo(() => {
    const indexOfLastMeal = currentPage * mealsPerPage;
    const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;

    return favoriteMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  }, [favoriteMeals, currentPage, mealsPerPage]);

  const uniqueIngredients = useMemo(() => {
    const ingredients: Set<string> = new Set();

    favoriteMeals.forEach(meal => {
      for (let i = 1; i <= 10; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
          ingredients.add(`${ingredient} (${measure})`);
        }
      }
    });

    return Array.from(ingredients);
  }, [favoriteMeals]);

  if (favoriteMeals.length === 0) {
    return <p>No favorite meals selected.</p>;
  }

  const toggleInstructions = (mealId: string) => {
    const newExpandedMealIds = new Set(expandedMealIds);

    if (newExpandedMealIds.has(mealId)) {
      newExpandedMealIds.delete(mealId);
    } else {
      newExpandedMealIds.add(mealId);
    }

    setExpandedMealIds(newExpandedMealIds);
  };

  return (
    <div className="favorites">
      <h2 className="favorites-head">Your Favorite Recipes</h2>

      <div className="flex-container">
        <div className="meal-container">
          {currentMeals.map(meal => {
            const isExpanded = expandedMealIds.has(meal.idMeal);
            const instructions =
              meal.strInstructions || 'No instructions available';
            const truncatedInstructions =
              instructions.substring(0, 100) + '...';

            return (
              <div
                key={meal.idMeal}
                onClick={() => onMealSelect(meal)}
                className="meal-card-preview"
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <h2>{meal.strMeal}</h2>

                <p>
                  <strong>Category:</strong> {meal.strCategory}
                </p>
                <p>
                  <strong>Area:</strong> {meal.strArea}
                </p>

                <h3>Instructions:</h3>
                <p>
                  {isExpanded ? meal.strInstructions : truncatedInstructions}
                </p>
                <button
                  className="show-button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleInstructions(meal.idMeal);
                  }}
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="ingredients-summary">
          <h3>Summary of Ingredients:</h3>
          <ul className="summary_ul">
            {uniqueIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>

      {favoriteMeals.length > mealsPerPage && (
        <div className="pagination">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
