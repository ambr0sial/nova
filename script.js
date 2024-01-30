let apiKeyValidated = false;
let contentType = 'movie';
let clickCount = 0;
let currentThemeColor = "#6e40c9";

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('contentTypeSelect').value = 'movie';
	changeContentType();
	const voiceLanguageSelect = document.createElement('select');
	voiceLanguageSelect.id = 'voiceLanguageSelect';
	voiceLanguageSelect.innerHTML = '<option value="en">English</option><option value="fr">French</option>';
	voiceLanguageSelect.addEventListener('change', updateApiUrls);
	document.getElementById('mainContent').appendChild(voiceLanguageSelect);
	updateApiUrls();
});

function handleNovaTitleClick() {
	clickCount++;

	if (clickCount === 5) {
		document.getElementById('novaTitle').textContent = "👁";
	}

	if (clickCount === 10) {
		document.getElementById('novaTitle').textContent = "▲";
		document.getElementById('novaTitle').style.color = "yellow";
		document.getElementById('askTMDB').textContent = "DO NOT SUMMON AT ALL COSTS!";
		document.getElementById('askTMDB').style.color = "red";
		document.getElementById('noteTMDB').textContent = "Note: Remember! Reality is an illusion, the universe is a hologram, buy gold, bye!";
	}
}

document.getElementById('novaTitle').addEventListener('click', handleNovaTitleClick);

function changeContentType() {
	contentType = document.getElementById('contentTypeSelect').value;
	if (contentType === 'tv') {
		getPopularTVShows();
	} else {
		getPopularMovies();
	}
}

function validateApiKey() {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	if (apiKey && apiKey.length > 0) {
		const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

		fetch(url)
		.then(response => {
			if (response.ok) {
				// API key is valid
				apiKeyValidated = true;
				document.getElementById('apiKeyInputSection').style.display = 'none';
				document.getElementById('mainContent').style.display = 'block';
				getPopularMovies();
			} else {
				// Invalid API key
				alert('Invalid API key!! qwq');
			}
		})
		.catch(error => {
			// Error occurred during API request
			alert('An error occurred while validating the API key! 3:');
		});
	} else {
		alert('nova is no dumdum!!');
	}
}

function showAbout() {
	if (apiKeyValidated) {
		document.getElementById('mainContent').style.display = 'none';
		document.getElementById('aboutSection').style.display = 'block';
	} else {
		alert("For stupid reasons, you can only access this page if you're connected.");
	}
}

function returnToMain() {
	document.getElementById('aboutSection').style.display = 'none';
	document.getElementById('mainContent').style.display = 'block';
}

function updateApiUrls() {
	const selectedVoiceLanguage = document.getElementById('voiceLanguageSelect').value;
	const embedUrlBase = selectedVoiceLanguage === 'fr' ?
		'https://frembed.fun/api/' :
		'https://multiembed.mov/';

	window.playMovieOrTVShow = function (tmdbId, seasonNumber = 1, episodeNumber = 1) {
		const apiKey = document.getElementById('tmdbApiKeyInput').value;

		if (contentType === 'tv') {
			const apiUrl = selectedVoiceLanguage === 'fr' ?
				`${embedUrlBase}serie.php?id=${tmdbId}&sa=${seasonNumber}&epi=${episodeNumber}` :
				`${embedUrlBase}?video_id=${tmdbId}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;

			document.getElementById('videoPlayer').innerHTML = `<iframe src="${apiUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
		} else {
			const apiUrl = selectedVoiceLanguage === 'fr' ?
				`${embedUrlBase}film.php?id=${tmdbId}` :
				`${embedUrlBase}?video_id=${tmdbId}&tmdb=1`;

			document.getElementById('videoPlayer').innerHTML = `<iframe src="${apiUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
		}
	};
}

let movies = [];

function filterByGenre() {
	const selectedGenre = document.getElementById('genreSelect').value;
	if (selectedGenre) {
		const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${document.getElementById('tmdbApiKeyInput').value}&with_genres=${selectedGenre}`;

		document.getElementById('loadingSpinner').style.display = 'block';

		fetch(apiUrl)
			.then(response => response.json())
			.then(data => {
				const filteredMovies = data.results;
				displayMovies(filteredMovies);
			})
			.finally(() => {
				document.getElementById('loadingSpinner').style.display = 'none';
			});
	} else {
		displayMovies(movies);
	}
}

function getPopularMovies() {
	const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${document.getElementById('tmdbApiKeyInput').value}`;

	document.getElementById('loadingSpinner').style.display = 'block';

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			movies = data.results;
			displayMovies(movies);
		})
		.finally(() => {
			document.getElementById('loadingSpinner').style.display = 'none';
		});
}

function getPopularTVShows() {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`;

	document.getElementById('loadingSpinner').style.display = 'block';

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			movies = data.results;
			displayMovies(movies);
		})
		.finally(() => {
			document.getElementById('loadingSpinner').style.display = 'none';
		});
}

