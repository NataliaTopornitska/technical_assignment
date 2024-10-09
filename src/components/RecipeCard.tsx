import React from 'react';

interface RecipeCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
  };
  toggleSelect: (id: string) => void;
  isSelected: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  meal,
  toggleSelect,
  isSelected,
}) => {
  return (
    <div className="recipe-card">
      <img
        className="recipe-image"
        src={meal.strMealThumb}
        alt={meal.strMeal}
      />
      <h3 className="recipe-title">{meal.strMeal}</h3>
      <p className="recipe-category">
        {meal.strCategory} - {meal.strArea}
      </p>
      <button
        className="select-button"
        onClick={() => toggleSelect(meal.idMeal)}
      >
        {isSelected ? 'Unselect' : 'Select'}
      </button>
    </div>
  );
};

export default RecipeCard;
