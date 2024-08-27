import API_KEY from './apis/config.js';

document.addEventListener('DOMContentLoaded', function () {
    const homePage = document.getElementById('homePage');
    const welcomeBanner = document.getElementById('welcomeBanner');
    const closeBanner = document.getElementById('closeBanner');
    const categorySelect = document.getElementById('categorySelect');
    const popularMedia = document.getElementById('popularMedia');

    closeBanner.addEventListener('click', () => {
        welcomeBanner.style.display = 'none';
    });

    // Show home page directly
    homePage.classList.remove('hidden');

    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    document.getElementById('searchButton').addEventListener('click', search);
    searchInput.addEventListener('keydown', async function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    });

    async function search() {
        const searchInputValue = searchInput.value;
        const selectedCategory = categorySelect.value;
        const response = await fetch(`https://api.themoviedb.org/3/search/${selectedCategory}?api_key=${API_KEY}&query=${searchInputValue}`);
        if (response.ok) {
            const data = await response.json();
            displaySearchResults(data.results);
            searchSuggestions.classList.add('hidden');
        }
    }

    searchInput.addEventListener('input', async function() {
        const query = searchInput.value;
        if (query.length > 2) {
            const selectedCategory = categorySelect.value;
            const response = await fetch(`https://api.themoviedb.org/3/search/${selectedCategory}?api_key=${API_KEY}&query=${query}`);
            if (response.ok) {
                const data = await response.json();
                displaySearchSuggestions(data.results);
            } else {
                searchSuggestions.classList.add('hidden');
            }
        } else {
            searchSuggestions.classList.add('hidden');
        }
    });

    async function fetchPopularMedia(page = 1) {
        const selectedCategory = categorySelect.value;
        const response = await fetch(`https://api.themoviedb.org/3/trending/${selectedCategory}/week?api_key=${API_KEY}&page=${page}`);
        if (response.ok) {
            const data = await response.json();
            displayPopularMedia(data.results);
            updatePaginationControls(data.page, data.total_pages);
        } else {
            console.error('Failed to fetch popular media.');
        }
    }

    function updatePaginationControls(currentPage, totalPages) {
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        currentPageSpan.textContent = currentPage;

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;

        prevPageButton.onclick = () => changePage(currentPage - 1);
        nextPageButton.onclick = () => changePage(currentPage + 1);
    }

    function changePage(page) {
        fetchPopularMedia(page);
    }

    async function fetchSelectedMedia(mediaId, mediaType) {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${API_KEY}`);
        if (response.ok) {
            const media = await response.json();
            displaySelectedMedia(media, mediaType);
        } else {
            console.error('Failed to fetch media details.');
        }
    }

    function displayPopularMedia(results) {
        popularMedia.innerHTML = '';

        results.forEach(media => {
            const mediaCard = document.createElement('div');
            mediaCard.classList.add('media-card', 'bg-gray-900', 'p-6', 'rounded-lg', 'shadow-lg', 'cursor-pointer', 'transition-transform', 'hover:scale-105', 'relative', 'flex', 'flex-col', 'items-start', 'group', 'overflow-hidden');

            const formattedDate = media.release_date ? new Date(media.release_date).toLocaleDateString() : (media.first_air_date ? new Date(media.first_air_date).toLocaleDateString() : 'Unknown Date');
            const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(media.vote_average / 2) ? '★' : '☆').join(' ');

            mediaCard.innerHTML = `
                <div class="relative w-full h-80 overflow-hidden rounded-lg mb-4">
                    <img src="https://image.tmdb.org/t/p/w300${media.poster_path}" alt="${media.title || media.name}" class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                </div>
                <div class="w-full">
                    <h3 class="text-xl font-semibold text-white truncate">${media.title || media.name}</h3>
                    <p class="text-gray-400 text-sm mt-1">${media.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-yellow-400 text-lg">${ratingStars}</span>
                        <span class="text-gray-300 text-sm ml-2">${media.vote_average.toFixed(1)}/10</span>
                    </div>
                    <p class="text-gray-300 text-sm mt-1">Release Date: ${formattedDate}</p>
                </div>
            `;

            mediaCard.addEventListener('click', function() {
                fetchSelectedMedia(media.id, media.media_type);
            });

            popularMedia.appendChild(mediaCard);
        });
    }

    async function fetchUpcomingMedia() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
        if (response.ok) {
            const data = await response.json();
            const upcomingMovies = data.results.filter(media => new Date(media.release_date) > new Date());
            displayUpcomingMedia(upcomingMovies);
        } else {
            console.error('Failed to fetch upcoming media.');
        }
    }

    function displayUpcomingMedia(mediaList) {
        const upcomingMedia = document.getElementById('upcomingMedia');
        upcomingMedia.innerHTML = '';

        mediaList.forEach(media => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('text-zinc-300', 'mb-2');
            mediaItem.innerHTML = `<span>${media.title}:</span> <span>${media.release_date}</span>`;
            upcomingMedia.appendChild(mediaItem);
        });
    }

    // Fetch popular media and upcoming media on load
    fetchPopularMedia();
    fetchUpcomingMedia();

    // Update popular media based on category change
    categorySelect.addEventListener('change', function() {
        fetchPopularMedia();
    });
});
