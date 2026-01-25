// ==UserScript==
// @name        Better Luacomic
// @description Better Luacomic
// @version     1.0
// @author      Octihex
// @match       *://*luacomic.org/series/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=luacomic.org
// ==/UserScript==

AsyncQuerySelector('.grid-cols-1').then(element => {
    element.querySelectorAll('button').forEach(element => {
	    element.remove()
    })
})

/**
 * Asynchronously detect when the targeted element exists.
 *
 * @param   {String} Selector Selector used for the query.
 * @param   {boolean} QueryAll True to querySelectorAll.
 * @param   {Function} AdditionalChecksFunction A function to add checks for the queryed element.
 * @returns A promise when the element is found and the optional checks are true.
 */
function AsyncQuerySelector(Selector, QueryAll = false, AdditionalChecksFunction = () => true) {
    return new Promise((resolve) => {
        const Interval = setInterval(() => {
            const QueriedElement = QueryAll ? document.querySelectorAll(Selector) : document.querySelector(Selector)

            if (QueriedElement && AdditionalChecksFunction(QueriedElement)) {
                clearInterval(Interval)
                resolve(QueriedElement)
            }
        }, 100)
    })
}