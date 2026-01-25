// ==UserScript==
// @name        Wattpad Login Wall Bypass
// @description Wattpad Login Wall Bypass
// @match       https://www.wattpad.com/*
// @grant       none
// @version     1.0
// @author      AstroVD
// @icon        https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.wattpad.com&size=32
// ==/UserScript==

'use strict';
if (location.href.startsWith("https://www.wattpad.com/")){
  let wtpnames = [".modal-dialog.signup-modal-wrapper",".modal-backdrop.fade.in",".modal.fade.in","#generic-modal"]
  let wtpnamesdone = []
  var wtpinterval = setInterval(function(){
    for (let i in wtpnames){
      //console.log(wtpnames[i])
      //console.log(i)
      document.querySelectorAll(wtpnames[i]).forEach(function(wtpitem) {
        wtpitem.remove()
        wtpnamesdone.push(wtpnames[i])
      });
    }
    document.querySelector("body").classList.remove("modal-open")
    var donetest = 0
    if (donetest == 0){
      for (let i in wtpnames){
        if (wtpnamesdone.includes(wtpnames[i])){console.log(wtpnames[i] + " included")}
        else{donetest = -1}
      }
      if (donetest == 0){donetest = 1}
    }
    if (donetest == 1){
      console.log("all done!")
      clearInterval(wtpinterval)
    }
  }, 45);
}