function populateSeasonsAndEpisodes(selectedTVShow) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const tvShowId = selectedTVShow.id;
	const apiUrl = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}&append_to_response=seasons`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const tvShowName = data.name;
			document.getElementById('novaTitle').textContent = tvShowName;

			const seasons = data.seasons.filter(season => season.season_number > 0);

			const seasonSelect = document.getElementById('seasonSelect');
			seasonSelect.innerHTML = '';

			seasons.forEach(season => {
				const option = document.createElement('option');
				option.value = season.season_number;
				option.textContent = `Season ${season.season_number}`;
				seasonSelect.appendChild(option);
			});

			const selectedSeason = seasonSelect.value;
			fetchEpisodes(tvShowId, selectedSeason);

			document.getElementById('tvShowSwitcher').style.display = 'block';
		})
		.catch(error => {
			console.error('Error fetching TV show details:', error);
		});
}

function getTVShowName(tvShowId) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const apiUrl = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`;

	return fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			return data.name;
		})
		.catch(error => {
			console.error('Error fetching TV show name:', error);
			return '';
		});
}

function fetchEpisodes(tvShowId, seasonNumber) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const apiUrl = `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const episodes = data.episodes;

			const episodeSelect = document.getElementById('episodeSelect');
			episodeSelect.innerHTML = '';

			episodes.forEach(episode => {
				const option = document.createElement('option');
				option.value = episode.episode_number;
				option.textContent = `Episode ${episode.episode_number}: ${episode.name}`;
				episodeSelect.appendChild(option);
			});
		})
		.catch(error => {
			console.error('Error fetching TV show episodes:', error);
		});
}

function updateEpisodeSelect() {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const selectedSeason = document.getElementById('seasonSelect').value;
	const selectedTVShow = getSelectedTVShow();
	fetchEpisodes(selectedTVShow.id, selectedSeason);
	playTVShowEpisode(selectedTVShow.id, selectedSeason, 1);
}

function searchMovies() {
	const query = document.getElementById('searchInput').value;
	const apiUrl = `https://api.themoviedb.org/3/search/${contentType}?api_key=${document.getElementById('tmdbApiKeyInput').value}&query=${query}`;

	document.getElementById('loadingSpinner').style.display = 'block';

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			movies = data.results;
			displayMovies(movies);
		})
		.finally(() => {
			document.getElementById('loadingSpinner').style.display = 'none';
		});
}

function displayMovies(movies) {
	const popularMoviesContainer = document.getElementById('popularMovies');
	const tvShowSwitcher = document.getElementById('tvShowSwitcher');

	popularMoviesContainer.innerHTML = '';
	tvShowSwitcher.style.display = contentType === 'tv' ? 'block' : 'none';

	movies.forEach((movie, index) => {
		const card = document.createElement('div');
		card.className = 'card';

		const thumbnail = document.createElement('img');
		thumbnail.src = movie.poster_path ? `https://image.tmdb.org/t/p/w154${movie.poster_path}` : 'https://via.placeholder.com/154x231.png?text=No+Image';
		thumbnail.alt = movie.title;
		thumbnail.style.borderRadius = '10px';
		thumbnail.style.cursor = 'pointer';

		const titleButton = document.createElement('button');
		titleButton.textContent = contentType === 'tv' ? movie.original_name : movie.title;

		titleButton.addEventListener('click', function () {
			if (contentType === 'tv') {
				populateSeasonsAndEpisodes(movie);
			}
			playMovie(movie.id);
		});

		thumbnail.addEventListener('click', function () {
            if (contentType === 'tv') {
                populateSeasonsAndEpisodes(movie);
            }
            playMovie(movie.id);
        });

		const movieInfoContainer = document.createElement('div');
		movieInfoContainer.className = 'movie-info';

		const rating = document.createElement('p');
		rating.textContent = `Rating: ${movie.vote_average}`;

		const releaseDate = document.createElement('p');
		releaseDate.textContent = `Release Date: ${movie.release_date}`;

		movieInfoContainer.appendChild(thumbnail);
		movieInfoContainer.appendChild(titleButton);
		movieInfoContainer.appendChild(rating);
		movieInfoContainer.appendChild(releaseDate);

		card.appendChild(movieInfoContainer);

		popularMoviesContainer.appendChild(card);
	});
}

