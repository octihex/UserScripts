// ==UserScript==
// @name        Load all Webtoons images
// @description Dowloads all the images on load instead of on scroll
// @icon        https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://webtoons.com&size=32
// @match       *://*.webtoons.com/en/*/viewer*
// @version     1.0
// ==/UserScript==
'use strict'

for (let element of document.getElementsByClassName('_images')) {
    element.src = element.getAttribute('data-url');
}