async function displaySelectedMedia(media, mediaType) {
    const selectedMovie = document.getElementById('selectedMovie');
    selectedMovie.innerHTML = `
        <div id="mediaContainer" class="flex flex-col lg:flex-row lg:space-x-6 p-4 lg:p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
            <!-- Media Poster -->
            <div id="posterContainer" class="relative w-full lg:w-1/4 mb-4 lg:mb-0 transition-all duration-300 transform-gpu">
                <img id="poster" src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}" class="poster w-full h-auto rounded-lg shadow-lg object-cover transition-transform duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
            </div>

            <!-- Media Details & Controls -->
            <div id="movieInfo" class="w-full lg:w-3/4 flex flex-col space-y-4">
                <!-- Movie Details -->
                <div class="movie-details">
                    <h2 class="text-xl lg:text-3xl font-bold text-white">${media.title || media.name}</h2>
                    <p class="text-sm lg:text-lg text-gray-400">${media.release_date || media.first_air_date}</p>
                    <p class="text-sm lg:text-base text-gray-300">${media.overview}</p>
                    <p class="text-xs lg:text-sm text-gray-400">Type: ${mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>
                </div>

                <!-- Media Options -->
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                    <!-- Language Selection -->
                    <div>
                        <label for="languageSelect" class="block text-xs lg:text-sm font-medium text-gray-300">Language:</label>
                        <select id="languageSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs lg:text-sm">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <!-- Content Provider Selection -->
                    <div>
                        <label for="providerSelect" class="block text-xs lg:text-sm font-medium text-gray-300">Content Provider:</label>
                        <select id="providerSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs lg:text-sm">
                            <option value="vidsrc">VidSrc</option>
                            <option value="vidsrc2">VidSrc2</option>
                            <option value="vidsrcxyz">vidsrcxyz</option> 
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
                        <label for="seasonSelect" class="block text-xs lg:text-sm font-medium text-gray-300">Season:</label>
                        <select id="seasonSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs lg:text-sm">
                            ${media.seasons.map(season => `<option value="${season.season_number}">${season.name}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Episode Selection -->
                    <div>
                        <label for="episodeSelect" class="block text-xs lg:text-sm font-medium text-gray-300">Episode:</label>
                        <select id="episodeSelect" class="mt-1 block w-full bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs lg:text-sm"></select>
                    </div>
                    ` : ''}
                </div>

                <!-- Watch Button -->
                <button id="playButton" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm lg:text-base">
                    Watch Now
                </button>
            </div>
        </div>
        <div id="videoPlayer" class="w-full h-72 lg:h-[80vh] rounded-lg overflow-hidden mt-6 bg-black hidden">
            <!-- Video player will be dynamically inserted here -->
        </div>
    `;

    const playButton = document.getElementById('playButton');
    const languageSelect = document.getElementById('languageSelect');
    const providerSelect = document.getElementById('providerSelect');
    const videoPlayer = selectedMovie.querySelector('#videoPlayer');
    const posterContainer = selectedMovie.querySelector('#posterContainer');
    const movieInfo = selectedMovie.querySelector('#movieInfo');
    const mediaContainer = selectedMovie.querySelector('#mediaContainer');

    // Handle language selection change
    languageSelect.addEventListener('change', () => {
        providerSelect.classList.toggle('hidden', languageSelect.value === 'fr');
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
        seasonSelect.addEventListener('change', updateEpisodes);

        // Event listener for episode change
        episodeSelect.addEventListener('change', () => {
            playButton.click();
        });

        // Initial call to populate episodes
        updateEpisodes();
    }

    // Handle play button click
    playButton.addEventListener('click', async () => {
        if (!videoPlayer || !movieInfo || !posterContainer) {
            console.error("Error: videoPlayer, movieInfo, or posterContainer elements not found.");
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

            endpoint = languageSelect.value === 'fr'
                ? `https://frembed.pro/api/serie.php?id=${media.id}&sa=${seasonNumber}&epi=${episodeNumber}`
                : {
                    'vidsrc': `https://vidsrc.cc/v2/embed/tv/${media.id}?season=${seasonNumber}&episode=${episodeNumber}`,
                    'vidsrc2': `https://vidsrc2.to/embed/tv/${media.id}?season=${seasonNumber}&episode=${episodeNumber}`,
                    'vidsrcxyz': `https://vidsrc.xyz/embed/tv/${media.id}?season=${seasonNumber}&episode=${episodeNumber}`,
                    'superembed': `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`,
                    'embedsoap': `https://www.embedsoap.com/embed/tv/?id=${media.id}&s=${seasonNumber}&e=${episodeNumber}`,
                    'autoembed': `https://autoembed.co/tv/tmdb/${media.id}-${seasonNumber}-${episodeNumber}`,
                    'smashystream': `https://player.smashy.stream/tv/${media.id}?s=${seasonNumber}&e=${episodeNumber}`,
                    'trailer': async () => {
                        const trailerResponse = await fetch(`https://api.themoviedb.org/3/tv/${media.id}/videos?api_key=${localStorage.getItem('apiKey')}`);
                        const trailerData = await trailerResponse.json();
                        const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                        if (trailer) {
                            return `https://www.youtube.com/embed/${trailer.key}`;
                        } else {
                            alert('Trailer not available.');
                            return;
                        }
                    }
                }[providerSelect.value];
        } else {
            endpoint = languageSelect.value === 'fr'
                ? `https://frembed.pro/api/film.php?id=${media.id}`
                : {
                    'vidsrc': `https://vidsrc.cc/v2/embed/movie/${media.id}`,
                    'vidsrc2': `https://vidsrc2.to/embed/movie/${media.id}`,
                    'vidsrcxyz': `https://vidsrc.xyz/embed/movie/${media.id}`,
                    'superembed': `https://multiembed.mov/?video_id=${media.id}&tmdb=1`,
                    'embedsoap': `https://www.embedsoap.com/embed/movie/${media.id}`,
                    'autoembed': `https://autoembed.co/movie/tmdb/${media.id}`,
                    'smashystream': `https://player.smashy.stream/movie/${media.id}`,
                    'trailer': async () => {
                        const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${media.id}/videos?api_key=${localStorage.getItem('apiKey')}`);
                        const trailerData = await trailerResponse.json();
                        const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                        if (trailer) {
                            return `https://www.youtube.com/embed/${trailer.key}`;
                        } else {
                            alert('Trailer not available.');
                            return;
                        }
                    }
                }[providerSelect.value];
        }

        if (typeof endpoint === 'function') {
            endpoint = await endpoint();
        }

        // Remove poster and its menu
        mediaContainer.removeChild(posterContainer);
        mediaContainer.removeChild(movieInfo);

        // Show video player
        videoPlayer.innerHTML = `<iframe src="${endpoint}" class="w-full h-full" allowfullscreen></iframe>`;
        videoPlayer.classList.remove('hidden');
    });

    selectedMovie.scrollIntoView({ behavior: 'smooth' });
}
