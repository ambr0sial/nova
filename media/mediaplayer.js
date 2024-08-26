async function displaySelectedMedia(media, mediaType) {
    const selectedMovie = document.getElementById('selectedMovie');
    selectedMovie.innerHTML = `
        <div class="flex flex-col md:flex-row md:space-x-8 p-4 md:p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
            <!-- Media Poster -->
            <div class="relative w-full md:w-1/4 mb-6 md:mb-0">
                <img id="poster" src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}" class="w-full h-auto rounded-lg shadow-lg object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 rounded-lg"></div>
            </div>

            <!-- Media Details & Controls -->
            <div id="movieInfo" class="w-full md:w-3/4 flex flex-col space-y-6">
                <h2 class="text-4xl font-bold text-white">${media.title || media.name}</h2>
                <p class="text-lg text-gray-400">${media.release_date || media.first_air_date}</p>
                <p class="text-base text-gray-300">${media.overview}</p>
                <p class="text-sm text-gray-400">Type: ${mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>

                <!-- Media Options -->
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                    <!-- Language Selection -->
                    <div>
                        <label for="languageSelect" class="block text-sm font-medium text-gray-300">Language:</label>
                        <select id="languageSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <!-- Content Provider Selection -->
                    <div>
                        <label for="providerSelect" class="block text-sm font-medium text-gray-300">Content Provider:</label>
                        <select id="providerSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="superembed">SuperEmbed</option>
                            <option value="embedsoap">EmbedSoap</option>
                            <option value="autoembed">AutoEmbed</option>
                            <option value="smashystream">SmashyStream</option>
                            <option value="trailer">Trailer</option>
                        </select>
                    </div>

                    ${mediaType === 'tv' ? `
                    <!-- Season Selection -->
                    <div>
                        <label for="seasonSelect" class="block text-sm font-medium text-gray-300">Season:</label>
                        <select id="seasonSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            ${media.seasons.map(season => `<option value="${season.season_number}">${season.name}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Episode Selection -->
                    <div>
                        <label for="episodeSelect" class="block text-sm font-medium text-gray-300">Episode:</label>
                        <select id="episodeSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"></select>
                    </div>
                    ` : ''}
                </div>

                <!-- Watch Button -->
                <button id="playButton" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                    Watch Now
                </button>
            </div>
        </div>
        <div id="videoPlayer" class="w-full h-64 md:h-[70vh] rounded-lg overflow-hidden mt-6 hidden bg-black">
            <!-- Video player will be dynamically inserted here -->
        </div>
    `;

    const playButton = document.getElementById('playButton');
    const languageSelect = document.getElementById('languageSelect');
    const providerSelect = document.getElementById('providerSelect');

    // Handle language selection change
    languageSelect.addEventListener('change', () => {
        if (languageSelect.value === 'fr') {
            providerSelect.classList.add('hidden');
        } else {
            providerSelect.classList.remove('hidden');
        }
        playButton.click();
    });

    providerSelect.addEventListener('change', () => {
        playButton.click();
    });

    if (mediaType === 'tv') {
        const seasonSelect = document.getElementById('seasonSelect');
        const episodeSelect = document.getElementById('episodeSelect');

        async function updateEpisodes() {
            const seasonNumber = seasonSelect.value;
            const response = await fetch(`https://api.themoviedb.org/3/tv/${media.id}/season/${seasonNumber}?api_key=${localStorage.getItem('apiKey')}`);
            if (response.ok) {
                const season = await response.json();
                episodeSelect.innerHTML = season.episodes.map(episode =>
                    `<option value="${episode.episode_number}">${episode.episode_number}: ${episode.name}</option>`
                ).join('');
            } else {
                console.error('Failed to fetch season details.');
            }
        }

        // Event listener for season change
        seasonSelect.addEventListener('change', async () => {
            await updateEpisodes();
        });

        // Event listener for episode change
        episodeSelect.addEventListener('change', () => {
            playButton.click();
        });

        // Initial call to populate episodes
        updateEpisodes();
    }

    // Handle play button click
    playButton.addEventListener('click', async () => {
        const videoPlayer = selectedMovie.querySelector('#videoPlayer');
        const movieInfo = selectedMovie.querySelector('#movieInfo');
        const poster = selectedMovie.querySelector('#poster');

        if (!videoPlayer || !movieInfo || !poster) {
            console.error("Error: videoPlayer, movieInfo, or poster elements not found.");
            return;
        }

        let endpoint;

        if (mediaType === 'tv') {
            const seasonSelect = document.getElementById('seasonSelect');
            const episodeSelect = document.getElementById('episodeSelect');

            const seasonNumber = seasonSelect.value;
            const episodeNumber = episodeSelect.value;

            if (!seasonNumber || !episodeNumber) {
                console.error("Error: Season number or episode number not selected.");
                return;
            }

            if (languageSelect.value === 'fr') {
                endpoint = `https://frembed.pro/api/serie.php?id=${media.id}&sa=${seasonNumber}&epi=${episodeNumber}`;
            } else {
                switch (providerSelect.value) {
                    case 'superembed':
                        endpoint = `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;
                        break;
                    case 'embedsoap':
                        endpoint = `https://www.embedsoap.com/embed/tv/?id=${media.id}&s=${seasonNumber}&e=${episodeNumber}`;
                        break;
                    case 'autoembed':
                        endpoint = `https://autoembed.co/tv/tmdb/${media.id}-${seasonNumber}-${episodeNumber}`;
                        break;
                    case 'smashystream':
                        endpoint = `https://player.smashy.stream/tv/${media.id}?s=${seasonNumber}&e=${episodeNumber}`;
                        break;
                    case 'trailer':
                        const trailerResponse = await fetch(`https://api.themoviedb.org/3/tv/${media.id}/videos?api_key=${localStorage.getItem('apiKey')}`);
                        const trailerData = await trailerResponse.json();
                        const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                        if (trailer) {
                            endpoint = `https://www.youtube.com/embed/${trailer.key}`;
                        } else {
                            alert('Trailer not available.');
                            return;
                        }
                        break;
                }
            }
        } else {
            if (languageSelect.value === 'fr') {
                endpoint = `https://frembed.pro/api/film.php?id=${media.id}`;
            } else {
                switch (providerSelect.value) {
                    case 'superembed':
                        endpoint = `https://multiembed.mov/?video_id=${media.id}&tmdb=1`;
                        break;
                    case 'embedsoap':
                        endpoint = `https://www.embedsoap.com/embed/movie/${media.id}`;
                        break;
                    case 'autoembed':
                        endpoint = `https://autoembed.co/movie/tmdb/${media.id}`;
                        break;
                    case 'smashystream':
                        endpoint = `https://player.smashy.stream/movie/${media.id}`;
                        break;
                    case 'trailer':
                        const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${media.id}/videos?api_key=${localStorage.getItem('apiKey')}`);
                        const trailerData = await trailerResponse.json();
                        const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                        if (trailer) {
                            endpoint = `https://www.youtube.com/embed/${trailer.key}`;
                        } else {
                            alert('Trailer not available.');
                            return;
                        }
                        break;
                }
            }
        }

        videoPlayer.innerHTML = `<iframe src="${endpoint}" class="w-full h-full" allowfullscreen></iframe>`;
        videoPlayer.classList.remove('hidden');
        movieInfo.classList.add('hidden');
    });

    selectedMovie.scrollIntoView({ behavior: 'smooth' });
}
