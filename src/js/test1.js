import icons from 'url:../img/icons.svg';

const recipeContainer = document.querySelector('.recipe');
let recipe = {};

const url = 'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886';


async function getData(inputUrl){
 
  const res = await fetch(inputUrl);
 
  const data = await res.json();
  console.log(data)
  
  recipe.title = data.data.recipe.title;
  
 }
getData(url);
htmlGenerator().then(render);
function render(html){
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', html);
  
}  
async function htmlGenerator(){
  await getData();
  let html = ''; 
  
  html =
    ` <figure class="recipe__fig">
          <img src=${recipe.imageUrl} alt=${recipe.title} class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>`

  return html;
  
}  