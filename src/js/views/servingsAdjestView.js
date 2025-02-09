import { roundToNearestQuarter } from "../helperFunctions";
import icons from 'url:../../img/icons.svg';


export function adjestServing(element1, element2, adjester){

    element1.textContent = +element1.textContent + adjester;
    console.log(element2);
    for (let i = 0; i < element2.length; i++){
        if (isFinite(+element2[i].textContent) && +element2[i].dataset.quant_per_serving != 0) {
          let quantPerServing = +element2[i].dataset.quant_per_serving;
          let newQuant = +element2[i].textContent + adjester * quantPerServing;
          element2[i].textContent = roundToNearestQuarter(newQuant);
        }    
    }
    
        
}

export function generateBookmarksHtml(bookmark){
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
    return html
}

// `<div class="message">
//                     <div>
//                       <svg>
//                         <use href="src/img/icons.svg#icon-smile"></use>
//                       </svg>
//                     </div>
//                     <p>
//                       No bookmarks yet. Find a nice recipe and bookmark it :)
//                     </p>
//                   </div>

//                   <!-- <li class="preview">
//                     <a class="preview__link" href="#23456">
//                       <figure class="preview__fig">
//                         <img src="src/img/test-1.jpg" alt="Test" />
//                       </figure>
//                       <div class="preview__data">
//                         <h4 class="preview__name">
//                           Pasta with Tomato Cream ...
//                         </h4>
//                         <p class="preview__publisher">The Pioneer Woman</p>
//                       </div>
//                     </a>
//                   </li> -->
//                 </ul>
//               </div>`