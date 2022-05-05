const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src = "${imgSrc}">
        ${movie.Title} (${movie.Year})
        `;
    },
    onOptionSelect(movie) {
        onMovieSelect(movie);
        if (document.querySelector('.tutorial')) {
            document.querySelector('.tutorial').classList.add('is-hidden');
        }
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params : {
                apikey: '66c25d5e',
                s     : searchTerm
            }
        });
    
        return response.data.Search;
    
        if (response.data.Error) {
            return [];
        }
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    widget: document.querySelector('.autocomplete')
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://cors-everywhere.herokuapp.com/http://www.omdbapi.com/', {
        params : {
            apikey: '66c25d5e',
            i     : movie.imdbID
        }
    });
    console.log(response.data);
    if (!summaryElement) summaryElement = document.querySelector('#summary')
       summaryElement.innerHTML         = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data
    } else if (side === 'right') {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    console.log('comparing. . .');

    const leftSideStats  = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        
        const leftSideValue  = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
}

const movieTemplate = (movieDetail) => {
    const boxOffice = parseInt(
        movieDetail.BoxOffice
        .replace(/\$/g, '')
        .replace(/,/g, '')
    );
    const metascore       = parseInt(movieDetail.Metascore);
    const imdbRatingScore = parseFloat(movieDetail.imdbRating);
    const imdbVoteScore   = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards          = movieDetail.Awards.split(' ').reduce((previous, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return previous;
        } else {
            return previous + value;
        }   
    }, 0);
    

    return `
        <article class = "media">
        <figure  class = "media-left">
        <p       class = "image">
        <img     src   = "${movieDetail.Poster}" alt = "">
                </p>
            </figure>
            <div class = "media-content">
            <div class = "content">
                    <h1><b>${movieDetail.Title}</b></h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                                                                                   <p>Starring: ${movieDetail.Actors}</p>
                                                                        <p>Release Date       : ${movieDetail.Released}</p>
                </div>
            </div>
        </article>

        <div>
        <article data-value = ${awards} class = "notification is-primary">
        <p       class      = "title">${movieDetail.Awards}</p>
        <p       class      = "subtitle">Awards</p>
        </article>

        <article data-value = ${boxOffice} class = "notification is-primary">
        <p       class      = "title">${movieDetail.BoxOffice}</p>
        <p       class      = "subtitle">Box Office</p>
        </article>

        <article data-value = ${metascore} class = "notification is-primary">
        <p       class      = "title">${movieDetail.Metascore}</p>
        <p       class      = "subtitle">Metascore</p>
        </article>

        <article data-value = ${imdbRatingScore} class = "notification is-primary">
        <p       class      = "title">${movieDetail.imdbRating}</p>
        <p       class      = "subtitle">IMDB Ratingi</p>
        </article>

        <article data-value = ${imdbVoteScore} class = "notification is-primary">
        <p       class      = "title">${movieDetail.imdbVotes}</p>
        <p       class      = "subtitle">IMDB Votes</p>
        </article>
        </div>
        
    `;
};

const compareButton = document.querySelector('#compareMovies');
const containerDiv  = document.querySelector('#containerDiv');
const h1            = document.querySelector('h1');


compareButton.addEventListener('click', ()=> {
    containerDiv.innerHTML = `
        <div class = "columns">
        <div class = "column">
        <div id    = "left-autocomplete"></div>
        <div id    = "left-summary"></div>
            </div>
  
            <div class = "column">
            <div id    = "right-autocomplete"></div>
            <div id    = "right-summary"></div>
            </div>
        </div>
  
        <div class = "column is-half notification is-primary tutorial">
        <h1  class = "title">Search For Movies on Both Sides To Compare</h1>
        </div>
    `;
    // h1.innerHTML = `
    //     <h1 class = "title">
    //     Compare Movies
    //     <span class = "icon">
    //     <i    class = "fas fa-film"></i>
    //     </span>
    //     </h1>
    // `
    createAutoComplete({
        ...autoCompleteConfig,
        widget: document.querySelector('#left-autocomplete'),
        onOptionSelect(movie) {
            onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
            if (document.querySelector('.tutorial')) {
                document.querySelector('.tutorial').classList.add('is-hidden');
            }
        }
    });
    createAutoComplete({
        ...autoCompleteConfig,
        widget: document.querySelector('#right-autocomplete'),
        onOptionSelect(movie) {
            onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
            if (document.querySelector('.tutorial')) {
                document.querySelector('.tutorial').classList.add('is-hidden');
            }
        },
    });
    console.log('button clicked');
})

h1.addEventListener('click', ()=> {
    window.location.reload();
})