import React from 'react';
import { Meal } from './types';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const ingredients = Array.from({ length: 10 }, (_, i) => ({
    ingredient: meal[`strIngredient${i + 1}` as keyof Meal],
    measure: meal[`strMeasure${i + 1}` as keyof Meal],
  })).filter(item => item.ingredient);

  return (
    <div className="meal-card">
      <h2>{meal.strMeal}</h2>
      <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
      <p>
        <strong>Category:</strong> {meal.strCategory}
      </p>
      <p>
        <strong>Area:</strong> {meal.strArea}
      </p>
      <h3>Ingredients:</h3>
      <ul className="ingredients-list">
        {ingredients.map((item, index) => (
          <li key={index} className="ingredient-item">
            {item.ingredient} - {item.measure}
          </li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <p className="instructions">{meal.strInstructions}</p>
      {meal.strYoutube && (
        <div>
          <h3>Watch Video:</h3>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default MealCard;
