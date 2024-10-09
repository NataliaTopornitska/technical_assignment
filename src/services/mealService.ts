import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const fetchMeals = async (category?: string, search?: string) => {
  const url = category
    ? `${BASE_URL}filter.php?c=${category}`
    : search
      ? `${BASE_URL}search.php?s=${search}`
      : `${BASE_URL}search.php?s=`;

  const response = await axios.get(url);

  return response.data.meals || [];
};

export const fetchMealById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}lookup.php?i=${id}`);

  return response.data.meals[0];
};

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}categories.php`);

  return response.data.categories;
};
