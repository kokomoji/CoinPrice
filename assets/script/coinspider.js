// Promise Recursive Function to get exchanges tot number for pagination
const reqsPromises = (request, page = 1, tot = 0, num = -1) => new Promise((resolve, reject) => {
   console.log(request+page, tot, num);
   //if (num == 0 || page == 9) {
   if (num == 0) {
        return resolve(tot);
   } else {
      console.log("Here");
      return fetch(request+page)
            .then(response => {
                 const json = response.json();
                 
                 if (response.ok) {
                      console.log(json);
                      return json;
                 }
                 return json.then(tot => reject(tot));   
            })
            .then(jsonData => resolve(reqsPromises(request, page+1, tot+jsonData.length, jsonData.length)));
   }
  
});


// https://www.coingecko.com/api/documentations/v3
const BASEURL = "https://api.coingecko.com/api/v3/";
const GLOBAL = "global";
const EXCHANGES_LIST = "exchanges/list";
const EXCHANGES = "exchanges?page=";

// Get cryptocurrency global data
let coinGlobalInfoUrl = BASEURL + GLOBAL;

// List all supported markets id and name (no pagination required)
// Use this to obtain all the markets’ id in order to make API calls
let exchangesInfoUrl = BASEURL + EXCHANGES_LIST;

let exchangesListCountUrl = BASEURL + EXCHANGES;


// Global info
function globalInfo() {
   $("#pagination-top").html(`<p class="text-right"><small>Working.....</small></p>`);
   $("#pagination-bottom").html(`<p class="text-right"><small>Working.....</small></p>`);
   fetch(coinGlobalInfoUrl)
   .then( res => {
      res.json()
      .then( data => {
         var globalData = data.data;
         console.log(coinGlobalInfoUrl);
         console.log(data);
         
         fetch(exchangesInfoUrl)
         .then( res => {
            res.json()
            .then( data =>{
            console.log(exchangesInfoUrl);
            console.log(data);

            // Get exchanges count
            var exchangesCount = data.length;

            // Set color and sign for market_cap_change_percentage_24h_usd
            
            var ret = numberSignColor(globalData.market_cap_change_percentage_24h_usd);
            var percMarketCapColor = ret.color;
            var signMarketCapColor = ret.sign;

            // Get the first three coins (order by market cap perc)
            let dominance = {};
            for (key in globalData.market_cap_percentage) {
               let nkey = (parseInt(globalData.market_cap_percentage[key]) < 10) ? "0" + globalData.market_cap_percentage[key] :globalData.market_cap_percentage[key];
               dominance[ nkey ] = key;
            }
            dominanceSorted = Object.keys(dominance).sort().reduce((a, c) => (a[c] = dominance[c], a), {}) ;
            let dominanceLen = Object.keys(dominanceSorted).length;

            let global = "<small>"  
               + "&emsp;<b>Coins: </b><span class='text-primary'>" + globalData.active_cryptocurrencies + "</span>"
               + "&emsp;<b>Exchanges: </b><span class='text-primary'>" + exchangesCount + "</span>"
               + "&emsp;<b>Market Cap: </b><span class='text-primary'>" + accounting.formatMoney(globalData.total_market_cap.usd, "$", 0)  + "</span>" + ` <span class='${percMarketCapColor}'>${signMarketCapColor}` + globalData.market_cap_change_percentage_24h_usd.toFixed(2) + "%</span>"
               + "&emsp;<b>Dominance: </b>" 
                  + dominanceSorted[Object.keys(dominanceSorted)[dominanceLen-1]].toUpperCase() + " " + parseFloat(Object.keys(dominanceSorted)[dominanceLen-1]).toFixed(1)
                  + "&ensp;" + dominanceSorted[Object.keys(dominanceSorted)[dominanceLen-2]].toUpperCase() + " " + parseFloat(Object.keys(dominanceSorted)[dominanceLen-2]).toFixed(1)
                  + "&ensp;" + dominanceSorted[Object.keys(dominanceSorted)[dominanceLen-3]].toUpperCase() + " " + parseFloat(Object.keys(dominanceSorted)[dominanceLen-3]).toFixed(1)
                  + "&ensp;" + dominanceSorted[Object.keys(dominanceSorted)[dominanceLen-4]].toUpperCase() + " " + parseFloat(Object.keys(dominanceSorted)[dominanceLen-4]).toFixed(1)
                  + "&ensp;" + dominanceSorted[Object.keys(dominanceSorted)[dominanceLen-5]].toUpperCase() + " " + parseFloat(Object.keys(dominanceSorted)[dominanceLen-5]).toFixed(1)
            + "</small>";

            $("#global").html(global);

            //let totCoins = globalData.active_cryptocurrencies;
            //let totExchanges = exchangesCount;

            if ($("#cryptocurrencies-nav").hasClass("active")) {
               var tot = globalData.active_cryptocurrencies;
               var func = cryptocurrenciesContent;
               pagination(1, tot, undefined, undefined, func);
            } else {
               reqsPromises(exchangesListCountUrl, 1)
               .then(totPages => {
                  var tot = totPages;
                  var func = exchangesContent;
                  pagination(1, tot, undefined, undefined, func);
               })
               .catch(error => console.log(error));
               
               
            }
            


            })
            .catch( err => {
            myError(err);
            })
         })
         .catch( err => {
            myError(err);
         })              
      })
      .catch( err => {
      myError(err);
      })
   })
   .catch( err => {
      myError(err);
   })
}


