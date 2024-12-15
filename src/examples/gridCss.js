/**
 * This is needed to save as a CSS example file
 *
 * If you know how to use .css file at runtime to create such text on the fly without too much effort, please let me know
 * @type {string}
 */
export const gridCss = `
.grid-output__background {
  background-color: #1c1e21;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-output__container {
  width: 100%;
  height: fit-content;
  position: relative;
  overflow: hidden;
}

.grid-output__container > .grid {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

/* Opacity-related group START */
.shown {
  opacity: 1;
}
.hidden {
  opacity: 0;
}

.shown.animated, .hidden.animated {
  animation-name: opacity-animation;
}

.shown.animated {
  opacity: 0;
  animation-direction: forwards;
}
.hidden.animated {
  opacity: 1;
  animation-direction: reverse;
}

@keyframes opacity-animation {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
/* Opacity-related group END */

/* Slide-related group START */
.slide > .grid > .row:nth-child(2n-1) {
  --offset: 550%;
}
.slide > .grid > .row:nth-child(2n) {
  --offset: -500%;
}

.slide > .grid > .row.animated {
  translate: var(--offset);
  animation-name: slide-animation;
}

@keyframes slide-animation {
  100% {
    translate: 0;
  }
}
/* Slide-related group END */
`;