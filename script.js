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
    
    
    imgElement.src = bestMovie.image_url;
    titleElement.innerText = bestMovie.title;
    categoryElement.innerText = bestMovie.genres[0];
    scoreElement.innerText = bestMovie.imdb_score;
    
    descriptionElement.innerText = urlElement.description;
  } catch (error) {
    console.error(error);
  }
};


const searchTopRatedMovies = async () => {
  try {
    let movies = [];
    let page = 1;

    while (movies.length < 7) {
      const fetchedBestMovies = await fetchMovies(`?page=${page}&sort_by=-imdb_score`);
      const bestMovies = fetchedBestMovies.results;

      movies = movies.concat(bestMovies);

      if (fetchedBestMovies.next) {
        page++;
      } else {
        break;
      }
    }

    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = ''; // Nettoyer le contenu précédent

    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
    });

    // Ajouter la logique pour les boutons de navigation
    const prevBtn = document.getElementById('prevBtnBestRatingFilms');
    const nextBtn = document.getElementById('nextBtnBestRatingFilms');
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


const searchTopRatedCategory1Movies = async () => {

  
  try {
    let movies = [];
    let page = 1;

    while (movies.length < 7) {
      const fetchedBestMovies = await fetchMovies(`?genre=Romance&page=${page}&sort_by=-imdb_score`);
      const bestMovies = fetchedBestMovies.results;

      movies = movies.concat(bestMovies);

      if (fetchedBestMovies.next) {
        page++;
      } else {
        break;
      }
    }
    const moviesContainer = document.getElementById('movies-container-romance');
    moviesContainer.innerHTML = ''; // Nettoyer le contenu précédent

    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
    });

    // Ajouter la logique pour les boutons de navigation
    const prevBtn = document.getElementById('prevBtnCategory1');
    const nextBtn = document.getElementById('nextBtnCategory1');
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


const searchTopRatedCategory2Movies = async () => {

  
  try {
    let movies = [];
    let page = 1;

    while (movies.length < 7) {
      const fetchedBestMovies = await fetchMovies(`?genre=Biography&page=${page}&sort_by=-imdb_score`);
      const bestMovies = fetchedBestMovies.results;

      movies = movies.concat(bestMovies);

      if (fetchedBestMovies.next) {
        page++;
      } else {
        break;
      }
    }
    const moviesContainer = document.getElementById('movies-container-biography');
    moviesContainer.innerHTML = ''; // Nettoyer le contenu précédent

    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
    });

    // Ajouter la logique pour les boutons de navigation
    const prevBtn = document.getElementById('prevBtnCategory2');
    const nextBtn = document.getElementById('nextBtnCategory2');
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


const searchTopRatedCategory3Movies = async () => {

  
  try {
    let movies = [];
    let page = 1;

    while (movies.length < 7) {
      const fetchedBestMovies = await fetchMovies(`?genre=Drama&page=${page}&sort_by=-imdb_score`);
      const bestMovies = fetchedBestMovies.results;

      movies = movies.concat(bestMovies);

      if (fetchedBestMovies.next) {
        page++;
      } else {
        break;
      }
    }
    const moviesContainer = document.getElementById('movies-container-drama');
    moviesContainer.innerHTML = ''; // Nettoyer le contenu précédent

    movies.slice(0, 7).forEach(movie => {
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.title;
      moviesContainer.appendChild(img);
    });

    // Ajouter la logique pour les boutons de navigation
    const prevBtn = document.getElementById('prevBtnCategory3');
    const nextBtn = document.getElementById('nextBtnCategory3');
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
  searchTopRatedMovies();
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategory1Movies();
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategory2Movies();
});

document.addEventListener('DOMContentLoaded', () => {
  searchTopRatedCategory3Movies();
});

function playBestMovie() {
  // Redirige vers l'URL spécifiée lorsque le bouton est cliqué
  window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
}




