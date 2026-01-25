// ==UserScript==
// @name        Bato Top Button
// @description Bato Top Button
// @version     1.0
// @author      Octihex
// @match       https://bato.to/chapter/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=bato.to
// ==/UserScript==

'use strict';

const ButtonDiv = document.querySelector('.fa-arrow-down').parentElement
const scrollingElement = (document.scrollingElement || document.body);

Object.assign(ButtonDiv, {
    style: 'rotate: 180deg',
    onclick: () => {
        scrollingElement.scrollTop = 0;
	}
})