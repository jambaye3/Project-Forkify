import icons from 'url:../../img/icons.svg';
export function generateRecipeHtml(input) {
  let recipe = input[0];
  let bookmarks = input[1];
  let bookmarked = false;
  bookmarks.forEach(bookmark => {
    if (bookmark.id === recipe.id) bookmarked = true;
  });
  
  let html = '';
  let htmlFirstPart = '';
  let htmlSecondPart = '';
  let htmlThirdPart = '';
  
  htmlFirstPart =
    ` <figure class="recipe__fig">
          <img src=${recipe.imageUrl} alt=${recipe.title} class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">45</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--decrease-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
        </div> 
        <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark${bookmarked?'-fill':""}"></use>
            </svg>
          </button>
        </div>` +
    `<div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">`;

  for (let i = 0; i < recipe.ingredients.length; i++) {
    let quantity = (recipe.ingredients[i].quantity == null? '': recipe.ingredients[i].quantity)
    let quantPerServing = quantity/recipe.servings;               
    
    
    let current = `     <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity" data-quant_per_serving = "${quantPerServing}">${quantity}
              </div>
              <div class="recipe__description">
                <span class="recipe__unit">${recipe.ingredients[i].unit}</span>
                ${recipe.ingredients[i].description}
              </div>
            </li>
          `;
    htmlSecondPart = htmlSecondPart + current;
  }

  htmlThirdPart = `</ul> </div>
  <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;

  html = htmlFirstPart + htmlSecondPart + htmlThirdPart;
  
  return html;
}
