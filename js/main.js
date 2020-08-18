const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');
const loader = document.getElementById('loader');
const songLyrics = document.getElementById('songLyrics');

// single search result craate dom element
const createElement = (title, albumName, getartist, gettitle) => {

    let div = document.createElement('div')
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    let h3 = document.createElement('h3')
    let p = document.createElement('p')
    let span = document.createElement('span')
    let button = document.createElement('button')
    let a = document.createElement('a')

    // div
    div.classList.add("single-result", "row", "align-items-center" , "my-3", "p-3");
    div.id = "singleResult";
    div.appendChild(div1);
    div.appendChild(div2);

    // div1
    div1.className = "col-md-9";
    div1.appendChild(h3);
    h3.className = "lyrics-name";
    h3.innerText = title;
    div1.appendChild(p);
    p.className = "author lead";
    p.innerText = " Album by ";
    p.appendChild(span);
    span.innerText = albumName

    // div2
    div2.classList.add("col-md-3", "text-md-right", "text-center");
    div2.appendChild(button);
    button.classList.add("btn", "btn-success");
    button.appendChild(a)
    a.href = `/index.html?artist=${getartist}&title=${gettitle}`;
    a.innerText = "Get Lyrics";


    searchResult.appendChild(div)
}

// searchbtn click event
searchBtn.addEventListener('click', () =>{

    // get searchBox value
    let searchBoxVlaue = searchBox.value
    if(searchBoxVlaue == ''){
        alert('Please enter value')
    }else{
    
    // loading animation
    let loader = `<div class="spinner-border text-success" role="status" id="loader">
    <span class="sr-only">Loading...</span>
  </div>`;
  searchResult.innerHTML = loader;

    // api link
    let apiLink = 'https://api.lyrics.ovh/suggest/';

    // fetch api
    fetch(apiLink+searchBoxVlaue)
    .then(res => res.json())
    .then(data => {

        searchBtn.disabled = true;
        searchResult.innerHTML = ''

        if(data.data.length == 0){
            searchResult.innerHTML = '<h3>Data not found</h3>'
        }
        console.log(data.data)
        if(data.data.length > 10){
            for(i=0; i < 10; i++){
                let v = data.data[i]
                createElement(v.title, v.album.title, v.artist.name, v.title)
            }
        }else{
            data.data.map(v => {
            createElement(v.title, v.album.title, v.artist.name, v.title)
            })
        }
        
    })
}
})

// searchBox focus event
searchBox.addEventListener('focus', () =>{

    searchBtn.disabled = false;
    searchResult.innerHTML = ''
    
})


const songFunction = (artist, title) => {
    
    // loading animation
    let loader = `<div class="spinner-border text-success" role="status" id="loader">
    <span class="sr-only">Loading...</span>
  </div>`;
  songLyrics.innerHTML = loader;

    // api link
    let apiLink = `https://api.lyrics.ovh/v1/${artist}/${title}`;

    // fetch api
    fetch(apiLink).then(res => {
        
        if(res.status == '404'){
            songLyrics.innerHTML = '<h3>Lyrics not found</h3>'
            return Promise.reject('some error happend maybe 404')
        }else{
           return res.json()
        }
        
    }).then(data => {

        songLyrics.innerHTML = `<div class="single-lyrics text-center" id="songLyrics">
        <h2 class="text-success mb-4">${title}</h2>
        <pre class="lyric text-white">${data.lyrics}</pre>
    </div>`;
        
    })       
} 


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const artist = urlParams.get('artist')
const title = urlParams.get('title')
if(artist == null || title == null){
    console.log('null')
}else{
    songFunction(artist, title)
}