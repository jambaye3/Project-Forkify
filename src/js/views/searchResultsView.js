import icons from 'url:../../img/icons.svg';
import { errorHandler } from '../helperFunctions';
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

