// ==UserScript==
// @name        Force Youtube HD
// @description Force Youtube HD
// @author      Octihex
// @version     1.0
// @match       https://*.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=youtube.com
// @noframes
// ==/UserScript==
// ORIGINAL https://gist.github.com/adisib/1e6b429b9bb630fceb170f3fa77c57a3

(function() {
    "use strict";

    let settings = {
        changeResolution: true,
        targetRes: "hd1080",
        highFramerateTargetRes: null,
        flushBuffer: true,
        setResolutionEarly: true,
        useAPI: true
    };

    const resolutions = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

    let doc = document;
    let win = window;
    let recentVideo = "";
    let foundHFR = false;

    function unwrapElement(el) {
	    if (el && el.wrappedJSObject) {
	        return el.wrappedJSObject;
	    }

	    return el;
    }

    // Get video ID from the currently loaded video (which might be different than currently loaded page)
    function getVideoIDFromURL(ytPlayer) {
        const idMatch = /(?:v=)([\w\-]+)/;
        let id = "ERROR: idMatch failed; youtube changed something";
        let matches = idMatch.exec(ytPlayer.getVideoUrl());
        if (matches) {
            id = matches[1];
        }

        return id;
    }

    // Attempt to set the video resolution to desired quality or the next best quality
    function setResolution(ytPlayer, resolutionList) {
        const currentQuality = ytPlayer.getPlaybackQuality();
        let res = settings.targetRes;

        if (resolutionList.indexOf(res) < resolutionList.indexOf(currentQuality)) {
            const end = resolutionList.length - 1;
            let nextBestIndex = Math.max(resolutionList.indexOf(res), 0);
            let ytResolutions = ytPlayer.getAvailableQualityLevels();

            while ((ytResolutions.indexOf(resolutionList[nextBestIndex]) === -1) && nextBestIndex < end) {
                ++nextBestIndex;
            }

            if (settings.flushBuffer && currentQuality !== resolutionList[nextBestIndex]) {
                let id = getVideoIDFromURL(ytPlayer);

                if (id.indexOf("ERROR") === -1) {
                    ytPlayer.loadVideoById(id, ytPlayer.getCurrentTime(), resolutionList[nextBestIndex]);
                }
            }

            res = resolutionList[nextBestIndex];
        }

        if (settings.useAPI) {
            if (ytPlayer.setPlaybackQualityRange !== undefined) {
                ytPlayer.setPlaybackQualityRange(res);
            }

            ytPlayer.setPlaybackQuality(res);
        }
    }

    // Set resolution, but only when API is ready (it should normally already be ready)
    function setResOnReady(ytPlayer, resolutionList) {
        if (settings.useAPI && ytPlayer.getPlaybackQuality === undefined) {
            win.setTimeout(setResOnReady, 100, ytPlayer, resolutionList);
        }
        else {
            let framerateUpdate = false;
            if (settings.highFramerateTargetRes) {
                let features = ytPlayer.getVideoData().video_quality_features;
                if (features) {
                    let isHFR = features.includes("hfr");
                    framerateUpdate = isHFR && !foundHFR;
                    foundHFR = isHFR;
                }
            }

            let curVid = getVideoIDFromURL(ytPlayer);
            if ((curVid !== recentVideo) || framerateUpdate) {
                recentVideo = curVid;
                setResolution(ytPlayer, resolutionList);

                let storedQuality = localStorage.getItem("yt-player-quality");
                if (!storedQuality || storedQuality.indexOf(settings.targetRes) === -1) {
                    let tc = Date.now(), te = tc + 2592000000;
                    localStorage.setItem("yt-player-quality","{\"data\":\"" + settings.targetRes + "\",\"expiration\":" + te + ",\"creation\":" + tc + "}");
                }
            }
        }
    }

    function main() {
        let ytPlayer = doc.getElementById("movie_player") || doc.getElementsByClassName("html5-video-player")[0];
        let ytPlayerUnwrapped = unwrapElement(ytPlayer);

        if (settings.changeResolution && settings.setResolutionEarly && ytPlayerUnwrapped) {
            setResOnReady(ytPlayerUnwrapped, resolutions);
        }

        if (settings.changeResolution) {
            win.addEventListener("loadstart", function(e) {
                if (!(e.target instanceof win.HTMLMediaElement)) {return}

                ytPlayer = doc.getElementById("movie_player") || doc.getElementsByClassName("html5-video-player")[0];
                ytPlayerUnwrapped = unwrapElement(ytPlayer);

                if (ytPlayerUnwrapped) {
                    if (settings.changeResolution) {
                        setResOnReady(ytPlayerUnwrapped, resolutions);
                    }
                }
            }, true);
        }

        win.removeEventListener("yt-navigate-finish", main, true);
    }

    main();
    // Youtube doesn't load the page immediately in new version so you can watch before waiting for page load
    // But we can only set resolution until the page finishes loading
    win.addEventListener("yt-navigate-finish", main, true);
})();