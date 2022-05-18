const element = document.querySelector('.faqs')
element.addEventListener('click', (e) => {
  const clicked = e.target.closest('.faq__item')
  const items = document.querySelectorAll('.faq__item')
  for (const item of items) {
    if (item === clicked) continue
    item.classList.add('hide-answer')
  }
  if (clicked) {
    clicked.classList.toggle('hide-answer')
  }
})
