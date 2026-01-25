// ==UserScript==
// @name        Better AO3
// @description Better AO3
// @version     1.0
// @author      Octihex
// @match       https://archiveofourown.org/works/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=archiveofourown.org
// ==/UserScript==

const scrollingElement = (document.scrollingElement || document.body)
let SelectorArray = ['dd.status', 'dd.published', 'span.datetime']

scrollingElement.scrollTop = 0

/**
 * Format date from yyyy-mm-dd to dd-mm-yyyy
 * @param   {Element} Element Target of the formating
 * @returns {String}
 */
function FormatDate(Element) {
    return Element.textContent.match(/(\d+-\d+-\d+)/)[1].split('-').reverse().join('-')
}

SelectorArray.forEach(Selector => {
    document.querySelectorAll(Selector).forEach(Element => {
        Element.textContent = FormatDate(Element)
    })
})