import icons from 'url:../../img/icons.svg';

import { errorHandler } from '../helperFunctions';

////////////////////////////////////////////////////

export function generateResultsHtml(results) {
  
  if (results[0] === 'error occured') 
    {return errorHandler(results)};
  let html = ''
  for(let i = 0; i<results.length; i++){
    let currentHtml = `<li class="preview">
          <a class="preview__link" href="#${results[i].id}">
            <figure class="preview__fig">
              <img src="${results[i].image_url}" alt="${results[i].title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${results[i].title}</h4>
              <p class="preview__publisher">${results[i].publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>`;
        html = html + currentHtml;
    }
    return html;

}
////////////////////////////////////////////////////////////////////////////////////////

export function generateBtnsHtml(currentPage, lastPage) {
  if (currentPage === 1) {
    return generateNextBtnHtml(currentPage);
  }

  if (currentPage === lastPage) {
    return generatePrevBtnHtml(currentPage);
  }

  return generatePrevBtnHtml(currentPage) + generateNextBtnHtml(currentPage);
}

function generatePrevBtnHtml(currentPage) {
  let html = `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>`;

  return html;
}

function generateNextBtnHtml(currentPage) {
  let html = `<button class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;

  return html;
}

////////////////////////////////////////////////////////////////

export function generateBookmarksHtml(bookmark) {
  let html = '';
  bookmark.forEach(recipe => {
    let currentHtml = `<li class="preview">
          <a class="preview__link" href="#${recipe.id}">
            <figure class="preview__fig">
              <img src="${recipe.imageUrl}" alt="${recipe.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>`;
    html = currentHtml + html;
  });
  return html;
}

/////////////////////////////////////////////////////////////////

export function generateSpinnerHtml() {
  return `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
}

