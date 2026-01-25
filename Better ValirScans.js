// ==UserScript==
// @name        Better ValirScans
// @description Better ValirScans
// @version     1.0
// @author      Octihex
// @match       https://valirscans.com/series/*
// @icon        https://wsrv.nl/?url=cdn.meowing.org/uploads/mxXEJgizs0j&amp;w=20
// @grant       GM_setClipboard
// ==/UserScript==

GM_setClipboard(document.querySelector('head > title').textContent, "text", () => console.log("Title copied to clipboard!"));