function cryptocurrenciesContent(vs_currency="usd", order="market_cap_desc", per_page=100, page = 1, sparkline="false", price_change_percentage="1h,24h,7d") {
   
   // List all supported coins price, market cap, volume, and market related data
   // Use this to obtain all the coins market data (price, market cap, volume)
   // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h%2C%2024h%2C%207d
   let coinListUrl = BASEURL + "coins/markets"
      + "?vs_currency=" + vs_currency
      + "&order=" + order
      + "&per_page=" + per_page
      + "&page=" + page
      + "&sparkline=" + sparkline
      + "&price_change_percentage=" + price_change_percentage;

   console.log(coinListUrl);

   fetch(coinListUrl)
   .then( res => {
      res.json()
      .then( data => {
      // do here
      console.log(data);

      // Table head
      let table = `
      <table class="table table-hover">
         <thead class="thead-light">
            <tr>
            <th scope="col">#</th>
            <th scope="col">Coin</th>
            <th scope="col">Sym</th>
            <th class="text-right" scope="col">Price</th>
            <th class="text-right" scope="col">1h</th>
            <th class="text-right" scope="col">24h</th>
            <th class="text-right" scope="col">7d</th>
            <th class="text-right" scope="col">24h Volume</th>
            <th class="text-right" scope="col">Mkt Cap</th>
            <th scope="col">Last 7 Days</th>
            </tr>
         </thead>
      `;

      // Table body
      table += "<tbody>";
      
      let coinIdx = 1 + (page - 1) * per_page;
      for (coin of data) {
         //console.log("coin = ", coin.name);
         // table row
         table += "<tr>"

         // #
         table += `<td class="align-middle">` + coinIdx + "</td>";
         
         // Coin
         if (coin.image == null) coin.image = "";
         if (coin.name == null) coin.name = "?";
         table += `<th class="align-middle" scope="row"><img src="`
            + coin.image.replace('/large/','/thumb/') + `"`
            + ` alt="` + coin.name + ` image"> ` + coin.name + `</th>`;

         // coin Symbol
         if (coin.symbol == null) coin.symbol = "";
         table += `<td class="align-middle"><small>` + coin.symbol.toUpperCase() + `</small></td>`;

         // Price
         if (coin.current_price != null) {
            table += `<td class="align-middle text-right">` + accounting.formatMoney(coin.current_price, "$", 2) + "</td>";
         } else {
            table += `<td class="align-middle text-right">?</td>`;
         }
         
         // 1h, 24h, 7d price change percentage              
         for (let pcpSym of ['1h', '24h', '7d']) {
            let val = coin['price_change_percentage_' + pcpSym + '_in_currency'];
            if (val != null) {
            let ret = numberSignColor(val);
            table += `<td class="` + ret.color + ` align-middle text-right">` + ret.sign + val.toFixed(2) + `%</td>`;
            } else {
            table += `<td class="align-middle text-right">?</td>`;
            }
         }
         
         // 24h Volume	
         if (coin.total_volume != null) {
            table += `<td class="align-middle text-right">` + accounting.formatMoney(coin.total_volume, "$", 0) + "</td>";
         } else {
            table += `<td class="align-middle text-right">?</td>`;
         }
         
         //Mkt Cap	
         // data[0].market_cap
         if (coin.market_cap != null) {
            table += `<td class="align-middle text-right">` + accounting.formatMoney(coin.market_cap, "$", 0) + "</td>";
         } else {
            table += `<td class="align-middle text-right">?</td>`;
         }
                     
         // Last 7 Days
         // [0].image
         // image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
         // last 7 days graph: https://www.coingecko.com/coins/1/sparkline
         // thumb: https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579
         if (coin.image) {
            let pathArr = coin.image.split("/");
            let _7dTrendImgUrl =  "https://www.coingecko.com/coins/" + pathArr[5] + "/sparkline"; 
            table += `<td><img class="resize7d" src="` + _7dTrendImgUrl + `" alt="` + coin.name + ` last 7 days trend image"></td>`;
         } else {
            table += `<td class="align-middle">?</td>`;
         }
                     
         coinIdx++;
         // close table row
         table += "</tr>"
      }
      // close table body
      table += "</tbody>";
      // close table
      table += "</table>";
      
      $("#content").html(table);
      
      })
      .catch( err => {
      myError(err);
      })
   })
   .catch( err => {
      myError(err);
   })
}


