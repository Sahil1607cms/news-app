const API_KEY = "c2cb6930adc847a28d89a44bd8d11cd2";
const url = "https://newsapi.org/v2/everything?q=";


//refresh the page when it loads with news of india by default
window.addEventListener('load', () => fetchNews("nodejs"));

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();

    //json data contains objects and arrays 
    //data received is in format of objects/arrays hence we bind it so that it can be used 
    bindData(data.articles);
}

function bindData(articles) {
    const cardContainer = document.getElementById('card-container');
    const newsCardTemplate = document.getElementById('template-card');

    //doing this because new articles will be appended below the previous articles if we dont empty the inner html
    cardContainer.innerHTML = "";

    articles.forEach(article => {
        //if the news is there without image, then there is no need to show that news in the cards, discard it by simply returning back
        if (!article.urlToImage) return;
        //content is used to access the document fragments of template 
        //cloneNode(true)creates a deep copy of the template's content, meaning that it copies not only the template's root node but also all of its child nodes
        //cloneNode(false) would only copy the root element without any of the child elements.
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardContainer.appendChild(cardClone);
    });

}


function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDescription = cardClone.querySelector("#news-description");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDescription.innerHTML = article.description;
    //date is converted from tz format to human readable format
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"});

    newsSource.innerHTML = `${article.source.name}•${date}`;
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    })
}
let currSelectedNav = null;
function OnNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    //Deselect the previously selected item (if any) by removing the 'active' class.
    //On the first click, currSelectedNav is null, so this line won't do anything.
    currSelectedNav?.classList.remove('active');
    //Update currSelectedNav to point to the new clicked item.
    currSelectedNav = navItem;
    // Add the 'active' class to the clicked item to visually mark it as selected
    currSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener("click", () => {
    const query=searchText.value;
    //if query is null DONT search anything
    if (!query) return;
    fetchNews(query);
    currSelectedNav?.classList.remove('active');
    currSelectedNav = null;
})

function returnHome()
{
    window.location.reload();
}