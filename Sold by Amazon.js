// ==UserScript==
// @name        Sold by Amazon
// @description Sold by Amazon
// @author      Octihex
// @version     1.2
// @icon        https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.amazon.fr&size=32
// @match       *://*.amazon.fr/*
// @match       *://*.amazon.de/*
// ==/UserScript==
'use strict'

let searchDiv = document.querySelector("div[id=nav-search]")
let site = window.location.hostname
let SoldByAmazonCode = ''

if (site == "www.amazon.fr"){
    SoldByAmazonCode = "A1X6FK5RDHNB96"
}

if (site == "www.amazon.de"){
    SoldByAmazonCode = "A3JWKAKR8XB7XF"
}

document.querySelector("form[id=nav-search-bar-form]").remove() // Delete the original searchbar

searchDiv.appendChild(
    Object.assign(document.createElement('input'), {
        id: 'Search Zone',
        placeholder: "Rechercher Amazon.fr",
        style: "width: 100%; margin-right: 0px; border: 0px; border-radius: 5px 0px 0px 5px; z-index: 3;"
    })
)

searchDiv.appendChild(
    Object.assign(document.createElement('input'), {
        id: 'Search Button',
        type: 'image',
        //src: "https://raw.githubusercontent.com/octihex/UserScripts/refs/heads/main/AmazonSearchIcon.png",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAoCAYAAABq13MpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAJpSURBVFhH7Zk9aFNRFMf/5mlqh9ZYxaEWYxGDoIIBFawugkOHil2Ubro4uHSJqyh0cDGLazcnURC/QBcRwQ9URIOKpVBDq40arMaEqqRt9P1f3pEMNdz77uvTC/kt6X3vXvjd03vOeXCX1e6c+IX/nJ/VBdx9+RnZqxPI5cuwQlqg/MDIY8T8sRWsjDvIDG6yS5rs377WPmlG2zpp0pKOipZ0VBg3l1eTZdx+8RUPxkoofKl6z7q74ti7JYH+HauxLdnpPQuTwNJuc8L5m5O4/LDoP1mcw33rMDyQhFupQiOQNIUzo8/xJD/vjSnGqKZ66lEdf1+Pvmxod+9yZI+nQxMPJH3uWj3CPAYjQ71/PQI8Oqcu5r1jw42dPJT035ihnYgUkQg2EyZ8xzmEa7g2DLSl+W8njJxKknEO5xJZa4q2NKsE4RlWRebKWlO0paWsSdKpIHNlrSlWNhdtaVYMwrKmisyVtaZoS7PTEZ2kkrmy1hRtaUkq1RLWWCJ1krcZ2tKNJYyNo5k433EOYVdUKZEqOKeP7jrj/63Mzs0JvH5bxNiHOVx/OoNv3+fR2R5DoqMNC25/ffOujAv3PuLslSlUfrg932W6VMOqdmDrBnPxJf9gYoTlG4VkDnbjyL71/igYgSJNHPdg9bmJtSfVgbYVDkqzc3+iyirRn17jCvbg2IGNXoQfjVe8d/w1jbjx97Qql+5PI3uj4I/MIq6diEGhIEUFboAbCUJk0iQs8UilyWLiukQuTRrFGzegSmSJGCb/JNKmtKSjoiUdBbzCsE6aF0ZWSTPKvOGyQpqyt5598m62cvkyfgOhPwYHb1WkTQAAAABJRU5ErkJggg==",
        style: 'margin-left: 0px;'
    })
)

let zone = searchDiv.querySelector("input[id='Search Zone']")
let button = searchDiv.querySelector("input[id='Search Button']")

button.onclick = filterSearch

function filterSearch() {
    window.location.href = `https://${window.location.hostname}/s?k=${encodeURIComponent(zone.value)}&emi=${SoldByAmazonCode}`
}