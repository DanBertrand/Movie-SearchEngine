class Movie {
    constructor(title, poster, year, id, plot) {
        this.title = title;
        this.poster = poster;
        this.year = year;
        this.id = id;
        this.plot = plot;
    };
};

class Search {
    constructor(totalResults, movies) {
        this.totalResults = totalResults;
        this.movies = movies;
    }

    display = () => {
        let array = this.movies;
        let section = document.getElementById("display");
        let result = document.getElementById("result");
        result.innerHTML = `Found ${array.length} movies`

        for (i = 0; i < array.length; i++) {
            section.innerHTML += `
                        <div class="card">
                            <div class="row">
                                <div class="col-4" id="image-container">
                                    <img src=${array[i].poster} class="image" alt="picture comming soon">
                                </div>
                                <div class="col-8 right-card">
                                    <div>
                                        <h2>${array[i].title}</h2>
                                        <h3>${array[i].year}</h3>
                                    </div>
                                    <div>
                                        <button id="movie${i}" type="button" class="btn btn-outline-secondary">Read More</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
        };
    }
};

search = () => {
    const input = document.getElementById("inputbar").value;
    let URL = `http://www.omdbapi.com/?apikey=dd2a1e61&s=${input}`
    fetch(URL)
        .then((response) => response.json())
        .then((item) => {
            mySearch = new Search(item.totalResults)
            let array = item.Search;
            let movieArray = [];
            let section = document.getElementById("display");
            section.innerHTML = "";

            if (array == undefined) {
                let section = document.getElementById("result");
                section.innerHTML = `No Results`
            } else {
                for (i = 0; i < array.length; i++) {
                    let movie = new Movie()
                    movie.title = array[i].Title;
                    movie.year = array[i].Year;
                    movie.poster = array[i].Poster;
                    movieArray.push(movie)
                }
                mySearch.movies = movieArray
                mySearch.display()

                let observer = new IntersectionObserver(function(entries) {

                    entries.forEach(function(entry) {

                        if (entry.intersectionRatio > 0.4) {
                            entry.target.classList.remove('invisible')
                        } else {
                            entry.target.classList.add('invisible')
                        }
                    })

                }, {
                    threshold: [0.4]
                })


                let cards = document.querySelectorAll(`.card`)

                cards.forEach(function(card) {
                    card.classList.add('invisible')
                    observer.observe(card)
                })
                return mySearch
            }
        });
};

popUp = (e) => {
    let id = e.toElement.id.slice(5, 7)
    let click = parseInt(id)


    if (click >= 0) {
        let movie = mySearch.movies[click]
        let URL = `http://www.omdbapi.com/?apikey=dd2a1e61&t=${movie.title}`

        fetch(URL)
            .then((response) => response.json())
            .then((item) => {

                let myModal = document.getElementById("myModal");
                let popUpContent = document.getElementById("movieinfo");
                let closeButton = document.getElementById("close");

                popUpContent.innerHTML = `
                        <div>
                            <div class="row">
                                <div class="col-4">
                                    <img src=${movie.poster} class="image" alt="picture comming soon">
                                </div>
                                <div class="col-8 pop-up-right-card">
                                    <div>
                                        <h2>${movie.title}</h2>
                                        <p>Director: ${item.Director}</p>
                                        <p>${item.Released}</p>
                                        <p>Duration: ${item.Runtime}</p>
                                        <p>Actors: ${item.Actors}</p>
                                    </div>
                                    <div>
                                        <p>Plot: ${item.Plot}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                myModal.style.display = "block";
            });
    }
};

let mySearch;
let myModal = document.getElementById("myModal");

document.getElementById("send").addEventListener("click", search);

document.getElementById("inputbar").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send").click();
    }
});

document.addEventListener("click", popUp);

window.onclick = function(event) {
    if (event.target) {
        myModal.style.display = "none";
    }
};