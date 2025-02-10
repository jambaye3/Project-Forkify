import icons from 'url:../img/icons.svg';

import { generateRecipeHtml,  } from './views/htmlGenerators1';
import { generateResultsHtml, generateBtnsHtml, generateSpinnerHtml, generateBookmarksHtml} from './views/htmlGenerators2';
import { prnt, timeout, adjestServing, updateBookmarkIcon, makeSrchSelectionActive } from './helperFunctions';



const recipeContainer = document.querySelector('.recipe');
const searchResultsContainer =document.querySelector('.results');
const searchBox = document.querySelector('.search__field');
const searchForm = document.querySelector('.search');
const bookmarksContainer = document.querySelector('.bookmarks__list');
const pageTurnersContainer = document.querySelector('.pagination');


window.addEventListener('load', displayRecipe);
window.addEventListener('load', displayBookmarks);


const resultsPerPage = 10;
let servingsElement;
let btnServings;
let quantityElement;
let btnBookMark;
let bookmarks = [];

searchForm.addEventListener('submit', fetchAndHandleResults);
pageTurnersContainer.addEventListener('click', handleResultsRendering);
window.addEventListener('hashchange', displayRecipe);


let results = [];
let currentPage;

function fetchAndHandleResults(e) {
    e.preventDefault();
  
  //Empty results disp container & disp buffering indicator
  
  searchResultsContainer.innerHTML = '';
  const spinnerHtml = generateSpinnerHtml();
  searchResultsContainer.insertAdjacentHTML('afterbegin', spinnerHtml);
  
  //Set results dispaly page to 0, it will be incrimented to 1 when first page is diplayed
  currentPage = 0
  
  getSearchData().then(handleResultsRendering);
}

async function getSearchData() {
  try {
    let base = 'https://forkify-api.jonas.io/api/v2/recipes?search=';
    let searchedItem = searchBox.value;

    let url = base + searchedItem;
    const res = await Promise.race([fetch(url), timeout(10)]);
    const data = await res.json();

    if (data.data.recipes.length === 0) {
      result = ['error occured', 'code 1'];

      return result;
    }

    results = data.data.recipes;

    return results;
  } catch (err) {
    return ['error occured', err];
  }
}

//The primary task of 'handleResultsRendering' is to prep the pages for displaying at the 
//prescribed resultsPerPage (currently set at 10) value. But it does also make the appropriote pageTurner buttons available to the user. But 
//most of this task it deligates to the generateBtnsHtml function

function handleResultsRendering(event){   
  prnt(results);
  pageTurnersContainer.innerHTML = ''; //cleare pageTurner btns.
 
 //The below condition corresepands to when results are less than the 10. In this case no need 
  // to prep. just send for rendering with the parsed results directly from the api
 
  if(results.length<=resultsPerPage){
    
    renderResults(results);
    return;
  }

  //otherwise, prep
  
  let pageTurner = 1;  //pageTurner will flip to next page when positive, and prev page when negative
  
  //pageTurner is assumed positive (next page); if determined in the following block that user selcted prev page btn
  //it will be set to negative. But current page 0 indicates no btn interaction by user yet; in this case only need to 
  // display 1st set of results and make the next page btn avialable for user
  if (currentPage !== 0){  
    let btn = event.target.closest('.btn--inline');
    
    if (!btn) return;
    if (btn.classList.contains('pagination__btn--prev')) {
      pageTurner = -1;
    }
  }
  resultsToRender = []; //preped results array
  let lastPage = Math.ceil(results.length/resultsPerPage); //this value will be equal to the total num of pages
  currentPage = currentPage + pageTurner;

  //The fromIndex and toIndex are the starting and end points, respectively, through which the results array will be itterated
  //over to extract the 10 results that correspands to the current page. 
  let toIndex = resultsPerPage * currentPage;
  let fromIndex = toIndex - resultsPerPage;
  
  //the below condition correspands to the case where the user is on the last page.
  if (toIndex > results.length){
    toIndex = results.length;
  } 

  for (let i = fromIndex; i<toIndex; i++){
    resultsToRender.push(results[i]);
  }

  renderResults(resultsToRender);
  
  
  let btnHtmls = generateBtnsHtml(currentPage, lastPage);
  pageTurnersContainer.insertAdjacentHTML('afterbegin', btnHtmls)
  
}

function renderResults(resultsToRender) {
  
  prnt(resultsToRender)
  let html = generateResultsHtml(resultsToRender);
  searchResultsContainer.innerHTML = '';
  searchResultsContainer.insertAdjacentHTML('afterbegin', html);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





function displayBookmarks(){
  
  bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  
  bookmarksHtml = generateBookmarksHtml(bookmarks);
  
  bookmarksContainer.innerHTML = '';
  bookmarksContainer.insertAdjacentHTML('afterbegin', bookmarksHtml);
}

let recipe = {};

async function getRecipeData() {
  let base = 'https://forkify-api.jonas.io/api/v2/recipes/';
  let url = new URL(hash, base);
  
  const res = await fetch(url);

  const data = await res.json();
  
  recipe.title = data.data.recipe.title;
  recipe.id = data.data.recipe.id;
  recipe.cookingTime = data.data.recipe.cooking_time;
  recipe.ingredients = data.data.recipe.ingredients;
  recipe.servings = data.data.recipe.servings;
  recipe.imageUrl = data.data.recipe.image_url;
  recipe.publisher = data.data.recipe.publisher;
  recipe.sourceUrl = data.data.recipe.source_url;
  return [recipe, bookmarks]
}

function displayRecipe() {
 // if(results.length === 0) return;
  hash = window.location.hash.slice(1);
  let srchLinks = document.querySelectorAll('.preview__link');
  makeSrchSelectionActive(srchLinks);
  recipeContainer.innerHTML = '';
  const spinnerHtml = generateSpinnerHtml();
  recipeContainer.insertAdjacentHTML('afterbegin', spinnerHtml);
  getRecipeData().then(generateRecipeHtml).then(renderRecipeHtml);
}

function renderRecipeHtml(html) {
  recipeContainer.insertAdjacentHTML('afterbegin', html);
  servingsElement = document.querySelector('.recipe__info-data--people');
  btnServings = document.querySelector('.recipe__info-buttons');
  quantityElement = document.querySelectorAll(".recipe__quantity");
  btnBookMark = document.querySelector('.btn--round')
  btnServings.addEventListener('click', handleServingChange);
  btnBookMark.addEventListener('click', handdleBookMarking);
  btnBookMark.addEventListener('hashchange', handdleBookMarking);
}

function handleServingChange(e) {
  let btn = e.target.closest('.btn--tiny');
  if (!btn) return;  
  let servingAdjester = 1;
  if (btn.classList.contains('btn--decrease-servings')) {
    if (+servingsElement.textContent === 1) return;
    servingAdjester = -1;
  }
  adjestServing(servingsElement, quantityElement, servingAdjester);
}

function handdleBookMarking(){
  
  updateBookmarkIcon(btnBookMark, bookmarks, recipe);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarks();
  
  
} 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////