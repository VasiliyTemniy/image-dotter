/**
 * Switches html element's class A with B
 * @param {HTMLElement} element
 * @param {string} classNameA
 * @param {string} classNameB
 * @returns {void}
 */
export const switchClasses = (element, classNameA, classNameB) => {
  if (element.classList.contains(classNameA)) {
    element.classList.remove(classNameA);
    element.classList.add(classNameB);
  } else
  if (element.classList.contains(classNameB)) {
    element.classList.remove(classNameB);
    element.classList.add(classNameA);
  }
};