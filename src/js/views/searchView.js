//http://forkify-api.herokuapp.com/
import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear the search field
export const clearInput = () => {
  elements.searchInput.value = '';
};

// Clear the previous results
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

// Hightlight the selected recipe in the result list
export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((el) => el.classList.remove('results__link--active'));
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add('results__link--active');
};

// Check if title is over limit
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // return the result
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

// Display single recipe
const renderRecipe = (recipe) => {
  const markup = `<li>
  <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">T${recipe.publisher}</p>
      </div>
  </a>
</li>`;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Type: 'prev'/ 'next' Create page buttons
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === 'prev' ? 'left' : 'right'
        }"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>
`;

// Display page buttons
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only the next page button
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `${createButton(page, 'prev')}${createButton(page, 'next')}`;
  } else if (page === pages && pages > 1) {
    // Only the previous button
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Display search results
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render result of the current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  // Render pagination
  renderButtons(page, recipes.length, resPerPage);
};
