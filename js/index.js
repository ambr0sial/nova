
document.addEventListener('DOMContentLoaded', function () {
    const discordPopupSeen = localStorage.getItem('discordPopupSeen');

    if (!discordPopupSeen) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75';
        popup.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 text-center space-y-4 max-w-sm">
                <h2 class="text-xl font-bold text-purple-400">Nova has a Discord Server!</h2>
                <p class="text-gray-300">Join the community for updates and discussions <3</p>
                <a href="https://discord.gg/s9kUZw7CqP" target="_blank" 
                    class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white inline-block">
                    Join Now
                </a>
                <button id="closePopup" 
                    class="text-gray-500 hover:text-gray-300 focus:outline-none">
                    Dismiss
                </button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('closePopup').addEventListener('click', function () {
            popup.style.display = 'none';
            localStorage.setItem('discordPopupSeen', 'true');
        });
    }
});

function app() {
    return {
        apiKey: '1070730380f5fee0d87cf0382670b255',
        content: [],
        currentTab: 'movies',
        language: localStorage.getItem('selectedLanguage') || 'en',
        searchQuery: '',
        currentPage: 1,
        showWatchLater: false,
        watchLaterItems: [],
        watchLaterCount: 0,
        showModal: false,
        selectedContent: null,
        currentVideoUrl: '',
        selectedSeason: 1,
        selectedEpisode: 1,
        seasons: [],
        episodes: [],
        selectedSource: localStorage.getItem('defaultSource') || 'vidsrcsu',
        availableSources: availableSources,
        showClearConfirm: false,
        genres: [],
        selectedGenre: '',
        minRating: '',
        filteredContent: [],
        mobileMenu: false,
        sortBy: 'popularity.desc',
        yearRange: '',

        async init() {
            const savedItems = localStorage.getItem('watchLater');
            if (savedItems) {
                this.watchLaterItems = JSON.parse(savedItems);
                this.watchLaterCount = this.watchLaterItems.length;
            }

            await this.fetchGenres();
            await this.fetchContent();

            this.$watch('currentTab', async () => {
                this.currentPage = 1;
                this.selectedGenre = '';
                this.minRating = '';
                this.yearRange = '';
                await this.fetchGenres();
                await this.fetchContent();
            });

            this.$watch('language', () => {
                this.currentPage = 1;
                this.fetchContent();
            });
        },

        async fetchGenres() {
            const baseUrl = 'https://api.themoviedb.org/3';
            const endpoint = this.currentTab === 'movies' ? 'genre/movie/list' : 'genre/tv/list';
            const url = `${baseUrl}/${endpoint}?api_key=${this.apiKey}&language=${this.language}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                this.genres = data.genres;
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        },

        getGenreName(genreId) {
            const genre = this.genres.find(g => g.id === parseInt(genreId));
            return genre ? genre.name : '';
        },

        async applyFilters() {
            const baseUrl = 'https://api.themoviedb.org/3/discover';
            const endpoint = this.currentTab === 'movies' ? 'movie' : 'tv';

            let params = new URLSearchParams({
                api_key: this.apiKey,
                language: `${this.language}-${this.language.toUpperCase()}`,
                page: this.currentPage,
                sort_by: this.sortBy
            });

            if (this.selectedGenre) {
                params.append('with_genres', this.selectedGenre);
            }

            if (this.minRating) {
                params.append('vote_average.gte', this.minRating);
            }

            if (this.selectedLanguage) {
                params.append('with_original_language', this.selectedLanguage);
            }

            if (this.yearRange) {
                const [startYear, endYear] = this.yearRange.split(',');
                params.append('primary_release_date.gte', `${startYear}-01-01`);
                params.append('primary_release_date.lte', `${endYear}-12-31`);
            }

            const url = `${baseUrl}/${endpoint}?${params.toString()}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                this.content = data.results;
                this.filteredContent = this.content;
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        },

        getLanguageName(code) {
            const languages = {
                en: 'English',
                fr: 'French',
                es: 'Spanish',
                de: 'German',
                it: 'Italian',
                ja: 'Japanese',
                ko: 'Korean'
            };
            return languages[code] || code;
        },

        getYearRangeName(range) {
            if (!range) return '';
            const [start, end] = range.split(',');
            const decade = Math.floor(start / 10) * 10;
            return `${decade}s`;
        },

        get hasActiveFilters() {
            return this.selectedGenre || this.minRating || this.yearRange || this.selectedLanguage;
        },

        clearAllFilters() {
            this.selectedGenre = '';
            this.minRating = '';
            this.yearRange = '';
            this.selectedLanguage = '';
            this.applyFilters();
        },

        async fetchContent() {
            const baseUrl = 'https://api.themoviedb.org/3';
            const endpoint = this.currentTab === 'movies' ? 'movie/popular' : 'tv/popular';
            const url = `${baseUrl}/${endpoint}?api_key=${this.apiKey}&language=${this.language}&page=${this.currentPage}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                this.content = data.results;
                this.applyFilters();
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        },

        async searchContent() {
            if (!this.searchQuery) {
                await this.applyFilters();
                return;
            }

            const baseUrl = 'https://api.themoviedb.org/3';
            const searchQuery = this.searchQuery.trim();

            if (searchQuery.startsWith('@')) {
                const personName = searchQuery.substring(1);
                if (!personName) {
                    await this.applyFilters();
                    return;
                }

                const personUrl = `${baseUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(personName)}`;
                try {
                    const personResponse = await fetch(personUrl);
                    const personData = await personResponse.json();
                    const person = personData.results[0];

                    if (person) {
                        const creditsUrl = `${baseUrl}/person/${person.id}/combined_credits?api_key=${this.apiKey}`;
                        const creditsResponse = await fetch(creditsUrl);
                        const creditsData = await creditsResponse.json();

                        this.content = creditsData[this.currentTab === 'movies' ? 'cast' : 'crew']
                            .filter(item => this.currentTab === 'movies' ? item.media_type === 'movie' : item.media_type === 'tv')
                            .slice(0, 20);
                    } else {
                        this.content = [];
                    }
                } catch (error) {
                    console.error('Error searching person:', error);
                    this.content = [];
                }
            } else {
                const endpoint = this.currentTab === 'movies' ? 'movie' : 'tv';
                const url = `${baseUrl}/search/${endpoint}?api_key=${this.apiKey}&query=${encodeURIComponent(searchQuery)}&language=${this.language}-${this.language.toUpperCase()}&page=${this.currentPage}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    this.content = data.results;
                } catch (error) {
                    console.error('Error searching content:', error);
                    this.content = [];
                }
            }

            this.filteredContent = this.content.filter(item => {
                if (this.selectedGenre && !item.genre_ids?.includes(parseInt(this.selectedGenre))) {
                    return false;
                }
                if (this.minRating && item.vote_average < parseFloat(this.minRating)) {
                    return false;
                }
                if (this.selectedLanguage && item.original_language !== this.selectedLanguage) {
                    return false;
                }
                return true;
            });
        },

        async openContent(item) {
            this.selectedContent = item;
            this.showModal = true;

            if (this.currentTab === 'shows') {
                const url = `https://api.themoviedb.org/3/tv/${item.id}?api_key=${this.apiKey}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    this.seasons = Array.from({ length: data.number_of_seasons }, (_, i) => i + 1);
                    this.updateEpisodes();
                } catch (error) {
                    console.error('Error fetching seasons:', error);
                }
            }
            this.updateVideoUrl();
        },

        getSourceUrl(sourceId, type, params) {
            const source = this.availableSources.find(s => s.id === sourceId);
            if (!source) return '';

            let url = source.urls[type];
            Object.entries(params).forEach(([key, value]) => {
                url = url.replace(`{${key}}`, value);
            });
            return url;
        },

        updateVideoUrl() {
            const source = this.availableSources.find(s => s.id === this.selectedSource);
            if (!source) return '';

            const params = this.currentTab === 'shows'
                ? { id: this.selectedContent.id, season: this.selectedSeason, episode: this.selectedEpisode }
                : { id: this.selectedContent.id };

            this.currentVideoUrl = this.getSourceUrl(
                this.selectedSource,
                this.currentTab === 'shows' ? 'tv' : 'movie',
                params
            );
        },

        async updateEpisodes() {
            const url = `https://api.themoviedb.org/3/tv/${this.selectedContent.id}/season/${this.selectedSeason}?api_key=${this.apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                this.episodes = Array.from({ length: data.episodes.length }, (_, i) => i + 1);
                this.selectedEpisode = 1;
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        },

        loadEpisode() {
            this.updateVideoUrl();
        },

        async changePage(page) {
            this.currentPage = page;
            if (this.searchQuery) {
                await this.searchContent();
            } else {
                await this.fetchContent();
            }
        },

        toggleWatchLater(item) {
            const index = this.watchLaterItems.findIndex(i => i.id === item.id);
            if (index === -1) {
                this.watchLaterItems.push({
                    ...item,
                    type: this.currentTab === 'movies' ? 'movie' : 'tv'
                });
            } else {
                this.watchLaterItems.splice(index, 1);
            }
            this.watchLaterCount = this.watchLaterItems.length;
            localStorage.setItem('watchLater', JSON.stringify(this.watchLaterItems));
        },

        isInWatchLater(item) {
            return this.watchLaterItems.some(i => i.id === item.id);
        },

        clearWatchLater() {
            this.showClearConfirm = true;
        },

        doClearWatchLater() {
            this.watchLaterItems = [];
            this.watchLaterCount = 0;
            localStorage.setItem('watchLater', JSON.stringify([]));
            this.showClearConfirm = false;
        },

        pickRandom() {
            const randomItem = this.filteredContent[Math.floor(Math.random() * this.filteredContent.length)];
            if (randomItem) {
                window.location.href = `/pages/watch/?id=${randomItem.id}&type=${this.currentTab === 'movies' ? 'movie' : 'tv'}`;
            }
        },

        changeLanguage(newLanguage) {
            this.language = newLanguage;
            localStorage.setItem('selectedLanguage', newLanguage);
            this.fetchContent();
        }
    }
}

const closeBannerButton = document.getElementById('closeBanner');
if (closeBannerButton) {
    closeBannerButton.addEventListener('click', function () {
        const banner = document.getElementById('donationBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    });
}
