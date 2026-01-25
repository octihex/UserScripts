// ==UserScript==
// @name         TEST Amazon Price Data
// @version      1.1
// @description  Compare Amazon prices across Europe
// @author       Octihex
// @icon         https://www.google.com/s2/favicons?sz=32&domain=amazon.fr
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.com.be/*
// @match        https://www.amazon.nl/*
// @connect      amazon.fr
// @connect      amazon.de
// @connect      amazon.es
// @connect      amazon.it
// @connect      amazon.com.be
// @connect      amazon.nl
// @grant        GM_xmlhttpRequest
// ==/UserScript==
'use strict';

const sites = [
    {name: 'Amazon.fr', flag: 'https://flagcdn.com/w20/fr.png', country: 'fr'},
    {name: 'Amazon.es', flag: 'https://flagcdn.com/w20/es.png', country: 'es'},
    {name: 'Amazon.it', flag: 'https://flagcdn.com/w20/it.png', country: 'it'},
    {name: 'Amazon.de', flag: 'https://flagcdn.com/w20/de.png', country: 'de'},
    {name: 'Amazon.nl', flag: 'https://flagcdn.com/w20/nl.png', country: 'nl'},
    {name: 'Amazon.be', flag: 'https://flagcdn.com/w20/be.png', country: 'com.be'}
];

const cell = (txt, isH, ex) => {
    let d = Object.assign(document.createElement('div'), {innerHTML: txt})

    if(isH) d.style.fontWeight = 'bold';
    if(ex) d.classList.add(ex);
    return d;
};

let basePrice, tableCont, chartCont, seller
let period = 'all'
let firstLoaded = false
let checks = [];
let asin = extractASIN()

function extractASIN() {
    const m = location.href.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
    if (!m) return false;
    return m[1];
}

function getBasePrice() {
    basePrice = getPrice(document);
    return basePrice !== null;
}

function injectStyles() {
    const css = `:root{--a:#FF9900;--bg:#fff;--font:Arial,sans-serif;--tc:#333;--bc:#ddd}
    body{font-family:var(--font)!important}
    #amz-checker-container{background:var(--bg);border:1px solid var(--bc);border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1);font-size:12px;color:var(--tc);margin:0 auto;display:flex;flex-direction:column}
    #amz-checker-header{background:var(--a);color:#fff;padding:5px 10px;border-radius:10px 10px 0 0;display:flex;align-items:center;gap:10px}
    #amz-checker-header img{width:36px;height:36px}
    #amz-checker-title{font-size:14px;font-weight:bold}
    .loading-text-gradient{background-clip:text;color:transparent;background-image:linear-gradient(270deg,black 0%,black 20%,var(--a) 50%,black 80%,black 100%);background-size:200% 100%;animation:loadAnim 2s linear infinite}
    @keyframes loadAnim{0%{background-position:100% 50%}100%{background-position:0 50%}}
    #loadingMessage{text-align:center;font-weight:bold;font-size:13px;display:flex;flex-direction:column;align-items:center;margin:10px 0}
    .amz-checker-content{padding:10px;flex:1}
    #comparison-table{border:1px solid var(--bc);border-radius:8px;overflow:hidden;margin-bottom:15px}
    .comparison-row{display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid var(--bc);cursor:pointer;transition:background 0.2s}
    .comparison-row:hover{background:#f5f5f5}
    .comparison-row.header-row{background:#eee;font-weight:bold;cursor:default}
    .comparison-row.header-row:hover{background:#eee}
    .comparison-row:last-child{border-bottom:none}
    .comparison-row>div{text-align:center;flex:1}
    .first-col{flex:0 0 120px;text-align:left !important;overflow:hidden}
    .price-difference-positive{color:#008000}
    .price-difference-negative{color:#f00}
    .chart-container{margin-bottom:15px;border:1px solid var(--bc);border-radius:8px;padding:10px;position:relative;min-height:300px;text-align:center}
    .chart-container .loader{position:absolute;top:50%;left:50%;margin:-24px 0 0 -24px}
    .chart-controls{display:flex;align-items:center;gap:15px;margin-bottom:10px;flex-wrap:wrap;justify-content:center}
    .chart-controls .checkbox-container{display:flex;align-items:center;font-size:12px}
    .chart-controls .checkbox-label{margin-left:4px}
    .chart-controls div{padding:3px 6px;font-size:12px}
    .loader{position:relative;width:48px;height:48px;border-radius:50%;display:inline-block;border-top:4px solid #FFF;border-right:4px solid transparent;box-sizing:border-box;animation:rot 1s linear infinite}
    .loader::after{content:'';box-sizing:border-box;position:absolute;left:0;top:0;width:48px;height:48px;border-radius:50%;border-left:4px solid #FF3D00;border-bottom:4px solid transparent;animation:rot .5s linear infinite reverse}
    @keyframes rot{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    .chart-image{max-width:100%;margin-top:10px;margin:0 auto}`;

    document.head.appendChild(
        Object.assign(document.createElement('style'), {
            textContent: css
        })
    )
}

function createBaseUI() {
    let p = document.querySelector('.priceToPay,#priceblock_ourprice,#priceblock_dealprice,#priceblock_saleprice');
    (p ? p.parentNode : document.body).appendChild(
        Object.assign(document.createElement('div'), {
            id: 'amz-checker-container',
            innerHTML: `
                <div id="amz-checker-header">
                    <img src="https://i.ibb.co/qrjrcVy/amz-price-checker.png" alt="Logo"/>
                    <span id="amz-checker-title">Amazon Price Checker</span>
                </div>
                <div class="amz-checker-content">
                    <div id="loadingMessage" class="loading-text-gradient">Checking other Amazon sites...</div>
                </div>
            `
        })
    )
}

function buildFinalUI() {
    let cnt = document.querySelector('#amz-checker-container .amz-checker-content');
    if (!cnt) return;
    cnt.innerHTML = '';
    addTable(cnt);
    addChart(cnt);
    updateChart();
}

function addTable(cnt){
    let tw = Object.assign(document.createElement('div'), {id: 'comparison-table'})
    let hr = Object.assign(document.createElement('div'), {className: 'comparison-row header-row'})

    tableCont = document.createElement('div');

    ['Site','Price (EUR)', 'Delivery','Total','Difference'].forEach((h,i) => hr.appendChild(
        cell(h,true,i===0 ? 'first-col' : '')
    ));

    tableCont.appendChild(hr);
    tw.appendChild(tableCont);
    cnt.appendChild(tw);
}

function insertRow({s, price, Delivery}) {
    let inserted = false;
    let total = price + Delivery
    let difference = total - basePrice
    let percent = ((difference / basePrice) * 100).toFixed(0)
    let differenceClass = difference < 0 ? 'price-difference-positive' : difference > 0 ? 'price-difference-negative' : '';

    let row = Object.assign(document.createElement('div'), {
        className: 'comparison-row',
        onclick: () => window.open(`https://www.amazon.${s.country}/dp/${asin}`, '_blank')
    })

    row.append(
        cell(`<img src="${s.flag}" style="vertical-align:middle;margin-right:5px;width:20px;height:13px;"> ${s.name}`, false, 'first-col'),
        cell(showPrice(price)),
        cell(Delivery > 0 ? `+ €${Delivery.toFixed(2)}` : '-'),
        cell(showPrice(total)),
        cell(difference !== 0 ? `<span class="${differenceClass}">${difference >= 0 ? '+' : ''}${difference.toFixed(2)} € (${percent}%)</span>` : '-')
    );

    let rows = [...tableCont.querySelectorAll('.comparison-row:not(.header-row)')];

    for (let r of rows) {
        let t = parseFloat(r.children[4].textContent.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 999999;
        if (total < t) {
            tableCont.insertBefore(row, r);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        tableCont.appendChild(row);
    }
}

function addChart(cnt) {
    chartCont = Object.assign(document.createElement('div'), {className: 'chart-container'})
    let ctrl = Object.assign(document.createElement('div'), {className: 'chart-controls'})
    let selEl = document.createElement('div');

    [['1m', '1 Month'], ['3m', '3 Months'], ['6m', '6 Months'], ['1y', '1 Year'], ['all', 'All']].forEach(([v, l]) => {
        let button = Object.assign(document.createElement('button'), {
            value: v,
            textContent: l,
            onclick: () => {
                period = v
                updateChart()
            }
        })

        selEl.appendChild(button);
    });

    ctrl.appendChild(selEl);
    chartCont.appendChild(ctrl);

    chartCont.append(
        Object.assign(document.createElement('div'), {className: 'loader'}),
        Object.assign(document.createElement('img'), {
            alt: `Price history for ${asin}`,
            className: 'chart-image',
            style: "display: none"
        })
    )

    cnt.appendChild(chartCont);
}

function updateChart(){
    if(!chartCont)return;
    var country = getCurrentCountry()
    if (document.querySelector("a[id=sellerProfileTriggerId]")) {
        seller = 'New'
    }
    else {
        seller = 'Amazon'
    }
    var url = `https://charts.camelcamelcamel.com/${country}/${asin}/${seller}.png?legend=1&tp=${period}`
    var spin = chartCont.querySelector('.loader')
    var img = chartCont.querySelector('.chart-image')

    spin.style.display = 'inline-block'
    img.style.display = 'none';
    img.src = url;

    img.onload = () => {
        spin.style.display = 'none';
        img.style.display = 'block';
    };

    img.onerror = () => {
        spin.style.display = 'none';
        img.style.display = 'block';
        img.src = 'https://dummyimage.com/600x200/ccc/000&text=Image+Unavailable';
    };
}

function getCurrentCountry() {
    let h = location.hostname;
    if (h.includes('amazon.com.be')) return 'com.be';
    if (h.includes('amazon.com')) return 'com';
    if (h.includes('amazon.de')) return 'de';
    if (h.includes('amazon.es')) return 'es';
    if (h.includes('amazon.it')) return 'it';
    if (h.includes('amazon.nl')) return 'nl';
    return 'fr';
}

function getPrice(doc) {
    let el = doc.querySelector('.priceToPay,#priceblock_ourprice,#priceblock_dealprice,#priceblock_saleprice');
    if (!el) return null;
    let raw = parseFloat(el.textContent.replace(/[^0-9,\.]/g, '').replace(',', '.'));
    return raw;
}

function fetchPrices() {
    sites.forEach(s => {
        let url = `https://www.amazon.${s.country}/dp/${asin}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            onload: r => {
                if (r && r.status === 200) {
                    let doc = new DOMParser().parseFromString(r.responseText, 'text/html')
                    let p = getPrice(doc);
                    if (p !== null) {
                        if (!firstLoaded) {
                            firstLoaded = true;
                            buildFinalUI();
                        }
                        insertRow({
                            s,
                            price: p,
                            Delivery: getDelivery(doc)
                        });
                    }
                }
            },
            onerror: () => {}
        });
    });
}

function getDelivery(doc) {
    let m = doc.body.innerHTML.match(/data-csa-c-delivery-price="[^"]*?(\d+[.,]\d{2})/);
    if (m) {
        let p = parseFloat(m[1].replace(',', '.'));
        return isNaN(p) ? 0 : p;
    }
    return 0;
}

function showPrice(amount) {
    return `€${amount.toFixed(2)}`;
}

if (!extractASIN()) return;
if (!getBasePrice()) return;
injectStyles();
createBaseUI();
fetchPrices();