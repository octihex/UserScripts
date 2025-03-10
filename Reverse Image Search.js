// ==UserScript==
// @name        Reverse Image Search
// @description Reverse Image Search
// @author      Octihex
// @version     1.3
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @match       *://*/*
// @grant       GM_openInTab
// @grant       GM_addStyle
// ==/UserScript==
'use strict'

const ImagesExtensions = ['webp', 'png', 'jpg', 'jpeg'] // List of extensions we search for in the URL
const ButtonStyle = 'position: relative; top: 0%; float: right; z-index: 3; height: 32px; width: 32px; margin-top: 1px; margin-right: 1px; display: inline-block; background: none; border: none;' // Bunch of CSS property to be applied to the button element

// In the URL - split at every '.' char - select last split - split again at every '=' or '&' or '?' - select first split.
// Then check if the any string in ImagesExtensions is included in the result of the operation above.
if (ImagesExtensions.some(v => location.href.split('.').at(-1).split(/[=&\?]/).at(0) === v)) {
    addButton(Google, 'google.com')
    addButton(TinEye, 'tineye.com')
    addButton(Yandex, 'yandex.com')
    addButton(SauceNAO, 'saucenao.com')
    addButton(IQDB, 'iqdb.org')
    GM_addStyle("button img {height: 100%; width: 100%") // Select every body>button element - select the img element and adds CSS properties, the 100% is to make sure the icon is the same size as the button.
}

// Take 2 arguments - a function to call when the button is clicked, a domain for the icon of the button.
// Create a button element - add it to the page - give the button the icon URL - add the CSS from ButtonStyle - set the function provided to execute when the button is clicked.
function addButton(TargetFunc, IconUrl) {
    let button = document.createElement('button')
    document.body.appendChild(button)
    button.innerHTML = `<img src="${GetIcon(IconUrl)}"/>`
    button.style.cssText = ButtonStyle
    button.onclick = TargetFunc
    return button
}

function Google() {
    //GM_openInTab(`https://www.google.com/imghp?sbi=1#habibi=${encodeURIComponent(location.href)}`)
    GM_openInTab(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(location.href)}`)
}

function TinEye() {
    GM_openInTab(`https://tineye.com/search?url=${encodeURIComponent(location.href)}`)
}

function Yandex() {
    GM_openInTab(`https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(location.href)}`)
}

function SauceNAO() {
    GM_openInTab(`https://saucenao.com/search.php?url=${encodeURIComponent(location.href)}`)
}

function IQDB() {
    GM_openInTab(`http://iqdb.org/?url=${encodeURIComponent(location.href)}`)
}

// Invoke a webpage from a Google service to get the website icon
function GetIcon(DomainUrl) {
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${DomainUrl}&size=32`
}