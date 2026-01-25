// ==UserScript==
// @name        WIP Better Tumblr
// @description WIP Better Tumblr
// @version     1.0
// @author      Octihex
// @match       *.tumblr.com/archive
// @icon        https://www.google.com/s2/favicons?sz=32&domain=tumblr.com
// ==/UserScript==

new MutationObserver(WIP_RemoveTextOnlyPosts).observe(document.body, {childList: true, subtree: true})

// TODO !!!
/** @param {MutationRecord} Mutations */
function WIP_RemoveTextOnlyPosts(Mutations) {
    Mutations.forEach(
        /** @param {MutationRecord} Mutation */
        function(Mutation) {
            Mutation.addedNodes.forEach(Node => {
                if (Node.matches?.('div.NGc5k')) {
                    if (IsOnlyTextPost(Node)) {
                        Node.remove()
                    }
                    AsSpanTextElement(Node)
                }
            })
        }
    )
}

// Callback when the target div is found
function IsOnlyTextPost(Element) {
    Element.querySelector('figure') ? true : false
}

function AsSpanTextElement(Element) {
    Element.querySelector('span')?.remove()
}