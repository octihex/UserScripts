// ==UserScript==
// @name         Quick Scan Search
// @version      1.1
// @description  Quick Scan Search
// @author       Octihex
// @match        *://*.bato.to/search*
// @icon         https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @grant        none
// ==/UserScript==

'use strict';

const ButtonStyle = 'position: relative; top: 0%; float: right; height: 48px; width: 59px; background: none; border: none;'

let scanSearchBtn = document.createElement('button')
let searchDiv = document.querySelector("div[class='mt-4 d-flex justify-content-between line-b-f']")
searchDiv.appendChild(scanSearchBtn)
scanSearchBtn.innerHTML = `<img src="https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png"/>`
scanSearchBtn.style.cssText = ButtonStyle
scanSearchBtn.onclick = ToDuckDuck

function ToDuckDuck() {
    window.location.href = `https://duckduckgo.com/?q=${document.location.href.replace(/.+?word=/, '')}+scan+eng`
}