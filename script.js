document.addEventListener('DOMContentLoaded', () => {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/titles/');
      if (response.ok) {
        setStatus(true);
      } else {
        setStatus(false);
      }
    } catch (error) {
      setStatus(false);
    }
  };

  const setStatus = (isOnline) => {
    if (isOnline) {
      statusIndicator.classList.remove('offline');
      statusIndicator.classList.add('online');
      statusText.innerText = 'API en ligne';
    } else {
      statusIndicator.classList.remove('online');
      statusIndicator.classList.add('offline');
      statusText.innerText = 'API hors ligne';
    }
  };

  // Vérifier le statut de l'API toutes les 5 secondes (vous pouvez ajuster cela selon vos besoins)
  setInterval(checkApiStatus, 5000);

  // Vérifier le statut de l'API au chargement initial de la page
  checkApiStatus();
});

const populateModal = async (movie) => {
  const modalContainer = document.getElementById("modal-container");
  const modalCloseBtn = document.getElementById("modal-closeBtn");
  const modalCoverImg = document.getElementById("modal-cover-img");
  const modalDetailsTitle = document.getElementById("modal-details-title");
  const modalDetailsGenre = document.getElementById("modal-details-genre");
  const modalDetailsReleaseDate = document.getElementById("modal-details-releaseDate");
  const modalDetailsImdb = document.getElementById("modal-details-imdb");
  const modalDetailsDirector = document.getElementById("modal-details-director");
  const modalDetailsActors = document.getElementById("modal-details-actors");
  const modalDetailsLength = document.getElementById("modal-details-length");
  const modalDetailsCountry = document.getElementById("modal-details-country");
  const modalDetailsDescription = document.getElementById("modal-details-description");

  const movieDetails = await fetchMovies(movie.id);
  console.log(movieDetails);
  modalContainer.style.display = "flex";

  const centrerBoiteDialogue = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const modalHeight = modalContainer.offsetHeight;
    const topPosition = scrollTop + (windowHeight - modalHeight) / 2;
    
    modalContainer.style.top = `${topPosition}px`;
  };

  // Afficher la boîte de dialogue et centrer après un court délai pour laisser le temps au DOM de se mettre à jour
  setTimeout(() => {
    centrerBoiteDialogue();
  }, 100);

  const closeModal = () => {
    modalContainer.style.display = "none";
  };

  modalCloseBtn.addEventListener("click", closeModal);

  modalCoverImg.setAttribute("src", movie.image_url);
  modalDetailsTitle.textContent = movieDetails.original_title;
  modalDetailsGenre.textContent = movieDetails.genres.join(", ");
  modalDetailsReleaseDate.textContent = movieDetails.date_published;
  modalDetailsImdb.textContent = movieDetails.imdb_score;
  modalDetailsDirector.textContent = movieDetails.directors.join(", ");
  modalDetailsActors.textContent = movieDetails.actors.join(", ");
  modalDetailsLength.textContent = movieDetails.duration + "min";
  modalDetailsCountry.textContent = movieDetails.countries.join(", ");
  modalDetailsDescription.textContent = movieDetails.long_description;
};



const fetchMovies = async (filter) => {
  try {

    const response = await fetch(`http://localhost:8000/api/v1/titles/${filter}`);

    if (!response.ok) {
      throw new Error('Erreur de réseau ou de serveur.');
    }

    return await response.json();
  } catch (error) {

    console.error(error);
  }
};


const searchBestMovie = async () => {
  try {
    const fetchedBestMovies = await fetchMovies("?sort_by=-imdb_score");
    const bestMovie = fetchedBestMovies.results[0];

    
    // Sélectionne l'élément dans le HTML par son ID
    const imgElement = document.getElementById('bestMovieImage');
    const titleElement = document.getElementById('bestMovieTitle');
    const categoryElement = document.getElementById('bestMovieCategory');
    const scoreElement = document.getElementById('bestMovieScore');
    

    const urlElement = await fetchMovies(bestMovie.url.split('/').pop());
    const descriptionElement = document.getElementById('bestMovieDescription');
    const moreInfoBtn = document.getElementById('buttonBestMovie');
    
    imgElement.src = bestMovie.image_url;
    titleElement.innerText = bestMovie.title;
    categoryElement.innerText = bestMovie.genres[0];
    scoreElement.innerText = bestMovie.imdb_score;
    
    descriptionElement.innerText = urlElement.description;
    
    moreInfoBtn.addEventListener("click", () => populateModal(bestMovie));
  } catch (error) {
    console.error(error);
  }
};

const searchTopRatedCategoryMovies = async (idPrevBtn, idNextBtn, category, elementId) => {

  
  try {
    let movies = [];
    let page = 1;

    while (movies.length < 7) {
      const fetchedBestMovies = await fetchMovies(`?${category}page=${page}&sort_by=-imdb_score`);
      const bestMovies = fetchedBestMovies.results;

      movies = movies.concat(bestMovies);

      if (fetchedBestMovies.next) {
        page++;
      } else {
        break;
      }
    }
    const moviesContainer = document.getElementById(elementId);
    moviesContainer.innerHTML = ''; // Nettoyer le contenu précédent

    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
      img.addEventListener("click", () => populateModal(movie));
    });
    
    // Ajouter la logique pour les boutons
    const prevBtn = document.getElementById(idPrevBtn);
    const nextBtn = document.getElementById(idNextBtn);
    let currentIndex = 0;

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        moviesContainer.scrollTo({
          left: moviesContainer.children[currentIndex].offsetLeft,
          behavior: 'smooth'
        });
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < moviesContainer.children.length - 1) {
        currentIndex++;
        moviesContainer.scrollTo({
          left: moviesContainer.children[currentIndex].offsetLeft,
          behavior: 'smooth'
        });
      }
    });

  } catch (error) {
    console.error(error);
  }
  
};



document.addEventListener('DOMContentLoaded', () => {
  searchBestMovie();
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategoryMovies('prevBtnBestRatingFilms', 'nextBtnBestRatingFilms', '', 'movies-container');
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategoryMovies('prevBtnCategory1', 'nextBtnCategory1', 'genre=Romance&', 'movies-container-romance');
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategoryMovies('prevBtnCategory2', 'nextBtnCategory2', 'genre=Biography&', 'movies-container-biography');
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategoryMovies('prevBtnCategory3', 'nextBtnCategory3', 'genre=Drama&', 'movies-container-drama');
});

function playBestMovie() {
  // Redirige vers l'URL spécifiée lorsque le bouton est cliqué
  window.location.href = 'https://youtu.be/kjIk-cRU0mk';
}