let openContextMenu = null;

function showContextMenu(event, tmdbId) {
	if (openContextMenu) {
		openContextMenu.remove();
		openContextMenu = null;
	}

	const contextMenuCard = document.createElement('div');
	contextMenuCard.className = 'context-menu-card';
	contextMenuCard.style.left = `${event.pageX}px`;
	contextMenuCard.style.top = `${event.pageY}px`;

	const watchMovieButton = document.createElement('button');
	watchMovieButton.textContent = 'Watch Movie';
	watchMovieButton.onclick = function () {
		playMovie(tmdbId);
		contextMenuCard.remove();
		openContextMenu = null;
	};

	const watchTrailerButton = document.createElement('button');
	watchTrailerButton.textContent = 'Watch Trailer';
	watchTrailerButton.onclick = function () {
		playTrailer(tmdbId);
		contextMenuCard.remove();
		openContextMenu = null;
	};

	contextMenuCard.appendChild(watchMovieButton);
	contextMenuCard.appendChild(watchTrailerButton);

	document.body.appendChild(contextMenuCard);
	openContextMenu = contextMenuCard;
}

document.addEventListener('click', function (event) {
	if (openContextMenu && !openContextMenu.contains(event.target)) {
		openContextMenu.remove();
		openContextMenu = null;
	}
});

function generateRandomMovie() {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const maxPages = 50;

	const randomPage = Math.floor(Math.random() * maxPages) + 1;

	fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${randomPage}`)
		.then(response => response.json())
		.then(data => {
			if (data.results && data.results.length > 0) {
				const randomMovies = data.results;
				const randomMovie = randomMovies[Math.floor(Math.random() * randomMovies.length)];
				playMovie(randomMovie.id);
			} else {
				console.error('No results found on the random page:', randomPage);
			}
		})
		.catch(error => {
			console.error('Error fetching random movie:', error);
		});
}

function playTrailer(tmdbId) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;

	fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${apiKey}`)
		.then(response => response.json())
		.then(data => {
			if (data.results && data.results.length > 0) {
				const trailer = data.results.find(video => video.type === 'Trailer');

				if (trailer) {
					const embedUrl = `https://www.youtube.com/embed/${trailer.key}`;
					document.getElementById('videoPlayer').innerHTML = `<iframe width="800" height="450" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
				} else {
					console.error('No trailer found for the selected movie.');
				}
			} else {
				console.error('No video results for the selected movie.');
			}
		})
		.catch(error => {
			console.error('Error fetching trailer:', error);
		});
}

function playMovieOrTVShow(tmdbId, seasonNumber = 1, episodeNumber = 1) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	let embedUrl;
	if (contentType === 'tv') {
		embedUrl = `https://frembed.fun/api/serie.php?id=${tmdbId}&sa=${seasonNumber}&epi=${episodeNumber}&lang=${voiceLanguage}`;
	} else {
		embedUrl = `https://frembed.fun/api/film.php?id=${tmdbId}&lang=${voiceLanguage}`;
	}
	document.getElementById('videoPlayer').innerHTML = `<iframe src="${embedUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
}

function playMovie(tmdbId) {
	playMovieOrTVShow(tmdbId);
}

function playTVShowEpisode(tvShowId, seasonNumber, episodeNumber) {
	const apiKey = document.getElementById('tmdbApiKeyInput').value;
	const embedUrl = `https://multiembed.mov/?video_id=${tvShowId}&tmdb=1`;

	if (contentType === 'tv') {
		document.getElementById('videoPlayer').innerHTML = `<iframe src="${embedUrl}&s=${seasonNumber}&e=${episodeNumber}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
	} else {
		document.getElementById('videoPlayer').innerHTML = `<iframe src="${embedUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
	}
}

function closeBanner() {
	document.getElementById("stickyBanner").style.display = "none";
}

document.getElementById('seasonSelect').addEventListener('change', function () {
	updateEpisodeSelect();
});

document.getElementById('episodeSelect').addEventListener('change', function () {
	const tvShowId = movies[0].id;
	const selectedSeason = document.getElementById('seasonSelect').value;
	const selectedEpisode = document.getElementById('episodeSelect').value;

	playTVShowEpisode(tvShowId, selectedSeason, selectedEpisode);
});

function getSelectedTVShow() {
	const selectedTVShowIndex = document.getElementById('popularMoviesContainer').selectedIndex;
	return movies[selectedTVShowIndex];
}

function usePublicApiKey() {
    const publicApiKey = "1070730380f5fee0d87cf0382670b255";
    document.getElementById('tmdbApiKeyInput').value = publicApiKey;
    validateApiKey();
}