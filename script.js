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

  // Check API status every 5 seconds
  setInterval(checkApiStatus, 5000);

  // Check API status on initial page load
  checkApiStatus();
}


const populateModal = async (movie) => {
  // Retrieving modal elements
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

  // Retrieving movie details from API
  const movieDetails = await fetchMovies(movie.id);

  // Displaying the modal
  modalContainer.style.display = "flex";

  // Function to center the modal on the screen
  const centerModal = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const modalHeight = modalContainer.offsetHeight;
    const topPosition = scrollTop + (windowHeight - modalHeight) / 2;
    modalContainer.style.top = `${topPosition}px`;
  };

  // Center the modal after a short delay to give the DOM time to update
  setTimeout(centerModal, 100);

  // Function to close the modal
  const closeModal = () => {
    modalContainer.style.display = "none";
  };

  // Added event listener for modal close button
  modalCloseBtn.addEventListener("click", closeModal);

  // Filling modal information with movie details
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
    // Recovery of the best films
    const fetchedBestMovies = await fetchMovies("?sort_by=-imdb_score");
    const bestMovie = fetchedBestMovies.results[0];

    // Selecting elements in HTML by their ID
    const imgElement = document.getElementById('bestMovieImage');
    const titleElement = document.getElementById('bestMovieTitle');
    const categoryElement = document.getElementById('bestMovieCategory');
    const scoreElement = document.getElementById('bestMovieScore');
    const descriptionElement = document.getElementById('bestMovieDescription');
    const moreInfoBtn = document.getElementById('buttonBestMovie');

    // Retrieving Best Picture Details
    const movieDetails = await fetchMovies(bestMovie.url.split('/').pop());

    // Assigning values ​​to HTML elements
    imgElement.src = bestMovie.image_url;
    titleElement.innerText = bestMovie.title;
    categoryElement.innerText = bestMovie.genres[0];
    scoreElement.innerText = bestMovie.imdb_score;
    descriptionElement.innerText = movieDetails.description;

    // Added event to open modal with more information
    moreInfoBtn.addEventListener("click", () => populateModal(bestMovie));
  } catch (error) {
    console.error(error);
  }
};


const searchTopRatedCategoryMovies = async (idPrevBtn, idNextBtn, category, elementId) => {
  try {
    let movies = [];
    let page = 1;

    // Recovering movies of specified category
    while (movies.length < 7) {
      const fetchedMovies = await fetchMovies(`?${category}page=${page}&sort_by=-imdb_score`);
      const currentMovies = fetchedMovies.results;

      movies = movies.concat(currentMovies);

      // Checking the pagination
      if (fetchedMovies.next) {
        page++;
      } else {
        break;
      }
    }

    // Clean up previous content
    const moviesContainer = document.getElementById(elementId);
    moviesContainer.innerHTML = '';

    // Viewing movies in the specified container
    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
      img.addEventListener("click", () => populateModal(movie));
    });
    
    // Management of navigation buttons
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

// Function to scroll movie container to current index
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

// Defining categories and their corresponding navigation buttons
const categories = [
  { prevBtn: 'prevBtnCategory1', nextBtn: 'nextBtnCategory1', genre: 'Romance', containerId: 'movies-container-romance' },
  { prevBtn: 'prevBtnCategory2', nextBtn: 'nextBtnCategory2', genre: 'Biography', containerId: 'movies-container-biography' },
  { prevBtn: 'prevBtnCategory3', nextBtn: 'nextBtnCategory3', genre: 'Drama', containerId: 'movies-container-drama' }
];

// Function to add event listeners to movie categories
categories.forEach(category => {
  document.addEventListener('DOMContentLoaded', () => {
    searchTopRatedCategoryMovies(category.prevBtn, category.nextBtn, `genre=${category.genre}&`, category.containerId);
  });
});

function playBestMovie() {
  // Redirects to the specified URL when the button is clicked
  window.location.href = 'https://youtu.be/kjIk-cRU0mk';
}
