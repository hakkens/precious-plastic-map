export function getElement(id) {
  return document.getElementById(id)
}

export function createElement({ tag, cls, type, name, value, checked }) {
  const el = document.createElement(tag)

  cls.split(' ').forEach(elemCls => el.classList.add(elemCls))

  addAttribute(el, 'type', type)
  addAttribute(el, 'name', name)
  addAttribute(el, 'value', value)
  addAttribute(el, 'checked', checked)

  return el
}

export function addAttribute(el, attrType, attrVal) {
  return attrVal ? el.setAttribute(attrType, attrVal) : el
}

export function openNewWindow(url) {
  window.open(url, '_blank')
}
