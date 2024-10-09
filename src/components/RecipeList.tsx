import React from 'react';
import RecipeCard from './RecipeCard';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

interface RecipeListProps {
  meals: Meal[];
  onSelect: (id: string) => void;
  isSelected: (id: string) => boolean;
}

const RecipeList: React.FC<RecipeListProps> = ({
  meals,
  onSelect,
  isSelected,
}) => {
  return (
    <div className="recipe-list">
      {meals.map(meal => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          toggleSelect={onSelect}
          isSelected={isSelected(meal.idMeal)}
        />
      ))}
    </div>
  );
};

export default RecipeList;
