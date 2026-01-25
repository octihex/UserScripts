// ==UserScript==
// @name         Fuck Those Websites
// @version      1.1
// @description  Redirect Certain URLs to Others
// @author       Octihex
// @match        *://*.redditmedia.com/*
// @match        *://*.x.com/*
// @match        *://*.patreon.com/*
// @match        *://*.old.reddit.com/*
// @match        *://*.kemono.cr/*
// @icon         https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @grant        none
// ==/UserScript==
'use strict';

switch (window.location.hostname.replace('www.', '')){
    case "redditmedia.com":
        window.location.hostname = "reddit.com";
        break;
    case "old.reddit.com":
        window.location.hostname = "reddit.com";
        break;
    case "x.com":
        window.location.hostname = "xcancel.com";
        break;
    case "patreon.com":
        ToKemono()
        break;
}

function ToKemono() {
    let CreatorID = ''

    if (typeof __next_f !== 'undefined') {
        CreatorID = __next_f.toString()
    }
    if (typeof __NEXT_DATA__ !== 'undefined') {
        CreatorID = __NEXT_DATA__.innerHTML
    }
    if (!CreatorID) {console.error('Unable to get creator ID')}

	window.addEventListener("load", () => {
        window.location.href = `https://kemono.cr/patreon/user/${CreatorID.match(/"creator":{"data":{"id":"(\d+)","type":"user"}/)[1]}`
	})
}