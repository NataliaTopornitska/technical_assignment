import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMealById } from '../services/mealService';
import RecipeDetail from '../components/RecipeDetail';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: meal, isLoading } = useQuery(['meal', id], () => {
    if (!id) {
      throw new Error('Meal ID is undefined');
    }

    return fetchMealById(id);
  });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recipe-detail-page">
      <RecipeDetail meal={meal} />
    </div>
  );
};

export default RecipeDetailPage;
