async function displaySelectedMedia(media, mediaType) {
    const selectedMovie = document.getElementById('selectedMovie');
    const apiKey = localStorage.getItem('apiKey');

    selectedMovie.innerHTML = `
        <div class="w-1/3">
            <img id="poster" src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}" class="rounded-lg">
            <div class="mt-4">
                <!-- Language Select Dropdown -->
                <label for="languageSelect" class="block text-sm font-medium text-zinc-300">Select Language:</label>
                <select id="languageSelect" class="dropdown mt-1 block w-full">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>

                <!-- Provider Select Dropdown -->
                <label for="providerSelect" class="block text-sm font-medium text-zinc-300 mt-2">Select Content Provider:</label>
                <select id="providerSelect" class="dropdown mt-1 block w-full">
                    <option value="vidsrc">VidSrc (Top Provider)</option>
                    <optgroup label="Alternative Providers">
                        <option value="vidsrc2">VidSrc2</option>
                        <option value="vidsrcxyz">VidSrcXYZ</option>
                        <option value="superembed">SuperEmbed</option>
                        <option value="embedsoap">EmbedSoap</option>
                        <option value="autoembed">AutoEmbed</option>
                        <option value="smashystream">SmashyStream</option>
                    </optgroup>
                    <option value="trailer">Trailer</option>
                </select>
            </div>
            ${mediaType === 'tv' ? `
            <div class="mt-4">
                <!-- Season Select Dropdown -->
                <label for="seasonSelect" class="block text-sm font-medium text-zinc-300">Select Season:</label>
                <select id="seasonSelect" class="dropdown mt-1 block w-full">
                    ${media.seasons.map(season =>
        `<option value="${season.season_number}">Season ${season.season_number}: ${season.name}</option>`
    ).join('')}
                </select>

                <!-- Episode Select Dropdown -->
                <label for="episodeSelect" class="block text-sm font-medium text-zinc-300 mt-2">Select Episode:</label>
                <select id="episodeSelect" class="dropdown mt-1 block w-full"></select>
            </div>
            ` : ''}
        </div>
        <div id="movieInfo" class="w-2/3 pl-4">
            <h2 class="text-2xl font-bold">${media.title || media.name}</h2>
            <p class="text-sm text-zinc-400">${media.release_date || media.first_air_date}</p>
            <p class="mt-4">${media.overview}</p>
            <p class="text-sm text-zinc-400">Type: ${mediaType === 'movie' ? 'Movie' : 'TV Show'}</p>
            <button id="playButton" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Play
            </button>
        </div>
        <div id="videoPlayer" class="w-full h-full rounded-lg overflow-hidden hidden"></div>
    `;

    const playButton = document.getElementById('playButton');
    const videoPlayer = selectedMovie.querySelector('#videoPlayer');
    const movieInfo = selectedMovie.querySelector('#movieInfo');
    const languageSelect = document.getElementById('languageSelect');
    const providerSelect = document.getElementById('providerSelect');
    const seasonSelect = document.getElementById('seasonSelect');
    const episodeSelect = document.getElementById('episodeSelect');

    async function updateVideo() {
        if (!videoPlayer || !movieInfo) {
            console.error("Error: videoPlayer or movieInfo elements not found.");
            return;
        }

        let endpoint;
        const language = languageSelect.value;
        const provider = providerSelect.value;

        if (mediaType === 'tv') {
            const seasonNumber = seasonSelect.value;
            const episodeNumber = episodeSelect.value;

            if (!seasonNumber || !episodeNumber) {
                console.error("Error: Season number or episode number not selected.");
                return;
            }

            switch (provider) {
                case 'vidsrc':
                    endpoint = `https://vidsrc.cc/v2/embed/tv/${media.id}/${seasonNumber}/${episodeNumber}`;
                    break;
                case 'vidsrc2':
                    endpoint = `https://vidsrc2.to/embed/tv/${media.id}?season=${seasonNumber}&episode=${episodeNumber}`;
                    break;
                case 'vidsrcxyz':
                    endpoint = `https://vidsrc.xyz/embed/tv/${media.id}?season=${seasonNumber}&episode=${episodeNumber}`;
                    break;
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
                    const trailerResponse = await fetch(`https://api.themoviedb.org/3/tv/${media.id}/videos?api_key=${apiKey}`);
                    const trailerData = await trailerResponse.json();
                    const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                    if (trailer) {
                        endpoint = `https://www.youtube.com/embed/${trailer.key}`;
                    } else {
                        alert('Trailer not available.');
                        return;
                    }
                    break;
                default:
                    console.error('Provider not recognized.');
                    return;
            }
        } else {
            switch (provider) {
                case 'vidsrc':
                    endpoint = `https://vidsrc.cc/v2/embed/movie/${media.id}`;
                    break;
                case 'vidsrc2':
                    endpoint = `https://vidsrc2.to/embed/movie/${media.id}`;
                    break;
                case 'vidsrcxyz':
                    endpoint = `https://vidsrc.xyz/embed/movie/${media.id}`;
                    break;
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
                    const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${media.id}/videos?api_key=${apiKey}`);
                    const trailerData = await trailerResponse.json();
                    const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                    if (trailer) {
                        endpoint = `https://www.youtube.com/embed/${trailer.key}`;
                    } else {
                        alert('Trailer not available.');
                        return;
                    }
                    break;
                default:
                    console.error('Provider not recognized.');
                    return;
            }
        }

        videoPlayer.innerHTML = `<iframe src="${endpoint}" class="w-full" style="height: ${document.getElementById('poster').offsetHeight}px;" allowfullscreen></iframe>`;
        videoPlayer.classList.remove('hidden');
        movieInfo.classList.add('hidden');
    }

    playButton.addEventListener('click', updateVideo);

    languageSelect.addEventListener('change', () => {
        const providerSelect = document.getElementById('providerSelect');
        providerSelect.classList.toggle('hidden', languageSelect.value === 'fr');
        updateVideo();
    });

    providerSelect.addEventListener('change', updateVideo);

    if (mediaType === 'tv') {
        async function updateEpisodes() {
            const seasonNumber = seasonSelect.value;
            if (!seasonNumber) return;

            const response = await fetch(`https://api.themoviedb.org/3/tv/${media.id}/season/${seasonNumber}?api_key=${apiKey}`);
            if (response.ok) {
                const season = await response.json();
                episodeSelect.innerHTML = season.episodes.map(episode =>
                    `<option value="${episode.episode_number}">Episode ${episode.episode_number}: ${episode.name}</option>`
                ).join('');
            } else {
                console.error('Failed to fetch season details.');
            }
        }

        seasonSelect.addEventListener('change', async () => {
            await updateEpisodes();
            updateVideo();
        });

        episodeSelect.addEventListener('change', updateVideo);

        updateEpisodes();
    }

    selectedMovie.scrollIntoView({ behavior: 'smooth' });
}