function exchangesContent(per_page = 100, page = 1) {
   // https://api.coingecko.com/api/v3/exchanges?per_page=100&page=1

   let exchangesListUrl = BASEURL + `exchanges?per_page=${per_page}&page=${page}`;
   console.log(exchangesListUrl);

   fetch(exchangesListUrl)
   .then( res => {
      res.json()
      .then( data => {
      console.log(data);

      // Table head
      let table = `
      <table class="table table-hover">
         <thead class="thead-light">
            <tr>
            <th scope="col">#</th>
            <th scope="col">Exchange</th>
            <th class="text-center" scope="col">Trust score</th>
            <th class="text-right" scope="col">24h Volume (Normalized)</th>
            <th class="text-right" scope="col">24h Volume</th>
            <th scope="col">Last 7 Days</th>
            </tr>
         </thead>
      `;

      // Table body
      table += "<tbody>";
      
      let exchangeIdx =  1 + (page - 1) * per_page;
      for (exchange of data) {
         //console.log("exchange = ", exchange.name);
         // table row
         table += "<tr>"

         // #
         table += `<td class="align-middle">` + exchangeIdx + "</td>";
         
         // exchange name
         if (exchange.image == null) exchange.image = "";
         if (exchange.name == null) exchange.name = "?";
         table += `<th class="align-middle" scope="row"><img src="`
            + exchange.image.replace('/small/','/thumb/') + `"` 
            + ` alt="` + exchange.name + ` image"> ` + exchange.name + `</th>`;

         // Trust score
         if (exchange.trust_score) {
            table += `<td class="align-middle"><div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ` + exchange.trust_score * 10 + `%;" aria-valuenow="` + exchange.trust_score + `" aria-valuemin="0" aria-valuemax="10">` + exchange.trust_score + `</div>
            </div></td>`;
            //table += "<td>" + exchange.trust_score + "</td>";
         } else {
            table += `<td class="align-middle">?</td>`;
         }
         

         // 24h volume normalized
         if (exchange.trade_volume_24h_btc_normalized != null) {
            table += `<td class="align-middle text-right">` + accounting.formatMoney(exchange.trade_volume_24h_btc_normalized, "", 2) + " BTC</td>";
         } else {
            table += `<td class="align-middle text-right">?</td>`;
         }
         

         // 24h volume
         if (exchange.trade_volume_24h_btc != null) {
            table += `<td class="align-middle text-right">` + accounting.formatMoney(exchange.trade_volume_24h_btc, "", 2) + " BTC</td>";
         } else {
            table += `<td class="align-middle text-right">?</td>`;
         } 
         
         //Last 7 Days
         // "image": "https://assets.coingecko.com/markets/images/52/small/binance.jpg?1519353250",
         // https://www.coingecko.com/exchanges/52/sparkline
         let pathArr = exchange.image.split("/");
         let _7dTrendImgUrl =  "https://www.coingecko.com/exchanges/" + pathArr[5] + "/sparkline"; 
         table += `<td><img class="resize7d" src="` + _7dTrendImgUrl + `" alt="` + exchange.name + ` last 7 days trend image"></td>`;

         exchangeIdx++;
         // close table row
         table += "</tr>";
      }
      // close table body
      table += "</tbody>";
      // close table
      table += "</table>";

      //let content = "<h1>Exchanges.....</h1>";
      $("#content").html(table);
      

      })
      .catch( err => {
      myError(err);
      })
   })
   .catch( err => {
      myError(err);
   })        
};

