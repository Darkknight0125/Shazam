// Consts
/*const apikey = "7543524441a260664a97044b8e2dc621";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
}


// Boots up the app
function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });
}

function buildBannerSection(movie){
}


function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                fetchAndbuildMovieSection(
                    apiPaths.fetchMoviesList(category.id),
                    category.name
                );
            });
        }
        // console.table(movies);
    })
    .catch(err=>console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results);
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies.slice(0,4), categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName){
    console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');
    
    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');

    const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container
    moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}*/


window.addEventListener('load',function() {
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})

document.addEventListener("DOMContentLoaded", function() {
    // Simulate loading time
    setTimeout(function() {
        // Hide loading screen
        document.getElementById("loading-screen").style.display = "none";
        // Show content
        document.getElementById("content").style.display = "block";
    }, 2000); // 5000 milliseconds = 5 seconds

});

// Wait for the page to load
window.onload = function() {
    // Set a timeout to show the popup login after 10 seconds
    setTimeout(function() {
      showPopup();
    }, 5000);
  }
  
  // Function to show the popup login
  function showPopup() {
    document.getElementById("popup-login").style.display = "block";
    document.body.classList.add("blur-background");
    document.getElementsByClassName("popup").remove("blur-background");
  }
  
  // Function to close the popup login
  function closePopup() {
    event.preventDefault();
    document.body.classList.remove("blur-background");
    document.getElementById("popup-login").style.display = "none";
  }

  function openSignupPopup() {
    event.preventDefault();
    document.getElementById("popup-login").style.display = "none";
    document.getElementById("popup-signup").style.display = "block";
    document.body.classList.add("blur-background");
}

function closeSignupPopup() {
    event.preventDefault();
    document.body.classList.remove("blur-background");
    document.getElementById("popup-signup").style.display = "none";
}

/*function login(){
    event.preventDefault();
}*/

function signUp(){
    event.preventDefault();
}

