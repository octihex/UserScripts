// ==UserScript==
// @name         Quick Scan Search
// @version      1.2
// @description  Quick Scan Search
// @author       Octihex
// @match        *://*.bato.to/search*
// @icon         https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @grant        none
// ==/UserScript==

'use strict';

document.querySelector("div[class='mt-4 d-flex justify-content-between line-b-f']").appendChild(
    Object.assign(document.createElement('button'), {
        innerHTML: '<img src="https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png"/>',
        style: 'position: relative; top: 0%; float: right; height: 48px; width: 59px; background: none; border: none;',
        onclick: () => `https://duckduckgo.com/?q=${document.location.href.replace(/.+?word=/, '')}+scan+eng`
    })
)