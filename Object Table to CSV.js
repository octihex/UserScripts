// ==UserScript==
// @name        Object Table to CSV
// @description Object Table to CSV
// @version     1.0
// @author      Octihex
// @match       *://*/*
// @grant       GM_setClipboard
// @icon        https://www.google.com/s2/favicons?sz=32&domain=excel.cloud.microsoft
// ==/UserScript==

Object.defineProperty(Object.prototype, 'ConvertTbodyToCSV', {
    value: function() {
        let OutputCSV = ''

        this.querySelectorAll('tr').forEach(Row => {
            OutputCSV += `${Row.outerText.replaceAll('\n', ' ').replaceAll(',', ' ').split('\t').join()}\n`
        })

        GM_setClipboard(OutputCSV, "text", () => console.log("CSV export copied to clipboard"));
    }
})