const resultsNav = document.querySelector('#resultsNav'),
      favoritesNav = document.querySelector('#favoritesNav'),
      imagesContainer = document.querySelector('.images-container'),
      navContainer = document.querySelector('.nav-container'),
      saveConfirmed = document.querySelector('.save-confirmed'),
      results = document.querySelector('.results'),
      favor = document.querySelector('.favorites'),
      loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'nmaiE2OpJSWgWBm3E91L5S8wHImecXbgtIyvOEVC'
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [],
    favorites = {};

function showContent(){
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    loader.classList.add('hidden');
}


function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

    currentArray.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('card');
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA image every day';
        image.loading = 'lazy';
        image.classList.add('card-img-top'); 
        

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
        saveText.textContent = 'Add to Favorites';
        saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove to Favorites';
        saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;

        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        const date = document.createElement('strong');
        date.textContent = result.date;

        const copyrightResult = result.copyright === undefined ? '' : result.copyright;

        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);

    });
}    

function updateDOM(page) {
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent();
}

// Get 10 img from api
async function getNasaPictures() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        updateDOM('results');
    } catch(error) {

    }
}

function saveFavorite(itemUrl){
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
          
        // show save confirmation for 2 sec
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
        // set favorites in localS
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

function removeFavorite(itemUrl) {
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }

}

navContainer.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    if(target.classList.contains('results')){
        getNasaPictures();
        target.classList.add('active');
      favor.classList.remove('active'); 
    } else if(target.classList.contains('favorites')){
        results.classList.remove('active'); 
        target.classList.add('active');
        updateDOM();
    }
});

getNasaPictures();

