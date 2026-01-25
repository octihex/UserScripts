// ==UserScript==
// @name         FUCK YOUTUBE
// @version      2.0
// @description  Collection of scripts to moddify Youtube functionnality
// @author       Octihex
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=youtube.com
// ==/UserScript==

// Add , and ; for frame move with AZERTY keyboard
// ORIGINAL https://github.com/Ozdalu/yt-azerty-shortcuts-fixer/blob/main/yt-azerty-fix.js

const keyRemapping = new Map()
keyRemapping.set(59, 190)

function keyUpping(original, faked) {
    document.addEventListener('keyup', (ev) => {
        // Avoids recursion
        if (ev.keyCode != original) return

        document.dispatchEvent(new KeyboardEvent("keyup", {'keyCode': faked}))
    })
    return true
}

document.addEventListener('keydown', (e) => {
    e.preventDefault
    const el = document.activeElement.id
    if (el == "search" || el == "contenteditable-root") return

    // Stops if not a key that has to be fixed
    e = e || window.event;
    if (!keyRemapping.has(e.keyCode)) return

    do {
        document.dispatchEvent(new KeyboardEvent("keydown", {'keyCode': keyRemapping.get(e.keyCode)}))
    }
    while (!keyUpping(e.keyCode, keyRemapping.get(e.keyCode)))
})