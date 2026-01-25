// ==UserScript==
// @name        Better AsuraComic
// @description Better AsuraComic
// @version     1.0
// @author      Octihex
// @match       *://*.asuracomic.net/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=asuracomic.net
// ==/UserScript==

AsyncQuerySelector('.style_scrollToTop__nenBE').then(async (element) => {
    let TargetDIV = document.querySelector('.style_scrollToTop__nenBE')
    let CSS_Text = await GetCSSClassRules('.style_scrollToTop__nenBE')
    let NewButtonDIV = Object.assign(document.createElement('div'), {
        id: 'ScrollingButtons',
        style: CSS_Text + 'opacity:1; visibility:visible; cursor:pointer; bottom: 220px; width: 32px; height: 32px'
    })

    NewButtonDIV.append(
        Object.assign(document.createElement('input'), {
            type: 'image',
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA6/AAAOvwE4BVMkAAABZUlEQVR42mMQEhJiIAZLisgy2CvFMsTrTvxfYbbzf7v15f8T7B6AMYgNEgPJgdSA1BJrLkEFGlLmYEtBFk20f0QUBqkF6QHppcgB4VotRFuKC4PMINkBIJeDgpRSy2EYZBau0MAQMJB1ZgDFKbUsh2GQmSCz8ToA5EpaWI7sCPSQQOFQM9jxRQdWB1AjwZGTMOFBTy/LYRgWFWAClGfp7QCQnWAHgEotUgoZamGQnSC7wcUrvS2HYZDdFAX/0qTnYExJNJCd9Vakv/j/9vlPMAaxyc2SZBU8q/Nf/P/w5tf/VTkvwRjEXlPwkqyCieQEuKH81f+P7379X5GB8DWIDRLbWPmK5IRIkgN2tLwB+3ZpMmaQL0+DhMr2ptekOYCUKAA5YHEC7kS3JPE5SQ4ARwE9yn+8iXAgSkGUbDjgBdGAF8UDXhkNiup4wBskg6JJNigapQPeLB8UHZNB0TUbNJ1TenTPAQmguwCIlrISAAAAAElFTkSuQmCC',
            style: 'height: 100%; width: 32px; background: none; border: none; margin-bottom: 25px;',
            onclick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        })
    )

    NewButtonDIV.append(
        Object.assign(document.createElement('input'), {
            type: 'image',
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA6/AAAOvwE4BVMkAAABZUlEQVR42mMQEhJiIAZLisgy2CvFMsTrTvxfYbbzf7v15f8T7B6AMYgNEgPJgdSA1BJrLkEFGlLmYEtBFk20f0QUBqkF6QHppcgB4VotRFuKC4PMINkBIJeDgpRSy2EYZBau0MAQMJB1ZgDFKbUsh2GQmSCz8ToA5EpaWI7sCPSQQOFQM9jxRQdWB1AjwZGTMOFBTy/LYRgWFWAClGfp7QCQnWAHgEotUgoZamGQnSC7wcUrvS2HYZDdFAX/0qTnYExJNJCd9Vakv/j/9vlPMAaxyc2SZBU8q/Nf/P/w5tf/VTkvwRjEXlPwkqyCieQEuKH81f+P7379X5GB8DWIDRLbWPmK5IRIkgN2tLwB+3ZpMmaQL0+DhMr2ptekOYCUKAA5YHEC7kS3JPE5SQ4ARwE9yn+8iXAgSkGUbDjgBdGAF8UDXhkNiup4wBskg6JJNigapQPeLB8UHZNB0TUbNJ1TenTPAQmguwCIlrISAAAAAElFTkSuQmCC',
            style: 'height: 100%; width: 32px; background: none; border: none; rotate: 180deg;',
            onclick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        })
    )

    TargetDIV.parentElement.insertBefore(NewButtonDIV, TargetDIV.nextElementSibling)
    TargetDIV.remove()
})

AsyncQuerySelector('.grid-cols-1').then(Parent => {
    RemoveQueryedElementFromParent(Parent, '.lucide-timer')
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

/**
 * Extract the provided CSStext from a stylesheets.
 *
 * @param   {String} CSSRuleName The name of the CSS rule.
 * @returns A promise with the CSStext extracted from a stylesheet.
 */
function GetCSSClassRules(CSSRuleName) {
    return new Promise((resolve) => {
        [...document.styleSheets].forEach(StyleSheet => {
            let Rule = [...StyleSheet.cssRules].find(Rule => Rule.selectorText == CSSRuleName)
            Rule ? resolve(Rule.cssText.match(/(?<={ )(.*)(?= })/)[1]) : false
        })
        return
    })
}

/**
 * Remove elements from a parent if the Selector returns true.
 *
 * @param   {Element} ParentElement The Parent element.
 * @param   {String} Selector To query the childrens.
 */
function RemoveQueryedElementFromParent(ParentElement, Selector) {
    [...ParentElement.children].forEach(element => {
        element.querySelector('.lucide-timer') ? element.remove() : false
    })
}