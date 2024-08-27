// Function to display search suggestions
function displaySearchSuggestions(results) {
    const searchSuggestions = document.getElementById('searchSuggestions');

    // If no results, show a "No suggestions" message
    if (results.length === 0) {
        searchSuggestions.innerHTML = '<div class="p-2 text-gray-500">No suggestions available</div>';
        searchSuggestions.classList.remove('hidden');
        return;
    }

    // Generate the HTML for search suggestions
    const suggestionsHTML = results.map(media => {
        const mediaTypeLabel = media.media_type === 'movie' ? 'Movie' : 'TV Show';
        const mediaTitle = media.title || media.name;
        const mediaRating = media.vote_average.toFixed(1);

        return `
            <div class="suggestion-item p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-transform transform hover:scale-105" data-id="${media.id}" data-type="${media.media_type}">
                <div class="flex items-center">
                    <img src="https://image.tmdb.org/t/p/w45${media.poster_path}" alt="${mediaTitle}" class="w-16 h-24 object-cover rounded-md mr-4">
                    <div class="flex-1">
                        <h4 class="text-lg font-semibold text-white truncate">${mediaTitle}</h4>
                        <p class="text-gray-400 text-sm">${mediaTypeLabel}</p>
                        <p class="text-yellow-400 text-sm">${mediaRating}/10</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    searchSuggestions.innerHTML = suggestionsHTML;
    searchSuggestions.classList.remove('hidden');

    // Attach event listeners to each suggestion item
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const mediaId = item.getAttribute('data-id');
            const mediaType = item.getAttribute('data-type');
            fetchSelectedMedia(localStorage.getItem('apiKey'), mediaId, mediaType);
            searchSuggestions.classList.add('hidden');
        });
    });
}

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', async function() {
    const apiKey = localStorage.getItem('apiKey');
    const searchInput = document.getElementById('searchInput');
    const searchInputValue = searchInput.value.trim();

    if (!searchInputValue) {
        alert('Please enter a search term.');
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchInputValue)}`);
        if (response.ok) {
            const data = await response.json();
            displaySearchSuggestions(data.results);
        } else {
            console.error('Failed to fetch search results.');
        }
    } catch (error) {
        console.error('An error occurred while fetching search results:', error);
    }
});

// Event listener for random button click
document.getElementById('randomButton').addEventListener('click', async function() {
    const apiKey = localStorage.getItem('apiKey');

    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            const randomMedia = data.results[Math.floor(Math.random() * data.results.length)];
            fetchSelectedMedia(apiKey, randomMedia.id, randomMedia.media_type);
        } else {
            console.error('Failed to fetch trending media.');
        }
    } catch (error) {
        console.error('An error occurred while fetching trending media:', error);
    }
});

// Function to fetch popular movies
async function fetchPopularMovies(apiKey, page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&page=${page}`);
    if (response.ok) {
        const data = await response.json();
        displaySearchResults(data.results);
        updatePaginationControls(data.page, data.total_pages);
        fetchUpcomingMedia(apiKey);
    } else {
        console.error('Failed to fetch popular media.');
    }
}

// Function to update pagination controls
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

// Function to change page
function changePage(page) {
    const apiKey = localStorage.getItem('apiKey');
    fetchPopularMovies(apiKey, page);
}

// Function to fetch selected media details
async function fetchSelectedMedia(apiKey, mediaId, mediaType) {
    const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}`);
    if (response.ok) {
        const media = await response.json();
        displaySelectedMedia(media, mediaType);
    } else {
        console.error('Failed to fetch media details.');
    }
}
