// ==UserScript==
// @name        Youdate
// @description Youdate
// @version     1.0
// @author      Octihex
// @match       https://www.youtube.com/*
// @grant       GM_xmlhttpRequest
// @connect     googleapis.com
// @icon        https://www.google.com/s2/favicons?sz=32&domain=youtube.com
// ==/UserScript==
'use strict';

const Script_DEBUG = false

const Mois = {
    '01': 'janvier',
    '02': 'février',
    '03': 'mars',
    '04': 'avril',
    '05': 'mai',
    '06': 'juin',
    '07': 'juillet',
    '08': 'août',
    '09': 'septembre',
    '10': 'octobre',
    '11': 'novembre',
    '12': 'décembre'
};

const GlobalDelay = 150

/** @param {int} ms */
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

document.addEventListener('yt-navigate-finish', () => {
    let Container = document.getElementById("page-manager")
    const GlobalObserverArgs = [Container, {childList: true, subtree: true}]
    PrintDebugLog(window.location.pathname)
    PrintDebugLog(Container)

    switch (window.location.pathname) {
        case '/':
            new MutationObserver(OnHomePage).observe(...GlobalObserverArgs);
            break;
        case '/results':
            new MutationObserver(OnSearchPage).observe(...GlobalObserverArgs);
            break;
        case '/watch':
            new MutationObserver(OnWatchPage).observe(...GlobalObserverArgs);
            break;
        //case /\/.+?\/videos/.test(window.location.pathname):
            //new MutationObserver(OnChannelPage).observe(...GlobalObserverArgs);
            //break;
        case '/playlist':
            new MutationObserver(OnPlaylistPage).observe(...GlobalObserverArgs);
            break;
        default:
            if (window.location.pathname.match(/(shorts)\/.+/)[1] == 'shorts') {
                new MutationObserver(disableShortLooping).observe(Container, {attributeFilter: ["loop"], childList: true, subtree: true});
            }
    }
})

/**
 * Check if the element provided is a members only video.
 * @param   {Element} Element Is used for the query.
 * @returns {boolean} Delete Element if true
 */
function IsMemberOnly(Element) {
    if (Element.querySelector('.yt-badge-shape--membership')) {
        Element.remove()
        return true
    }
    return false
}

const disableShortLooping = () => {
    document.querySelector("#shorts-player video")?.removeAttribute("loop");
}

function PrintDebugLog(Debug_String) {
    if (!Script_DEBUG) {return}
    console.log(Debug_String)
}

