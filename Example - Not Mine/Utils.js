// A collection of usefull generic function and tools
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
    *   Asynchronously return targeted element when it exists and match the optional conditions.
    *   @example AsyncQuerySelector('#MyDivID').then(element => {
            console.log('Element exist: ', element)
        })
    *   @example AsyncQuerySelector('div.MyClass', true, element => {return element.length > 6}).then(element => {
            console.log('Elements exist and are more than 6: ', element)
        })
    *   @param   {String} Selector Selector used for the query.
    *   @param   {boolean} QueryAll True to querySelectorAll.
    *   @param   {Function} AdditionalChecksFunction A function to add checks for the queryed element.
    *   @returns A promise when the element is found and the optional checks are true.
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
 * @example RemoveQueryedElementFromParent(document.dody, '.lucide-timer')
 * 
 * @param   {Element} ParentElement The Parent element.
 * @param   {String} Selector To query the childrens.
 */
function RemoveQueryedElementFromParent(ParentElement, Selector) {
    [...ParentElement.children].forEach(element => {
        element.querySelector(Selector) ? element.remove() : false
    })
}