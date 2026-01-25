// ==UserScript==
// @name        Reverse Image Search
// @description Reverse Image Search
// @author      Octihex
// @version     1.6
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @match       *://*/*
// @grant       GM_openInTab
// ==/UserScript==
'use strict'

const ImagesExtensions = ['webp', 'png', 'jpg', 'jpeg'] // List of extensions we search for in the URL

// In the URL - split at every '.' char - select last split - split again at every '=' or '&' or '?' - select first split.
// Then check if the any string in ImagesExtensions is included in the result of the operation above.
if (!ImagesExtensions.some(v => location.href.split('.').at(-1).split(/[=&\?]/).at(0) === v)) return;

// Array of the different buttons object
// Each has 2 property, a url to use for the reverse image search and a icon encoded to a base64 image string
const buttons = [
    {url: 'https://iqdb.org/?url=', icon: 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACAAIAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAEBQMGBwD/xAArEAACAQMDAgUDBQAAAAAAAAABAgMEBREAEiExQQYiUWGBFHGRExcjMkL/xAAXAQADAQAAAAAAAAAAAAAAAAACAwQB/8QAHhEAAgEFAAMAAAAAAAAAAAAAAQIAAxESITFx0fD/2gAMAwEAAhEDEQA/AIpWluFbiKNnkkwsca9cAcD8DQtTHLBUtTSSxJs/sN4K/bPIzppQVS22wVdfG2Kqof6eFu6L/oj34P4Gp/B0FDdd9qeOmEsah0mEeHA77SMZx3zn5GpRULE24JZjaBWG62y3tIrzNFJJgM8Y4YemTjaPt10YgpFv5rxfUpASAECKzBcYzuLEZ47DSy0+Fqq7X6sor7T1duWPzUhgCsFznKnI8w6EnOB0XggaXo968KXyWiV3Vqd0Mzwxo+9DjDAN6g/HTtpRojPNW3CFTWJEgnuZa301EyfyU9QWfPRlPfR/hvxZa7HX2+WujlBeaWP9YrkJFt4+/mYD2BbtxrqWxs8lQayWWB440eN0TJIcFhjs3lVtV+5Wuqtk4lmijliTaxkjG6ORGIIyoIIVsDkemPUaJXphig77mMHtf7U3arknkR5qB1kGfIducYbDEDv0OhJbelwqTUzRxmpVBHJlcbgc8H4Oce/vrN/3EqIrctPRrtq+FUscRqvfgndnHcnV/wDBctbcrf8AUVgiiRuUWBXAPvuIGfjOhIPCI4MtvE//2Q=='},
    {url: 'https://saucenao.com/search.php?url=', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEUAAAD///+l2Z/dAAAAOElEQVQYlWNgwACMKAAkgCILxoyMMLVQWYhKGAVnIvFhBqNbhWE3pltQ+JiWIEQwHIbpdHTPoQEAL9AAWZKcohUAAAAASUVORK5CYII='},
    {url: 'https://yandex.com/images/search?rpt=imageview&url=', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADcklEQVRYhb2Xv28cRRTHPzM3nM0dxRQWroguUMTNCSddRKTEUn5YCHFnpSIUWEKiQ1w6OhOlogoW/0BSQIeypzSn2MhEciQqYuTGFVnRGV0xBXey9/ZmKNa3e7kfe7tHlK90px3tvPf9zps3b+eJW41PyIKWUfqEoC4RV8GtOkQFnI7eCiNwPogDi3u2SNFb16HJ4lfMEuAZVSnQ+8bCZkKYwTHioeWte3Ud+mnz5LQXLaN007gHguClxTXykAM43KYgeNk07kHLqKm2EwV4RlVOCV6Aa+QhnSKlcUrwwjOqkknAL8auCoI9YKLBnKgIgr0nxq6mCvCMqih4/JrJYxEWHo9GIhbQMkpPWrlYWk5+pfJMFlEqv2IzKkIQ7A3nhBo8nNLbGiUHUF/eRa5UAbBHh/S+/zZVQOGzryhcuR7N/+N3ej/eHxMRcYm7cBaBKCyTE67f/Cl+litVxJmYSRBLyzE5QLjjTZnpGoOtkNFfb2uaU3t0iD06jMeq9vlUAYXanYSifYwbshsTS9AAkC2jtMNtTp3JhCic+2Dc4dIy8tLlxMb7Oc0lAr5oGaXlCUE9dSZRFFz7n3hcuPHpuMOVapykrn1M//luqk8HUWmPavts9J8m+1m4dHnsRAxvzSzyASRclQ7GisNEAc93cd1ONCiVkTdqiaMr1xFL78Zju/9rJgEOViVZi063gx2KgrpZj6NQ+CjJ/P7+Lq59nMmlgIrM85EJd5pjUZAXqnGdAOg305NvGA60ONn82GW2AFTtDoX62X53OwRbX8fhd90O7u+/8rhDgsh0cRgg3Gkmg1IZcaEa14q85AKMBPxcVt0O/f0ky4crX1448KXD/pnX0A4ds1nlOQ0CDiSI33ILGCnP8r335xJg4ZlcpOjlzQPglaMmzs0nYJGiJ9d1aCzu0Vwe/gcEPFzXoZHRwP7wpgVY7D04+xzXtfItbL9B/u26Vn4sAOBtit+R90jOB38h4gJGGhPPhBWBzHQjFqUylN6JBt1/kxI9g9xh1warh5FbcV0rP4QNMkTCdTvRrad9nJk8hI1h8jEBALe1PHDYtSwicsB32LXbWh6MvpjYGdW18hcoXnxNibm9QPHi6MpTBQCs69BsaNlw2PMud50QBth22PM1LRtpnfLM7niAQXsO7ppAfghUhttzwBeQuz3/D7s8XbdZRL3IAAAAAElFTkSuQmCC'},
    {url: 'https://tineye.com/search?url=', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABGlBMVEVGjsOS1Od5pbZFjsR4xOCByOAZMD43gLFdmrNtsMd7rL5DiLpFjsNQT08AAADIcjhvMQBEjcMnJydfqdHEYhhkY2JGjsJGjsNHjcUkDwCJpaZiv+FGjsMAAAD///9Iksh0u9UCCg93wNt5xuFwtM1pqsBDi8CDzOQHFh0TJS5lpLocO1JRl8WN0eVBQkN/i5YiSWc+kMlqeoJOj7tUlbjm6ev2+PnibAgvLSwWBwK9h2RAbIQ8dJlIWWFJTU4rOkI4W2g8eqnWZg4eGBbYgT+6u72YnZ5ZiKJiZ2k4TFScRABwyuzU2NsrWnxOHgCYcVrDys7g5OYoIyBynKu+WQs+Ny6Dvc2psrc+YHCeqaqKn6Q4EwLxoF6il4wuza4aAAAAK3RSTlP06Pre9Oj+Av79/e2D8O79/c7o1tzuecFy6XN7///////////////////+MNAVfQAAAoBJREFUOI19k2t3ojAQhtl2V4LHVu1lr4QECIpoRcUKosX73dZW7X33//+NnQR198vueziHkHkmeYdMJFlOHUv/0HFKliU5q/5HWVlKwWviVQ9T5CDxmZKOVS/0++6OIGrvtlIpgiptQcD21fDn0E/n4uwK3uvusc2nwEk1PfT7fY9/5QqH+CqpWA5CHgdcf9tfiS2Kh/j8iVLKmOIgSVKrblTm4foE4+b7XSYzn2/TC4OLUgUAtfpSBEPI2sy3fd/3h8MwHC9MIYNygLSKxEMKpcPw9clcLBYmZckjUJIZHwXQLqoQNyBB2dRq0ygqPwbr9Tp4jKgA1F4CWdSkm1oUDJpgUe/MCjr32olXUHMJh5mbaLArwZ4+NO5vbBiV90BLMaCEztgViZ1rTdOub/S/AMQcjGcw/wDTek3juoe/Fuw8qIi2sD7m08sO1l1Na8AD7OBoZ3JCu1h/FomuDiuMyg98hJu1uMzbFn0BoDEdwco2njWmGJZ7BRNRMga6fAt3hAfgooDt0QgvNe2NG74UQK9gWWD+fu0KQJ/BBsIDxqfCA+khBnvUeHnPUL99s2w0xjAodJ24CuJZdCaI5Yzn6YVpZBdeEDOUGICztgzUte2O+JV6ottGzDRp3A87wmEGnKLCGDXz+TwcNLOcOpEOgOohx2KU8i4RzWShOlHbiT8AXwWYWA6ql0iuldhVsVeVkFIsQnLtCj/PzB7I5VRSmrTgUsCtSCTidoDmT8PF4WHCuLOnt1UGGqZ5aO7m9kj6zIESD19x78nVux0E+r77f/2Q5C8AQPxKKG/QsBmUy3Fz3YXncLvlr9nzT6APQjC4OD07uTw5Ozv9dvFdln8DJdeOVhQts2kAAAAASUVORK5CYII='},
    {url: 'https://lens.google.com/uploadbyurl?url=', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAqFBMVEVHcEz7+/v+/v709PX////7+/v09fX4+Pj////8/Pz7+/v////z+PP29vf09PX////+/v7///////////83qlfrQzPsTkFHiPUlpkszf/RAhfX6uwD8wBLW4vyQs/j96N3/+vPh8eR8wJiHrfjylpBhuXftX0rR6Nb608j0qKNwofBKsGWzy/rzn5n0o57uc2/94J78zFb3u7es1rC6z/rHuTCVsC08ooagt3gtAAAAE3RSTlMA08Eb4kVwOqb5kV7jkn8NfnFw9v5R3wAAAVtJREFUOI2dU9lywjAMTIAchgmljU3sJBRycRZoocf//1ltyZ4cpi/dl0jeHWllxY7TxVPgecGT8weCkMQAEgaP6EncwcSShPEAYZ+fDHlZ5BG/P9T1YW8rRnhyYRoXzEeGn0G6XrKlBmNrOJppAVZnmpNftt1gDeSfVbhhwNa3W83Y1hh9aR1eFX/G43N/kjEYyCR/sGcdG4vvWb692jzYnKrgI88znL96RVQrlU3NJWdSgM5FihBv5sKHggSR9gW5FKx1BSGUSHwawQI8ZHl2B8FK4ZgmAjwspMDDKb4obc2nsgIEnrnpzTeltDF8lSbpsb1r2OWdS8Vpp8KiVAWgA+4TesSNFFBOm+bE+U8iqraD47gqJidVQ4NjA1eve4ydS6PgvGw3AfAxL0oOKAvM/fafi4z/YrcrTBx1/9q5vcj54N2QPk3sx+V3JMS3aKgSuUTCjR49zf/jF+G2OgtU1MugAAAAAElFTkSuQmCC'}
];

// Create a div element - add it to the page - set the id - add the CSS
document.body.appendChild(
    Object.assign(document.createElement('div'), {
        id: 'TargetDiv',
        style: 'height: 32px; border: 0px; display: inline-flex; position: relative; top: 0%; float: right; margin-top: 1px; margin-right: 1px;'
    })
)

// Get the element in the webpage with the id TargetDiv
let TargetDiv = document.getElementById("TargetDiv")

// Create a input element - add it to the page - set the type of the element to a image - give the button the icon string - add the CSS - set the function provided to execute when the button is clicked.
for (let button of buttons) {
    TargetDiv.appendChild(
        Object.assign(document.createElement('input'), {
            type: 'image',
            src: button.icon,
            style: 'position: relative; height: 100%; width: 32px; display: inline-block; background: none; border: none;',
            onclick: () => GM_openInTab(button.url + encodeURIComponent(location.href))
        })
    )
}