/**
* @param {Node} YT_Container
* @param {Function} PassedFunction
*/
function GetPublishedDate(YT_Container, PassedFunction) {
    if (IsMemberOnly(YT_Container)) {return}
    let [VideoID, TargetElement] = PassedFunction(YT_Container)

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VideoID}&key=AIzaSyBHL7yZbtKWPau4TjfQIhaBHLqx2zS7TDg`,
        headers: {'Sec-Fetch-Mode': 'cors'},
        /** @param {Response} response */
        onload: response => {
            if (response && response.status === 200) {
                let PublishedDate = JSON.parse(response.responseText).items[0].snippet.publishedAt.match(/(\d{4})-(\d{2})-(\d{2})/)[0].split('-').reverse();
                TargetElement.textContent += `${PublishedDate[0]} ${Mois[PublishedDate[1]]} ${PublishedDate[2]}`
            }
        }
    });
}

// TODO !!!
/** @param {MutationRecord} Mutations */
function OnPlaylistPage(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(
                async function(Node) {
                    if (Node.nodeName == "YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER") {
                        PrintDebugLog(Node)
                        await delay(GlobalDelay)
                        GetPublishedDate(Node, OnPlaylistPage_Videos)
                    }
                }
            );
        }
    );
}

// TODO !!!
/** @param {MutationRecord} Mutations */
function OnChannelPage(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(
                async function(Node) {
                    if (Node.nodeName === 'YTD-VIDEO-RENDERER') {
                        await delay(GlobalDelay)
                        GetPublishedDate(Node, OnSearchPage_Videos)
                    }
                    else if (Node.nodeName === 'GRID-SHELF-VIEW-MODEL') {
                        await delay(GlobalDelay)
                        Node.querySelectorAll('.ytGridShelfViewModelGridShelfItem').forEach(element => {
                            GetPublishedDate(element, OnMultiplePages_Shorts)
                        })
                    }
                }
            );
        }
    );
}

/** @param {MutationRecord} Mutations */
function OnSearchPage(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(
                async function(Node) {
                    if (Node.nodeName === 'YTD-VIDEO-RENDERER') {
                        await delay(GlobalDelay)
                        GetPublishedDate(Node, OnSearchPage_Videos)
                    }
                    else if (Node.nodeName === 'GRID-SHELF-VIEW-MODEL') {
                        await delay(GlobalDelay)
                        Node.querySelectorAll('.ytGridShelfViewModelGridShelfItem').forEach(element => {
                            GetPublishedDate(element, OnMultiplePages_Shorts)
                        })
                    }
                }
            );
        }
    );
}

/** @param {MutationRecord} Mutations */
function OnHomePage(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(
                async function(Node) {
                    if (Node.nodeName === 'YTD-RICH-ITEM-RENDERER') {
                        await delay(GlobalDelay)
                        try {
                            GetPublishedDate(Node, OnMultiplePages_Videos)
                        } catch (error) {
                            console.log(Node)
                        }
                    }
                    else if (Node.nodeName === 'YTD-RICH-SECTION-RENDERER') {
                        await delay(GlobalDelay)
                        Node.querySelector('#contents').querySelectorAll('ytd-rich-item-renderer').forEach(element => {
                            if (element.hasAttribute('Youdate-DONE')) {return}
                            else {element.setAttribute('Youdate-DONE', '')}
                            GetPublishedDate(element, OnMultiplePages_Shorts)
                        })
                    }
                }
            );
        }
    );
}

/** @param {MutationRecord} Mutations */
function OnWatchPage(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(
                async function(Node) {
                    if (Node.nodeName === 'YT-LOCKUP-VIEW-MODEL') {
                        await delay(GlobalDelay)
                        try {
                            GetPublishedDate(Node, OnMultiplePages_Videos)
                        } catch (error) {
                            console.log(Node)
                        }
                    }
                    else if (Node.nodeName === 'YTD-REEL-SHELF-RENDERER') {
                        await delay(GlobalDelay)
                        Node.querySelector('#items').childNodes.forEach(element => {
                            if (element.hasAttribute('Youdate-DONE')) {return}
                            else {element.setAttribute('Youdate-DONE', '')}
                            GetPublishedDate(element, OnMultiplePages_Shorts)
                        })
                    }
                }
            );
        }
    );
}

/** @param {Element} Element */
function OnPlaylistPage_Videos(Element) {
    Element = Element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    if (Element.nodeName != "YTD-PLAYLIST-VIDEO-RENDERER") {return}

    let MetadataElement = Element.querySelector('#video-info')
    MetadataElement.textContent = ''

    return [
        /\?v=(.+)/.exec(Element.querySelector("a[id=thumbnail]").href)[1],
        MetadataElement
    ]
}

/** @param {Element} Element */
function OnSearchPage_Videos(Element) {
    let MetadataElement = Element.querySelectorAll('.inline-metadata-item')
    if (MetadataElement.length < 2) {
        MetadataElement[0].parentElement.append(
            Object.assign(MetadataElement[0].cloneNode(), {
                textContent: ''
            })
        )
        MetadataElement = Element.querySelectorAll('.inline-metadata-item')
    }
    else {
        MetadataElement[1].textContent = ''
    }
    return [
        /\?v=(.+)&/.exec(Element.querySelector("a[id=thumbnail]").href)[1],
        MetadataElement[MetadataElement.length - 1]
    ]
}

/** @param {Element} Element */
function OnMultiplePages_Videos(Element) {
    let MetadataElement = Element.querySelector(".yt-content-metadata-view-model__delimiter").previousElementSibling

    MetadataElement.nextElementSibling.remove()
    MetadataElement.nextElementSibling.remove()

    MetadataElement.textContent += ' • '

    return [
        /\?v=(.+)/.exec(Element.querySelector(".yt-lockup-metadata-view-model__title").href)[1],
        MetadataElement
    ]
}

/** @param {Element} Element */
function OnMultiplePages_Shorts(Element) {
    let MetadataElement = Element.querySelector('.shortsLockupViewModelHostOutsideMetadataSubhead').firstChild

    MetadataElement.parentElement.append(
        Object.assign(MetadataElement.cloneNode(), {
            textContent: ' • '
        })
    )
    MetadataElement = Element.querySelector('.shortsLockupViewModelHostOutsideMetadataSubhead').lastChild

    return [
        /shorts\/(.+)/.exec(Element.querySelector('.shortsLockupViewModelHostEndpoint').href)[1],
        MetadataElement
    ]
}

// --- TODO ---
// Add playlists page
// Add YT channels page
// Fusion the functions to reduce lignes number

// --- IDEAS ---
// Create a GetContainer function should the container not be 'page-manager'
// Change the MetadataElement.parentElement.append for a new span element and not a cloned one

// --- FINISHED ---
// Script not working for videos ? --- Youtube changed their naming scheme for the class identifier | Updated script to new class names
// Extreme page lag ????? | Fixed recursion error
// Adapt script for homepage | OK
// Get Short views.textContent = views.textContent + date | Changed to cloning the span element and modifying the textContent
// Change OnSearchPage_Shorts by adding a cloned span element for the date | OK
// Fix view + date not displaying correctly | OK
// Adapt script for watchpage | OK