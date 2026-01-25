// ==UserScript==
// @name        Better Bato
// @description Better Bato
// @version     1.4
// @author      Octihex
// @match       https://bato.to
// @grant       GM_xmlhttpRequest
// @connect     bato.to
// @icon        https://www.google.com/s2/favicons?sz=32&domain=bato.to
// ==/UserScript==

'use strict';

// Array function, number of elements in array
const China_Hide = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHzSURBVFhHzZixSsNAGID/S9OGasRqoSAIKuIijoKLg4ujr+DgC+jqCziLi4Mv4Qv4Bjo5CuJQcRBrQWlrm6bmP+7KXXOX3CWp9YOS9M/f+7/8d5fSEgAYRS9Ka3WLnc2W5eYTOwOQBDlJosQfAvFGEH64LFIcohjHYUcJmlgO2TsZd68LC7dNcNb7LFIMKjmERN2iHdQlTHbT3e0AWQxhcOezSD7S6o4FEVNJDsoiwf0cPdpiUk8S9I7b4DQCqJ59soiMJBotgeppC0g9hM55gwXNsGmEJIgbwL9+A/egCwS3jwJxEFyH4Wu0WQbKpRxDJ4ao5BBJkFN7eAbSGNJzE1ETbJcPJ3brpZ0e3QQ/NzUIX8rQvVxiV2SwIOY69YBF1GBeVjkk1sHK0RcEj14kV6FT7p20oXdVp9e0hTY2ldOcR4yjnOIkTIrqchAbOcRaEB8tpe0+zF+8s4gZtmIcs+0n4KwMoXL4De39NRZJJ6scYt1BBDeG+F1cxFrTkUmQk7TWRPKIWk8xgmKmcohN7iTWgknFsFO6btneFMd4itPEVOg+YzPlRoJZ5ETyiCYK5hUTySqpFSxielTYjhvbJDjAtOQQ3Ri6muMO6hKQIsRUmDSCdnAWcohJN5U/O5FpiqnQNUn5oP5rOURX85//swDwC5LA5NizWjO7AAAAAElFTkSuQmCC'
const China_Show = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAMAAAA5zj1cAAAAPFBMVEXuHCX7vwn2ihLvKCLuISP3kBHwLyHyUBv//wDwPB/1ehX+6QP4mhD/+AH0aRjxSB3zXxn93wX6twv4ow8RlrKKAAAAYElEQVQYGe3BSRKDMAwAwfEqCRO2/P+vKcMZrMqZbv6SKiOZbtuNgUgnGyNNuIhwbyqzhhIrkMuXeymoahM6yzxpqoLD+pn3wmmtPFiMFOnycWRczHCQCZ8lGD6V18vvB1TDAfeeO4a7AAAAAElFTkSuQmCC'
const R18_Hide = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADMSURBVEhL7ZXhDoMgDISp8P5PTNh2CMbMFtpGlizx+2OVQs8rIr0+BCuYQXtIRCGlFHLO9f68HMYkep5PQIMrcCw8KN5B7tZiM6MCmuIAeWYBmKQtcEYy2u3AXTwCzALQS8tOn+ES0K/SxrKwpAWcMM4t5JkFaG2fudPHsZrax+9FpbcCGqEuBzqllBZd0bqEPPe/oKrfrvrxXHKGe75kE1pY0gILbgHaPs/43xbcxSPgZwKkTesWMPoMtWdbPcxabCbG2CKemYh9PIQ3VEliEY/LcRsAAAAASUVORK5CYII='
const R18_Show = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAm0lEQVR42u2V2wrAIAiGK3r/F65sdLO5wTx08iZBCDL9EvtzzrnKeUqpvgyeZduPMd6x2KicKIYH+CamCkiK41gxgPR20uLIdQC9McTZKUkOwD4APITe+/0AAMA+w2EAqr0SgOk68Ge9WqFWwh6AoQ6EENj/oJSyTgkl7W2zYPoMzQFyzrYA2hk4AAfAHGC6EDVlXCbFo0Kk+YwuC6Dp/EtgNWMAAAAASUVORK5CYII='
const Button_Style = 'width: 32px; height: 24px; border: none; background: none; display: block; margin-bottom: 5px;'
const Language_Filter = /Chinese/
const R18_Filter = /Hentai|Netorare/

let BotDiv = document.querySelector('div[class=back-to-top-bot]')
let PopularSeriesList = document.getElementsByClassName('home-popular')[0].children
let SeriesList = document.querySelectorAll('div[id=series-list] > div')
let ReviewList = document.querySelectorAll('.post-items > div')
let R18_ElementsArray = []
let China_ElementsArray = []

for (let element of PopularSeriesList) {
    let Item_Title = element.getElementsByClassName('item-title')[0]

    GM_xmlhttpRequest({
        method: 'GET',
        url: Item_Title.href,
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept-Language': 'en-US,en;q=0.5'
        },
        onload: r => {
            if (r && r.status === 200) {
                let ResponceDocument = new DOMParser().parseFromString(r.responseText, 'text/html')
                let ResponceArray = Array.from(ResponceDocument.querySelectorAll('b[class=text-muted]'))

                if (Language_Filter.test(ResponceArray.filter(item => item.innerText == 'Original language:')[0].nextElementSibling.textContent)) {
                    Item_Title.style.color = 'red'
                    China_ElementsArray.push(element)
                    element.hidden = true
                }
                else if (R18_Filter.test(ResponceArray.filter(item => item.innerText == 'Genres:')[0].nextElementSibling.textContent)) {
                    Item_Title.style.color = 'orange'
                    R18_ElementsArray.push(element)
                    element.hidden = true
                }
            }
        },
    });
}



HideOnPage(SeriesList, 'div[class=item-genre]')
HideOnPage(ReviewList, '.text-xs')

function HideOnPage(Nodelist, SelectorString) {
    for (let element of Nodelist) {
        let GenresList = element.querySelector(SelectorString)

        if (Language_Filter.test(GenresList.textContent)) {
            GenresList.style.color = 'red'
            China_ElementsArray.push(element)
            element.hidden = true
        }
        else if (R18_Filter.test(GenresList.textContent)) {
            GenresList.style.color = 'orange'
            R18_ElementsArray.push(element)
            element.hidden = true
        }
    }
}

// String, String, String, Array
function ReverseHidden(ID, Hide, Show, Array) {
    let Button = document.getElementById(ID)

    if (Button.name == 'On') {
        Button.name = "Off"
        Button.src = Hide
    }
    else {
        Button.name = "On"
        Button.src = Show
    }

    Array.forEach(element => {
        element.hidden = !element.hidden
    });
}

Object.assign(BotDiv, {
    style: 'opacity: 1;',
    innerHTML: ''
})

BotDiv.prepend(
    Object.assign(document.createElement('input'), {
        id: 'ReverseChina',
        type: 'image',
        name: 'On',
        src: China_Show,
        style: Button_Style,
        onclick: () => ReverseHidden('ReverseChina', China_Hide, China_Show, China_ElementsArray)
    })
)

BotDiv.prepend(
    Object.assign(document.createElement('input'), {
        id: 'ReverseR18',
        type: 'image',
        name: 'On',
        src: R18_Show,
        style: Button_Style,
        onclick: () => ReverseHidden('ReverseR18', R18_Hide, R18_Show, R18_ElementsArray)
    })
)