// ==UserScript==
// @name        Nexus Auto Download
// @description Nexus Auto Download
// @version     1.0
// @author      Octihex
// @match       https://www.nexusmods.com/*mods/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=nexusmods.com
// ==/UserScript==

function findAndClickButton(slowButton) {
	slowButton.scrollIntoView({
		behavior: 'smooth',
		block: 'center'
	});

	// Wait a moment for the scroll to complete
	setTimeout(function() {
		// Click the button
		console.log('Clicking slow download button');
		slowButton.click();
	}, 1000);
}

/**
 * Asynchronously Detect when the targeted element exist.
 *
 * @param   {String} Selector Is used for the query.
 * @param   {boolean} QueryAll True to use querySelectorAll
 * @param   {String} OtherCheck Can be used to require more conditions before the element can be returned.
 * @returns A promise when the element is found and the optional checks are true.
 */
function AsyncQuerySelector(Selector, QueryAll=false, OtherCheck=true) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((MutationsList, Observer) => {
            for (const mutation of MutationsList) {
                if (mutation.type === 'childList') {
                    let element
                    if (QueryAll) {
                        element = document.querySelectorAll(Selector)
                    }
                    else {
                        element = document.querySelector(Selector)
                    }
                    if (element && eval(OtherCheck)) {
                        Observer.disconnect()
                        resolve(element)
                        return
                    }
                }
            }
        })

        observer.observe(document.body, {childList: true, subtree: true})
    })
}

AsyncQuerySelector('mod-file-download').then((element) => {
    console.log('Element content:', element);

    findAndClickButton(element.shadowRoot.querySelector("button"))
})