// Pagination for cryptocurrencies and exchanges
// cur = current page
// tot = total items number
// step = total items per page
// maxParts = max number of pages to show in pagination
// func is the function to be called for content management (show crypto or exchanges)
function pagination(cur = 1, tot = 999, step = 100, maxParts = 11, func) {

   let paginationHtmlHead = `
   <nav aria-label="Page navigation">
      <ul class="m-0 pagination pagination-sm justify-content-end">`;
   
   let paginationHtmlBody = "";
   if (cur == 1) {
      paginationHtmlBody += `
      <li class="page-item disabled">
         <a class="page-link" href="#" tabindex="-1" aria-disabled="true"><small>‹&nbsp;Prev</small></a>
      </li>
      `;
   } else {
      paginationHtmlBody += `
      <li id="pag-` + (cur - 1) + `" class="page-item">
         <a class="page-link" href="#"><small>‹&nbsp;Prev</small></a>
      </li>
      `;
   }

   // Total pages
   let parts = Math.ceil(tot / step);
   // Check if parts exceed total pages
   let partsCount = (parts < maxParts) ? parts : maxParts;
   // m = half of total pages
   m = parseInt(maxParts / 2);
   if (cur > parts - m) {
      start = parts - maxParts + 1;
   } else {
      start = cur - m;
   } 

   if (start <= 0) {
      start = 1;
   } 

   if (start - 1 >= 1) {
      paginationHtmlBody += `<li id="pag-` + 1 + `" class="page-item"><a class="page-link" href="#"><small>1</small></a></li>`;
   }
   if (start - 1 > 1) {
      paginationHtmlBody += `<li class="page-item gap disabled"><a href="#" class="page-link"><small>…</small></a></li>`;
   }

   for (let i = 0; i < partsCount; i++) {
      let page = start + i;
      if (page == cur) {
      paginationHtmlBody += `<li class="page-item active" aria-current="page">
         <span class="page-link"><small>` +
            page
            + `</small><span class="sr-only">(current)</span>
         </span>
      </li>`;
      } else {
      paginationHtmlBody += `<li id="pag-` + page + `" class="page-item"><a class="page-link" href="#"><small>` + page + `</small></a></li>`;
      }
      
   }

   if (parts - start > maxParts) { 
      // Gap
      paginationHtmlBody += `<li class="page-item gap disabled"><a href="#" class="page-link"><small>…</small></a></li>`;
   }
   if (parts - start >= maxParts) {
      // Last
      paginationHtmlBody += `<li id="pag-` + parts + `" class="page-item"><a class="page-link" href="#"><small>` + parts + `</small></a></li>`;
   }

   if (cur == parts) {
      paginationHtmlBody += `
      <li class="page-item disabled">
         <a class="page-link" href="#" tabindex="-1" aria-disabled="true"><small>Next&nbsp;›</small></a>
      </li>
      `;
   } else {
      paginationHtmlBody += `
      <li id="pag-` + (cur + 1) + `" class="page-item">
         <a class="page-link" href="#"><small>Next&nbsp;›</small></a>
      </li>
      `;
   }

   let paginationHtmlTail = `
   </ul>
      </nav>`;

   let paginationHtml = paginationHtmlHead + paginationHtmlBody + paginationHtmlTail;
   /*
   let paginationHtml = `
   <nav aria-label="Page navigation">
      <ul class="pagination justify-content-end">
      <li class="page-item disabled">
         <a class="page-link" href="#" tabindex="-1" aria-disabled="true">‹&nbsp;Prev</a>
      </li>
      <li class="page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item gap disabled"><a href="#" class="page-link">…</a></li>
      <li class="page-item"><a class="page-link" href="#">10</a></li>
      <li class="page-item">
         <a class="page-link" href="#">Next&nbsp;›</a>
      </li>
      </ul>
   </nav>
   `;
   */
   //$("#pagination").html = paginationHtml;
   console.log("Pagination=", paginationHtml);
   $("#pagination-top").html(paginationHtml);
   $("#pagination-bottom").html(paginationHtml);
   $( ".page-item" ).each(function( index ) {
      console.log( index + ": " + $( this ).text(), "id=", $(this).attr("id"));
      let id = $(this).attr("id");
      if (id) {
      let pagen = id.split("-");
      if (func == cryptocurrenciesContent) {
         $(this).on("click", function(event) {
            func(undefined, undefined, undefined, pagen[1]);
            pagination(parseInt(pagen[1]), tot, undefined, undefined, cryptocurrenciesContent);
         });
      } else {
         $(this).on("click", function(event) {
            func(undefined, pagen[1]);
            pagination(parseInt(pagen[1]), tot, undefined, undefined, exchangesContent);
         });
         
      }
      }
   });
   
}



// Init
$(function() {
   console.log( "ready!" );
   globalInfo();
   cryptocurrenciesContent();    


   // cryptocurrencies-nav click
   $("#cryptocurrencies-nav").on("click", function(event) {
      $("#exchanges-nav").removeClass("active");
      $("#exchanges-nav").html(`<a class="nav-link" href="#">Exchanges</a>`);
      $("#cryptocurrencies-nav").addClass("active");
      $("#cryptocurrencies-nav").html(`<a class="nav-link" href="#">Cryptocurrencies <span class="sr-only">(current)</span></a>`);
      $("#error").html("");
      globalInfo();
      cryptocurrenciesContent();
   });

   // exchanges-nav click
   $("#exchanges-nav").on("click", function(event) {
      $("#cryptocurrencies-nav").removeClass("active");
      $("#cryptocurrencies-nav").html(`<a class="nav-link" href="#">Cryptocurrencies</a>`);
      $("#exchanges-nav").addClass("active");
      $("#exchanges-nav").html(`<a class="nav-link" href="#">Exchanges <span class="sr-only">(current)</span></a>`);
      $("#error").html("");
      globalInfo();
      exchangesContent();
   });

});
