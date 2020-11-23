var base_url = "https://api.coingecko.com/api/v3"
var result = document.getElementById("result")

result.addEventListener("click",function(){
    if (event.target.parentNode.className === "card"){
        location = "coin.html?coin=" + event.target.parentNode.id
    }
})

function showPopularCurrencies(){
    console.log("searching popular currencies")

    var query = new URLSearchParams(location.search)
    var page = query.get("page") || 1

    var sort = document.getElementById("sort").value
    var order = document.getElementById("order").value

    var xhr = new XMLHttpRequest();
    
    var params = new URLSearchParams()
    params.append("vs_currency", "usd")
    params.append("order", sort+order)
    params.append("per_page", "10")
    params.append("page", page)
    params.append("price_chage_percentage", "24h")
    xhr.open("GET", base_url+"/coins/markets?"+params);
    
    xhr.setRequestHeader("accept", "application/json")
    xhr.send();
    xhr.onload = function(){
        console.log(xhr.status)
        var data = JSON.parse(this.response);
        displayCoins(data)
    }
}

function displayCoins(data){
    var arr = data

    result.innerHTML = ""

    var pages = document.createElement("div")
    for (var i=0;i<10;i++){
        var a = document.createElement("a")
        a.innerText = (i+1)
        a.href = "popularCurrencies.html?page="+ (i+1)
        a.style.padding = "10px"
        pages.appendChild(a)
    }
    document.getElementById("pages").innerHTML = ""
    document.getElementById("pages").append(pages)
    // result.append(pages)

    arr.forEach(function(cryptocurrency){
        var div = createCard(cryptocurrency);
        result.append(div)
    })

    function createCard(cryptocurrency){
        var div = document.createElement("div");
        div.setAttribute("class","card");
        div.setAttribute("id",cryptocurrency["id"])
        var img = document.createElement("img");
        img.setAttribute("src", cryptocurrency.image)
        var details = document.createElement("div");
        details.innerText =  cryptocurrency.name //+ "\n" + 
                        // "Market Cap Rank: " + cryptocurrency.market_cap_rank + "\n" + 
                        // "Volume: " + cryptocurrency.total_volume;
        var price = document.createElement("div");
        price.innerText = "$ "+Math.round(100*cryptocurrency.current_price)/100
        var priceChange = document.createElement("div");
        priceChange.innerText = "(" + Math.round(100*cryptocurrency.price_change_percentage_24h)/100 + "%)"
        priceChange.style.fontSize = "13px"
                
        if (cryptocurrency.price_change_percentage_24h > 0) {
            price.style.color = "green"
            priceChange.style.color = "green"
        }
        else {
            price.style.color = "red"
            priceChange.style.color = "red"
        }
        div.append(img,details,price,priceChange);
        return div

    }
}

function coinPage(){
    var searchValue = document.getElementsByTagName("input")[0].value || 0
    location = "coin.html?coin=" + searchValue
}

function searchCoin(){
    console.log("Searching for coin...")

    var query = new URLSearchParams(location.search)
    var coin = query.get("coin")
    if (coin === "0"){
        coinUnavailable()
    }
    else{
        var xhr = new XMLHttpRequest()
        var params = new URLSearchParams()
        params.append("vs_currency","usd")
        params.append("ids", coin)
    
        xhr.open("GET",base_url+"/coins/markets?"+params)
        xhr.setRequestHeader("accept","application/json")
        xhr.send()
        xhr.onload = function(){
            var data = JSON.parse(xhr.response)[0];
            if (data === undefined){
                coinUnavailable()
            }
            document.getElementById("coinResult").append(displayCoin(data))
        }
    }
}

function coinUnavailable(){
    console.log("Coin not available! Please try again!")
    h1 = document.createElement("h1")
    h1.innerText = "Coin not available! Please try again..."
    h1.setAttribute("class","sub-heading")
    document.getElementById("coinResult").append(h1)
}
function displayCoin(data){
    console.log(data)
    var div = document.createElement("div");
    div.setAttribute("class","table")
    div.append(createDiv("ID"))
    div.append(createDiv(data['id']))
    div.append(createDiv("Symbol"))
    div.append(createDiv(data['symbol']))
    div.append(createDiv("Name"))
    div.append(createDiv(data['name']))
    div.append(createDiv("Current Price"))
    div.append(createDiv(data['current_price']))
    div.append(createDiv("Market Cap"))
    div.append(createDiv(data['market_cap']))
    div.append(createDiv("Market Cap Rank"))
    div.append(createDiv(data['market_cap_rank']))
    div.append(createDiv("Volume"))
    div.append(createDiv(data['total_volume']))
    div.append(createDiv("24 hr High"))
    div.append(createDiv(data['high_24h']))
    div.append(createDiv("24 hr Low"))
    div.append(createDiv(data['low_24h']))
    div.append(createDiv("Price Change in last 24 hrs ($)"))
    div.append(createDiv(data['price_change_24h']))
    div.append(createDiv("Price Change in last 24 hrs (%)"))
    div.append(createDiv(data['price_change_percentage_24h']))
    div.append(createDiv("All time High"))
    div.append(createDiv(data['ath']))
    div.append(createDiv("All time Low"))
    div.append(createDiv(data['atl']))
    return div
}
function createDiv(str){
    var div = document.createElement("div")
    div.innerText = str
    div.setAttribute("class","container")
    return div
}
