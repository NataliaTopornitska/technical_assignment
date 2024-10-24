import React, { useState, useEffect, useRef } from 'react';
import { Meal } from './types';
import MealDetail from './MealDetail';
import Favorites from './Favorites';
import './App.css';
import { Category } from './types';

const App: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const mealsPerPage = 12;
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteMeals');

    if (storedFavorites) {
      setFavoriteMeals(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
  }, [favoriteMeals]);

  const toggleFavoriteMeal = (meal: Meal) => {
    setFavoriteMeals(prevFavorites =>
      prevFavorites.some(fav => fav.idMeal === meal.idMeal)
        ? prevFavorites.filter(fav => fav.idMeal !== meal.idMeal)
        : [...prevFavorites, meal],
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/categories.php',
        );
        const data = await response.json();

        const fetchedCategories: Category[] = data.categories;

        setCategories(fetchedCategories.map(cat => cat.strCategory));
      } catch (error) {}
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category') || 'All';
      const page = parseInt(params.get('page') || '1', 10);
      const mealId = params.get('meal');
      const search = params.get('search') || '';

      setSelectedCategory(category);
      setCurrentPage(page);
      setSearchQuery(search);
      setShowFavorites(params.get('showFavorites') === 'true');

      if (mealId) {
        const fetchMealById = async () => {
          try {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
            );
            const data = await response.json();

            setSelectedMeal(data.meals ? data.meals[0] : null);
          } catch (error) {}
        };

        fetchMealById();
      } else {
        setSelectedMeal(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          selectedCategory === 'All'
            ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
            : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`,
        );
        const data = await response.json();

        setMeals(data.meals || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery === '') {
      fetchMeals();
    } else {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = window.setTimeout(() => {
        fetchMeals();
      }, 300);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(meals.length / mealsPerPage);
  const currentMeals = meals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage,
  );

  const updateURLParams = (
    category: string,
    page: number,
    mealId?: string,
    search?: string,
    showFavoritesFlag?: boolean,
  ) => {
    const params = new URLSearchParams();

    params.set('category', category);
    params.set('page', page.toString());
    if (mealId) {
      params.set('meal', mealId);
    }

    if (search) {
      params.set('search', search);
    }

    if (showFavoritesFlag !== undefined) {
      params.set('showFavorites', showFavorites.toString());
    }

    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
    updateURLParams(selectedCategory, currentPage, meal.idMeal, searchQuery);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const category = event.target.value;

    setSelectedCategory(category);
    setSelectedMeal(null);
    setCurrentPage(1);
    setSearchQuery('');
    setShowFavorites(false);
    updateURLParams(category, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(
      selectedCategory,
      page,
      undefined,
      searchQuery,
      showFavorites,
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setSearchQuery(query);
    setCurrentPage(1);
    updateURLParams(selectedCategory, 1, undefined, query);
  };

  const renderPagination = () => {
    const paginationItems = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage > 4) {
        paginationItems.push(<span key="ellipsis-start">...</span>);
      }

      for (
        let i = Math.max(4, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage < totalPages - 3) {
        paginationItems.push(<span key="ellipsis-end">...</span>);
      }

      paginationItems.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? 'active' : ''}
        >
          {totalPages}
        </button>,
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &#60;
        </button>
        {paginationItems}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &#62;
        </button>
      </div>
    );
  };

  useEffect(() => {
    const storedCategory = localStorage.getItem('selectedCategory');

    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="App">
      <h1>Recipes App</h1>

      <nav>
        <button
          className="button-style"
          onClick={() => {
            setSelectedMeal(null);
            setShowFavorites(false);
            setSelectedCategory('All');
            setCurrentPage(1);
            setSearchQuery('');
            updateURLParams('All', 1);
          }}
        >
          All Meals
        </button>
        <button
          className="button-style"
          onClick={() => {
            setSelectedMeal(null);
            setShowFavorites(true);
            setCurrentPage(1);
            updateURLParams(selectedCategory, 1, undefined, undefined, true);
          }}
        >
          Favorites
        </button>
      </nav>

      {selectedMeal ? (
        <div>
          <MealDetail
            meal={selectedMeal}
            onBack={() => setSelectedMeal(null)}
            numberOfSelectedMeals={favoriteMeals.length}
            isFavorites={showFavorites}
          />
          <button
            className="favorite-button"
            onClick={() => toggleFavoriteMeal(selectedMeal)}
          >
            {favoriteMeals.some(fav => fav.idMeal === selectedMeal.idMeal)
              ? 'Remove from Favorites'
              : 'Add to Favorites'}
          </button>
        </div>
      ) : (
        <>
          {!showFavorites && (
            <div className="search-filter-container">
              <label htmlFor="category-select">Select Category:</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="All">All</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="search-input">Search:</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search meals..."
              />
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : showFavorites ? (
            <Favorites
              favoriteMeals={favoriteMeals}
              onMealSelect={handleMealSelect}
            />
          ) : (
            <div className="meal-container">
              {currentMeals.map(meal => (
                <div
                  key={meal.idMeal}
                  onClick={() => handleMealSelect(meal)}
                  className="meal-card-preview"
                >
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <h2>{meal.strMeal}</h2>
                  <p>Category: {meal.strCategory}</p>
                  <p>Origin: {meal.strArea}</p>
                  <button
                    className="favorite-button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavoriteMeal(meal);
                    }}
                  >
                    {favoriteMeals.some(fav => fav.idMeal === meal.idMeal)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && !showFavorites && renderPagination()}
        </>
      )}
    </div>
  );
};

export default App;
