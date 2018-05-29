/* eslint-disable import/prefer-default-export */

export function findElementByText(selector, text) {
  const els = document.querySelectorAll(selector);
  return Array.prototype.filter.call(els, el =>
    RegExp(text).test(el.textContent));
}
