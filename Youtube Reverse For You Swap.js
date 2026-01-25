// ==UserScript==
// @name         Youtube Reverse For You Swap
// @description  Youtube Reverse For You Swap
// @version      1.0
// @author       Octihex
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=youtube.com
// ==/UserScript==

function AsyncQuerySelector(Selector, QueryAll = false, AdditionalChecksFunction = () => true) {
    return new Promise((resolve) => {
        const Interval = setInterval(() => {
            const QueriedElement = QueryAll ? document.querySelectorAll(Selector) : document.querySelector(Selector)
            console.log(QueriedElement)

            if (QueriedElement && AdditionalChecksFunction(QueriedElement)) {
                clearInterval(Interval)
                resolve(QueriedElement)
            }
        }, 100)
    })
}

AsyncQuerySelector('#guide-renderer > #sections', false, element => {return element.childElementCount > 3}).then((element) => {
    let Sidepanel = element.childNodes
    let Tempvar = Sidepanel[1]

    Sidepanel[1].replaceWith(Sidepanel[2])
    Sidepanel[2].replaceWith(Tempvar)
})