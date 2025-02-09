import icons from 'url:../img/icons.svg';

export const timeout = function (s) {
  try{
  return new Promise(function (_, reject) {
    setTimeout(function () {
     reject('code 2');
    }, s * 1000);
  });
  }catch(err){
    throw err;
  }
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
export function prnt(a) {
  console.log(a);
}

export function generateSpinnerHtml() {
  return `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
}

export function errorHandler(result){
let errorMessage = '';
console.log(result[1]);
switch (result[1]){
  case 'code 1':
    errorMessage ='No recipes found for your query. Please try again!';
    break
  case 'code 2':
    errorMessage = 'Request has been terminated because it took too long';
    break
  default:
    errorMessage = 'Unable to process your request. Something went wrong';    

}

let html =
`<div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${errorMessage}</p>
</div>`;

return html;
}

export function roundToNearestQuarter(num) {
  let numToRound;
  let baseNum;
  if (num === 1) return num
  if (num<.25/2) return 'a hint of'
  if (num < 1) {
    numToRound = num;
    baseNum = 0;
  }
  if (num > 1) {
    numToRound = num % 1;

    baseNum = Math.round(num - numToRound);
  }
  console.log(baseNum, numToRound);
  if (numToRound < 0.25 / 2) return baseNum + 0;
  if (numToRound < 0.25 + 0.25 / 2) return baseNum + 0.25;
  if (numToRound < 0.5 + 0.25 / 2) return baseNum + 0.5;
  if (numToRound < 0.75 + 0.25 / 2) return baseNum + 0.75;

  return baseNum + 1;
}


export function generateBtnsHtml(currentPage, lastPage){

if (currentPage === 1){
   return generateNextBtnHtml(currentPage);
} 
   
if (currentPage === lastPage){
   return generatePrevBtnHtml(currentPage);
}

return  generatePrevBtnHtml(currentPage) + generateNextBtnHtml(currentPage);

}

function generatePrevBtnHtml(currentPage){

  let html =
          `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>`
            
  return html;
}

function generateNextBtnHtml(currentPage){

  let html =
          `<button class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
  
  return  html

}
          
export function makeSrchSelectionActive(htmlElement){
  for (i=0; i<htmlElement.length; i++){
    if(htmlElement[i].classList.contains('preview__link--active')){
      htmlElement[i].classList.remove('preview__link--active');
    };
    if(htmlElement[i].href === window.location.href){
      htmlElement[i].classList.add('preview__link--active');
    }

  }
}          

export function updateBookmarkIcon(htmlElement, array, object){
    
    const elementHref = htmlElement.children[0].children[0].href.baseVal;
    const bookmarker = '-fill';
       
    if (elementHref[elementHref.length-1] === 'l') {
      htmlElement.children[0].children[0].href.baseVal = elementHref.replaceAll(bookmarker, '');
      
      array.forEach((item, index) => {
        if (item.id === object.id){
         
          

          array.splice(index, 1);
          
        }
      });  
    }else{
         htmlElement.children[0].children[0].href.baseVal = elementHref + bookmarker;
         array.push(Object.assign({}, object));
          
    }
    
}