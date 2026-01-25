// ==UserScript==
// @name         YouTube Original Titles and Descriptions (Cancel Translation)
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  Reverts titles and descriptions on Youtube to original language
// @author       raz0r
// @match        https://www.youtube.com/watch?*
// @grant        none
// ==/UserScript==

window.ytInitialData.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.title.simpleText = window.ytInitialPlayerResponse.videoDetails.title;
window.ytInitialData.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.description.simpleText = window.ytInitialPlayerResponse.videoDetails.shortDescription;