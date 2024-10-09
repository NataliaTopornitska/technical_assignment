import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllRecipesPage from './pages/AllRecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SelectedRecipesPage from './pages/SelectedRecipesPage';

interface Meal {
  idMeal: string;
  strMeal: string;
  ingredients: string[];
}

const meals: Meal[] = [];
const selectedRecipes: string[] = [];

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AllRecipesPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route
            path="/selected"
            element={
              <SelectedRecipesPage
                selectedRecipes={selectedRecipes}
                meals={meals}
              />
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
