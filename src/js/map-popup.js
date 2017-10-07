import { FILTERS_SINGULAR, STATUS } from './const'

export default function generateMarkerContent(data) {
  const contactURL = process.env.WP_LOGIN + encodeURIComponent('community/members/' + data.username)
  const website = data.website ? `<a href="${data.website}" class="popup__website" target="_blank">Website</a>` : ''
  const status = data.status === 'CLOSED' ? '' : `<p class="popup__status">${STATUS[data.status]}</p>`
  return `
    <div class="popup">
      ${generateImgSlideshow(data.imgs)}
      <div class="popup__text">
        <h2 class="popup__header">${data.name}</h2>
        <p class="popup__description">${data.description}</p>
        <ul class="popup__filters">
            <li class="popup__filter">
              <span class="popup__filtericon popup__filtericon-${data.filter.toLowerCase()}"></span>
              <p class="popup__filter-text">${FILTERS_SINGULAR[data.filter]}</p>
            </li>
        </ul>
        <div class="popup__column">
          ${status}
          ${website}
        </div>
        <div class="popup__column popup__column-right">
          <a href="${contactURL}" target="_blank" class="btn btn-primary">Say Hi</a>
        </div>
      </div>
    </div>
  `
}

function generateImgSlideshow(imgs) {
  const numImages = imgs.length

  if (!imgs || numImages === 0) {
    return ''
  }

  const slides = imgs.map((img, i) => {
    const checked = (i === 0) ? 'checked' : ''
    const prev = (i === 0) ? numImages - 1 : i - 1
    const next = (i === numImages - 1) ? '0' : i + 1
    const prevEl = (numImages > 1) ? `<label for="img-${prev}" class="slides__prev"></label>` : ''
    const nextEl = (numImages > 1) ? `<label for="img-${next}" class="slides__next"></label>` : ''

    return `<input class="slides__input" type="radio" name="radio-btn" id="img-${i}" ${checked} />
      <li class="slides__container">
        <div class="slides__slide">
          <img class="slides__img" src="${img}" />
        </div>
        <div class="slides__nav">
          ${prevEl}
          ${nextEl}
        </div>
    </li>`
  })
  return `<ul class="slides">${slides.join('')}</ul>`
}
