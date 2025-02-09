import icons from 'url:../img/icons.svg';
import { generateRecipeHtml } from './views/recipeView';
import { generateResultsHtml } from './views/searchResultsView';
import { prnt, generateBtnsHtml, timeout, generateSpinnerHtml } from './helperFunctions';
import { updateBookmarkIcon, makeSrchSelectionActive } from './helperFunctions';
import { adjestServing } from './views/servingsAdjestView';
import { generateBookmarksHtml } from './views/servingsAdjestView';


const recipeContainer = document.querySelector('.recipe');
const searchResultsContainer =document.querySelector('.results');
const searchBox = document.querySelector('.search__field');
const searchForm = document.querySelector('.search');
const searchButton = document.querySelector('search__btn');
const pageTurnersContainer = document.querySelector('.pagination');
const btnPrev = document.querySelector('.pagination__btn--prev');
const btnNext = document.querySelector('.pagination__btn--next');
const bookmarksContainer = document.getElementsByClassName('bookmarks__list');
const addRecipeOverlay = document.getElementsByClassName('overlay')[0];
const addRecipeWindow = document.getElementsByClassName('add-recipe-window')[0];
const addRecipeForm = document.getElementsByClassName('upload')[0];
const btnAddRecipe = document.getElementsByClassName('nav__btn--add-recipe')[0];
const btnUploadRecipe = document.getElementsByClassName('upload__btn')[0];
const btnCloseAddRecipeWindow = document.getElementsByClassName('btn--close-modal')[0];

prnt(btnAddRecipe)

btnAddRecipe.addEventListener('click', toggleAddRecipeWindow);
btnCloseAddRecipeWindow.addEventListener('click', toggleAddRecipeWindow);

function toggleAddRecipeWindow(){
  addRecipeOverlay.classList.toggle('hidden');
  addRecipeWindow.classList.toggle('hidden');
}



let servingsElement;
let btnServings;
let quantityElement;
let btnBookMark;
let bookmarks = [];

searchForm.addEventListener('submit', displaySearchResults);
pageTurnersContainer.addEventListener('click', handleResultsRendering);



let results = [];
let currentPage;

async function getSearchData() {
 try{
  let base = 'https://forkify-api.jonas.io/api/v2/recipes?search=';
  let searchedItem = searchBox.value;
  
  let url = base+searchedItem;
  const res = await Promise.race([fetch(url), timeout(10)]);
  const data = await res.json();
   
   
  if (data.data.recipes.length === 0) {
    result = ['error occured', 'code 1'];
    
    return result
  }
 
  results = data.data.recipes;
  
  return results;
 } catch(err){
  return ['error occured', err]
 } 
}



function displaySearchResults(e) {
  currentPage = 0
  e.preventDefault();
  
  const spinnerHtml = generateSpinnerHtml();
  searchResultsContainer.insertAdjacentHTML('afterbegin', spinnerHtml);
  getSearchData().then(handleResultsRendering);
}

function renderResultsHtml(html) {
  searchResultsContainer.innerHTML = '';
  searchResultsContainer.insertAdjacentHTML('afterbegin', html);
}

function handleResultsRendering(event){
  
  if(results.length<11){
    let html = generateResultsHtml(results)
    renderResultsHtml(html);
  }
  
  let pageTurner = 1;
  
  if (currentPage !== 0){
    let btn = event.target.closest('.btn--inline');
    
    if (!btn) return;
    if (btn.classList.contains('pagination__btn--prev')) {
      pageTurner = -1;
    }
  }
  resultsToRender = [];
  let lastPage = Math.ceil(results.length/10);
  currentPage = currentPage + pageTurner;
  let toIndex = 10 * currentPage;
  let fromIndex = toIndex - 10;
  if (toIndex > results.length){
    toIndex = results.length;
  } 

  for (let i = fromIndex; i<toIndex; i++){
    resultsToRender.push(results[i]);
  }

  let html = generateResultsHtml(resultsToRender)
  renderResultsHtml(html);
  
  pageTurnersContainer.innerHTML = '';
  let btnHtmls = generateBtnsHtml(currentPage, lastPage);
  pageTurnersContainer.insertAdjacentHTML('afterbegin', btnHtmls)
  
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


window.addEventListener('hashchange', displayRecipe);
window.addEventListener('load', displayRecipe);
window.addEventListener('load', displayBookmarks);

function displayBookmarks(){
  
  bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  
  bookmarksHtml = generateBookmarksHtml(bookmarks);
  
  bookmarksContainer[0].innerHTML = '';
  bookmarksContainer[0].insertAdjacentHTML('afterbegin', bookmarksHtml);
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