import React, { useState, useMemo } from 'react';
import { Meal } from './types';

interface MealDetailProps {
  meal: Meal | null;
  onBack: () => void;
  numberOfSelectedMeals: number;
  isFavorites: boolean;
}

const MealDetail: React.FC<MealDetailProps> = ({
  meal,
  numberOfSelectedMeals,
  isFavorites,
}) => {
  const [expanded] = useState(false);

  const ingredients = useMemo(() => {
    const ing = [];

    if (meal) {
      for (let i = 1; i <= 10; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
          ing.push({
            name: ingredient,
            measure,
            image: `https://www.themealdb.com/images/ingredients/${ingredient}.png`,
          });
        }
      }
    }

    return ing;
  }, [meal]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="meal-details">
      <h2 className="meal-title">{meal.strMeal}</h2>
      <p>Number of Selected Meals: {numberOfSelectedMeals}</p>
      <img className="meal-image" src={meal.strMealThumb} alt={meal.strMeal} />
      <div className="meal-info">
        <p>Category: {meal.strCategory}</p>
        <p>Area: {meal.strArea}</p>
      </div>
      <h3>Ingredients:</h3>
      {isFavorites && <p>This meal is one of your favorites!</p>}
      <div className="ingredient-images">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-image">
            <img src={ingredient.image} alt={ingredient.name} />
            <p className="ingredient-name">{ingredient.name}</p>
            <p className="ingredient-measure">{ingredient.measure}</p>
          </div>
        ))}
      </div>
      <div className="instructions">
        <h3>Instructions:</h3>
        <div className={`instructions-text ${expanded ? 'expanded' : ''}`}>
          <p>{meal.strInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
