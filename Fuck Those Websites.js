// ==UserScript==
// @name         Fuck Those Websites
// @version      1.1
// @description  Redirect Certain URLs to Others
// @author       Octihex
// @match        *://*.redditmedia.com/*
// @match        *://*.x.com/*
// @match        *://*.patreon.com/*
// @match        *://*.old.reddit.com/*
// @match        *://*.bato.to/title/*
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
        window.location.href = `https://kemono.su/patreon/user/${document.scripts.__NEXT_DATA__.innerHTML.match(/"creator":{"data":{"id":"(\d+)","type":"user"}/)[1]}`;
        break;
    case "bato.to":
        window.location.pathname = `/series/${document.querySelector("meta[property='og:url']").content.split('/').at(-1)}`;
        break;
}