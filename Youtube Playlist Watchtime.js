// ==UserScript==
// @name        Youtube Playlist Watchtime
// @description Youtube Playlist Watchtime
// @version     1.0
// @author      Octihex
// @match       *://*.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=youtube.com
// ==/UserScript==
//'use strict'

let TimeStringArray = []
let DefaultPlaylistsNames = ['WL', 'LL']

/** @param {int} ms */
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

document.addEventListener('yt-navigate-finish', () => {
    //await delay(2000)
    let TotalVideosCount = 0
    if (DefaultPlaylistsNames.includes(window.location.href.match(/\?list=(.+)/)[1])) {
        InsertWatchtimeDiv(document.querySelector('yt-dynamic-sizing-formatted-string.ytd-playlist-header-renderer'))
        TotalVideosCount = GetExpectedVideosCount('Default')
    }
    else {
        InsertWatchtimeDiv(document.querySelector('.yt-page-header-view-model__page-header-title.yt-page-header-view-model__page-header-title--page-header-title-medium.yt-page-header-view-model__page-header-title--page-header-title-overlay.dynamicTextViewModelHost'))
        TotalVideosCount = GetExpectedVideosCount('Other')
    }



    AsyncQuerySelector('ytd-playlist-video-list-renderer #time-status', true, `element.length >= ${TotalVideosCount}`).then((element) => {
        console.log('Element content:', element);
    })



    document.querySelectorAll('ytd-playlist-video-list-renderer #time-status').forEach(element => {
        TimeStringArray.push(element.textContent.match(/\d+:\d+/)[0])
    })

    document.querySelector('#Total-Watchtime').textContent = addTimes(TimeStringArray)
})

/** @param {String} TimeString */
function ParseTime(TimeString) {
    return TimeString.split(':').map(Number).reverse()
}

/** @param {Array} TimeArray */
function addTimes(TimeArray) {
    let TotalMinutes = 0;
    let TotalSeconds = 0;

    // Iterate through the time array and accumulate total minutes and seconds
    TimeArray.forEach(time => {
        const [Seconds, Minutes, Hours] = ParseTime(time);

        TotalMinutes += (Hours ? Hours : 0) * 60
        TotalMinutes += Minutes
        TotalSeconds += Seconds

        // If seconds are 60 or more, adjust the minutes
        if (TotalSeconds >= 60) {
            TotalMinutes += Math.floor(TotalSeconds / 60);
            TotalSeconds %= 60;
        }
    });

    // Return the result formatted as HH:MM:SS
    return `${String(Math.floor(TotalMinutes / 60)).padStart(2, '0')} : ${String(TotalMinutes % 60).padStart(2, '0')} : ${String(TotalSeconds).padStart(2, '0')}`;
}

/** @param {Element} AnchorElementSelector */
function InsertWatchtimeDiv(AnchorElementSelector) {
    AnchorElementSelector.append(
        Object.assign(document.createElement('div'), {
            innerHTML: `
                <span id="Total-Watchtime" style="font-weight: 700; Display :flex;  align-items: center;  justify-content: center;" class="yt-dynamic-sizing-formatted-string yt-sans-28"></span>
            `
        }
    ))
}

function GetExpectedVideosCount(Mode) {
    let TotalVideosCount = ''

    if (Mode == 'Default') {
        TotalVideosCount = document.querySelector('.metadata-stats > yt-formatted-string > span').textContent
    }
    if (Mode == 'Other') {
        TotalVideosCount = Array.from(document.querySelector('#Total-Watchtime').parentElement.parentElement.nextElementSibling.querySelectorAll('.yt-content-metadata-view-model__delimiter')).at(-1).previousElementSibling.textContent.match(/(\d+)/)[1]
    }

    let UnavailableVideosCount = document.querySelector('ytd-alert-with-button-renderer')
    TotalVideosCount -= UnavailableVideosCount ? UnavailableVideosCount.innerText.match(/(\d+)/)[1] : 0

    return Number(TotalVideosCount)
}

// NOT WORKING !!!
function AreAllVideosLoaded(TotalVideosCount, callback) {
    const interval = setInterval(() => {
        const Nodelist = document.querySelectorAll('ytd-playlist-video-list-renderer #time-status');
        if (Nodelist.length == TotalVideosCount) {
            clearInterval(interval);
            callback(Nodelist);
        }
    }, 100);
}

/**
 * Asynchronously Detect when the targeted element exist.
 *
 * @param   {String} Selector Is used for the query.
 * @param   {boolean} QueryAll True to use querySelectorAll
 * @param   {String} OtherCheck Can be used to require more conditions before the element can be returned.
 * @returns A promise when the element is found and the optional checks are true.
 */
function AsyncQuerySelector(Selector, QueryAll=false, OtherCheck=true) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((MutationsList, Observer) => {
            for (const mutation of MutationsList) {
                if (mutation.type === 'childList') {
                    let element
                    if (QueryAll) {
                        element = document.querySelectorAll(Selector)
                    }
                    else {
                        element = document.querySelector(Selector)
                    }
                    if (element && eval(OtherCheck)) {
                        Observer.disconnect()
                        resolve(element)
                        return
                    }
                }
            }
        })

        observer.observe(document.body, {childList: true, subtree: true})
    })
}

// --- TODO ---
// Check if in playlist home or on a video
//     -- use window.ytPageType
// Add div for total watchtime
//     -- to playlist player on the video watchpage

// --- IDEAS ---
// On watchpage calculate remaining time from total playlist watchtime
//     -- try to calculate with already watched video time

// --- FINISHED ---
// Add div for total watchtime to playlist home | OK