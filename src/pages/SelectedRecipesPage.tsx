import React, { useEffect, useState } from 'react';

interface Meal {
  idMeal: string;
  strMeal: string;
  ingredients: string[];
}

const SelectedRecipesPage: React.FC<{
  selectedRecipes: string[];
  meals: Meal[];
}> = ({ selectedRecipes, meals }) => {
  const [ingredientsCount, setIngredientsCount] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const count: { [key: string]: number } = {};

    selectedRecipes.forEach(recipeId => {
      const foundMeal = meals.find(meal => meal.idMeal === recipeId);

      if (foundMeal) {
        foundMeal.ingredients.forEach(ingredient => {
          count[ingredient] = (count[ingredient] || 0) + 1;
        });
      }
    });

    setIngredientsCount(count);
  }, [selectedRecipes, meals]);

  return (
    <div>
      <h2>Ingredients Count</h2>
      {Object.entries(ingredientsCount).map(([ingredient, count]) => (
        <div key={ingredient}>
          {ingredient}: {count}
        </div>
      ))}
    </div>
  );
};

export default SelectedRecipesPage;
