import React from 'react';

interface RecipeDetailProps {
  meal: Record<string, unknown>;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ meal }) => {
  const getStringValue = (key: string): string | undefined => {
    const value = meal[key];

    return typeof value === 'string' ? value : undefined;
  };

  return (
    <div className="recipe-detail">
      <h2 className="recipe-title">{getStringValue('strMeal')}</h2>
      <img
        className="recipe-image"
        src={getStringValue('strMealThumb') ?? ''}
        alt={getStringValue('strMeal') ?? 'Meal Image'}
      />
      <p className="recipe-instructions">{getStringValue('strInstructions')}</p>
      <h3 className="ingredients-title">Ingredients:</h3>
      <ul className="ingredients-list">
        {Array.from({ length: 20 }).map((_, index) => {
          const ingredient = getStringValue(`strIngredient${index + 1}`);
          const measure = getStringValue(`strMeasure${index + 1}`);

          return ingredient ? (
            <li key={index} className="ingredient-item">
              {ingredient} - {measure}
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default RecipeDetail;
