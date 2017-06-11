import { FILTERS, HASHTAGS } from './const'

export default function generateMarkerContent(data) {
  return `
    <div class="popup">
      ${generateImgSlideshow(data.imgs)}
      <div class="popup__text">
        <h2 class="popup__header">${data.name}</h2>
        <p class="popup__description">${data.description}</p>
        <ul class="popup__filters">
          ${data.filters.map(filter => `<li class="popup__filter">${FILTERS[filter]}</li>`).join('')}
        </ul>
        <p class="popup__status">${data.status}</p>
        <a href="${data.website}" class="popup__website">${data.website}</a>
        <ul class="popup__tags">
          ${data.hashtags.map(tag => `<li class="popup__tag">#${HASHTAGS[tag]}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}

function generateImgSlideshow(imgs) {
  const slides = imgs.map((img, i) => {
    const checked = (i === 0) ? 'checked' : ''
    const prev = (i === 0) ? imgs.length - 1 : i - 1
    const next = (i === imgs.length - 1) ? '0' : i + 1

    return `<input class="slides__input" type="radio" name="radio-btn" id="img-${i}" ${checked} />
      <li class="slides__container">
        <div class="slides__slide">
          <img class="slides__img" src="${img}" />
        </div>
        <div class="slides__nav">
          <label for="img-${prev}" class="slides__prev">&#x2039;</label>
          <label for="img-${next}" class="slides__next">&#x203a;</label>
        </div>
    </li>`
  })
  return `<ul class="slides">${slides.join('')}</ul>`
}
