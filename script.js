function setupApiStatusCheck() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/titles/');
      setStatus(response.ok);
    } catch (error) {
      setStatus(false);
    }
  };

  const setStatus = (isOnline) => {
    statusIndicator.classList.toggle('offline', !isOnline);
    statusIndicator.classList.toggle('online', isOnline);
    statusText.innerText = isOnline ? 'API en ligne' : 'API hors ligne';
  };

  // Vérifier le statut de l'API toutes les 5 secondes
  setInterval(checkApiStatus, 5000);

  // Vérifier le statut de l'API au chargement initial de la page
  checkApiStatus();
}


const populateModal = async (movie) => {
  // Récupération des éléments du modal
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

  // Récupération des détails du film depuis l'API
  const movieDetails = await fetchMovies(movie.id);

  // Affichage du modal
  modalContainer.style.display = "flex";

  // Fonction pour centrer le modal sur l'écran
  const centerModal = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const modalHeight = modalContainer.offsetHeight;
    const topPosition = scrollTop + (windowHeight - modalHeight) / 2;
    modalContainer.style.top = `${topPosition}px`;
  };

  // Centrer le modal après un court délai pour laisser le temps au DOM de se mettre à jour
  setTimeout(centerModal, 100);

  // Fonction pour fermer le modal
  const closeModal = () => {
    modalContainer.style.display = "none";
  };

  // Ajout de l'écouteur d'événement pour le bouton de fermeture du modal
  modalCloseBtn.addEventListener("click", closeModal);

  // Remplissage des informations du modal avec les détails du film
  modalCoverImg.setAttribute("src", movie.image_url);
  modalDetailsTitle.textContent = movieDetails.original_title;
  modalDetailsGenre.textContent = movieDetails.genres.join(", ");
  modalDetailsReleaseDate.textContent = movieDetails.date_published;
  modalDetailsImdb.textContent = movieDetails.imdb_score;
  modalDetailsDirector.textContent = movieDetails.directors.join(", ");
  modalDetailsActors.textContent = movieDetails.actors.join(", ");
  modalDetailsLength.textContent = `${movieDetails.duration} min`;
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
    // Récupération des meilleurs films
    const fetchedBestMovies = await fetchMovies("?sort_by=-imdb_score");
    const bestMovie = fetchedBestMovies.results[0];

    // Sélection des éléments dans le HTML par leur ID
    const imgElement = document.getElementById('bestMovieImage');
    const titleElement = document.getElementById('bestMovieTitle');
    const categoryElement = document.getElementById('bestMovieCategory');
    const scoreElement = document.getElementById('bestMovieScore');
    const descriptionElement = document.getElementById('bestMovieDescription');
    const moreInfoBtn = document.getElementById('buttonBestMovie');

    // Récupération des détails du meilleur film
    const movieDetails = await fetchMovies(bestMovie.url.split('/').pop());

    // Attribution des valeurs aux éléments HTML
    imgElement.src = bestMovie.image_url;
    titleElement.innerText = bestMovie.title;
    categoryElement.innerText = bestMovie.genres[0];
    scoreElement.innerText = bestMovie.imdb_score;
    descriptionElement.innerText = movieDetails.description;

    // Ajout de l'événement pour ouvrir le modal avec plus d'informations
    moreInfoBtn.addEventListener("click", () => populateModal(bestMovie));
  } catch (error) {
    console.error(error);
  }
};


const searchTopRatedCategoryMovies = async (idPrevBtn, idNextBtn, category, elementId) => {
  try {
    let movies = [];
    let page = 1;

    // Récupération des films de la catégorie spécifiée
    while (movies.length < 7) {
      const fetchedMovies = await fetchMovies(`?${category}page=${page}&sort_by=-imdb_score`);
      const currentMovies = fetchedMovies.results;

      movies = movies.concat(currentMovies);

      // Vérification de la pagination
      if (fetchedMovies.next) {
        page++;
      } else {
        break;
      }
    }

    // Nettoyer le contenu précédent
    const moviesContainer = document.getElementById(elementId);
    moviesContainer.innerHTML = '';

    // Affichage des films dans le conteneur spécifié
    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
      img.addEventListener("click", () => populateModal(movie));
    });
    
    // Gestion des boutons de navigation
    const prevBtn = document.getElementById(idPrevBtn);
    const nextBtn = document.getElementById(idNextBtn);
    let currentIndex = 0;

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        scrollContainerToCurrentIndex(moviesContainer, currentIndex);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < moviesContainer.children.length - 1) {
        currentIndex++;
        scrollContainerToCurrentIndex(moviesContainer, currentIndex);
      }
    });

  } catch (error) {
    console.error(error);
  }
};

// Fonction pour faire défiler le conteneur de films jusqu'à l'index actuel
const scrollContainerToCurrentIndex = (container, index) => {
  container.scrollTo({
    left: container.children[index].offsetLeft,
    behavior: 'smooth'
  });
};


document.addEventListener('DOMContentLoaded', setupApiStatusCheck);

document.addEventListener('DOMContentLoaded', () => {
  searchBestMovie();
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategoryMovies('prevBtnBestRatingFilms', 'nextBtnBestRatingFilms', '', 'movies-container');
});

// Définition des catégories et de leurs boutons de navigation correspondants
const categories = [
  { prevBtn: 'prevBtnCategory1', nextBtn: 'nextBtnCategory1', genre: 'Romance', containerId: 'movies-container-romance' },
  { prevBtn: 'prevBtnCategory2', nextBtn: 'nextBtnCategory2', genre: 'Biography', containerId: 'movies-container-biography' },
  { prevBtn: 'prevBtnCategory3', nextBtn: 'nextBtnCategory3', genre: 'Drama', containerId: 'movies-container-drama' }
];

// Fonction pour ajouter des écouteurs d'événements aux catégories de films
categories.forEach(category => {
  document.addEventListener('DOMContentLoaded', () => {
    searchTopRatedCategoryMovies(category.prevBtn, category.nextBtn, `genre=${category.genre}&`, category.containerId);
  });
});

function playBestMovie() {
  // Redirige vers l'URL spécifiée lorsque le bouton est cliqué
  window.location.href = 'https://youtu.be/kjIk-cRU0mk';
}
