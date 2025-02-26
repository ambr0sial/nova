function app() {
    return {
        apiKey: '1070730380f5fee0d87cf0382670b255',
        content: null,
        contentId: null,
        contentType: null,
        isShow: false,
        selectedSeason: 1,
        selectedEpisode: 1,
        seasons: [],
        episodes: [],
        selectedSource: localStorage.getItem('defaultSource') || 'vidsrcsu',
        availableSources: availableSources,
        currentVideoUrl: '',
        watchLaterItems: [],
        watchLaterCount: 0,
        showWatchLater: false,
        showClearConfirm: false,
        mobileMenu: false,
        viewMode: 'grid',
        seasonData: null,
        similarContent: [],

        async init() {
            const savedItems = localStorage.getItem('watchLater');
            if (savedItems) {
                this.watchLaterItems = JSON.parse(savedItems);
                this.watchLaterCount = this.watchLaterItems.length;
            }

            const urlParams = new URLSearchParams(window.location.search);
            this.contentId = urlParams.get('id');
            this.contentType = urlParams.get('type');
            this.isShow = this.contentType === 'tv';
            this.selectedTorrentSeason = 1;

            if (this.contentId && this.contentType) {
                await this.fetchContent();
                this.updateVideoUrl();
                this.fetchTorrentInfo();
            }
        },

        async fetchContent() {
            const baseUrl = 'https://api.themoviedb.org/3';
            const language = localStorage.getItem('selectedLanguage') || 'en';
            const url = `${baseUrl}/${this.contentType}/${this.contentId}?api_key=${this.apiKey}&language=${language}&append_to_response=credits,similar,videos,reviews,release_dates,keywords,images`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                this.content = data;

                const imagesUrl = `${baseUrl}/${this.contentType}/${this.contentId}/images?api_key=${this.apiKey}&language=${language}`;
                const imagesResponse = await fetch(imagesUrl);
                const imagesData = await imagesResponse.json();
                this.content.images = imagesData;

                const containsKeywords = (text, keywords) => {
                    if (!text) return false;
                    const lowercaseText = text.toLowerCase();
                    return keywords.some(keyword => lowercaseText.includes(keyword));
                };

                const overview = data.overview?.toLowerCase() || '';
                const genres = data.genres?.map(g => g.name.toLowerCase()) || [];
                const keywords = [...(data.keywords?.keywords || []), ...(data.keywords?.results || [])].map(k => k.name.toLowerCase());

                if (data.release_dates?.results) {
                    const usRating = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) {
                        const certification = usRating.release_dates[0]?.certification;
                        this.content.adult = certification === 'R' || certification === 'NC-17';
                    }
                }

                const violenceKeywords = ['violence', 'violent', 'gore', 'bloody', 'blood', 'murder', 'kill', 'death', 'torture', 'fight', 'combat', 'war', 'brutal', 'massacre', 'slaughter', 'horror'];
                this.content.violence = containsKeywords(overview, violenceKeywords) ||
                    genres.some(g => ['horror', 'war', 'action'].includes(g)) ||
                    keywords.some(k => violenceKeywords.some(vk => k.includes(vk)));

                const languageKeywords = ['profanity', 'swearing', 'cursing', 'explicit language', 'strong language', 'vulgar'];
                this.content.profanity = containsKeywords(overview, languageKeywords) ||
                    keywords.some(k => languageKeywords.some(lk => k.includes(lk)));

                const substanceKeywords = ['drug', 'alcohol', 'substance', 'addiction', 'smoking', 'drunk', 'intoxicated'];
                this.content.substances = containsKeywords(overview, substanceKeywords) ||
                    keywords.some(k => substanceKeywords.some(sk => k.includes(sk)));

                const sexualKeywords = ['sexual', 'sex', 'nudity', 'erotic', 'suggestive', 'mature themes'];
                this.content.suggestive = containsKeywords(overview, sexualKeywords) ||
                    keywords.some(k => sexualKeywords.some(sk => k.includes(sk)));

                const flashingKeywords = ['strobe', 'flashing', 'epilepsy', 'seizure', 'photosensitive'];
                this.content.flashing = containsKeywords(overview, flashingKeywords) ||
                    keywords.some(k => flashingKeywords.some(fk => k.includes(fk)));

                if (!this.content.adult) {
                    this.content.adult = genres.includes('thriller') &&
                        (this.content.violence || this.content.suggestive || this.content.substances);
                }

                if (this.isShow) {
                    this.seasons = Array.from({length: data.number_of_seasons}, (_, i) => i + 1);
                    await this.updateEpisodes();
                }

                if (data.videos?.results) {
                    this.videos = data.videos.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer');
                }

                if (data.reviews?.results) {
                    this.reviews = data.reviews.results;
                }

                if (data.similar?.results) {
                    this.similarContent = data.similar.results.slice(0, 6);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        },

        toggleWatchLater(item) {
            const index = this.watchLaterItems.findIndex(i => i.id === item.id);
            if (index === -1) {
                this.watchLaterItems.push({
                    ...item,
                    type: this.contentType
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

        doClearWatchLater() {
            this.watchLaterItems = [];
            this.watchLaterCount = 0;
            localStorage.setItem('watchLater', JSON.stringify([]));
            this.showClearConfirm = false;
        },

        checkProviderStatus() {
            if (this.currentVideoUrl === this.lastUrl) {
                return;
            }
            this.lastUrl = this.currentVideoUrl;

            if (this.providerTimeout) {
                clearTimeout(this.providerTimeout);
            }
            if (this.messageTimeout) {
                clearTimeout(this.messageTimeout);
            }

            this.providerDown = true;
            this.showDownMessage = false;

            this.providerTimeout = setTimeout(() => {
                if (this.providerDown) {
                    console.log('Provider appears to be down - trying next source');
                    this.tryNextSource();
                    this.messageTimeout = setTimeout(() => {
                        this.showDownMessage = true;
                    }, 500);
                }
            }, 1500);
        },

        tryNextSource() {
            const currentIndex = this.availableSources.findIndex(s => s.id === this.selectedSource);
            if (currentIndex === -1) return;

            const currentSource = this.availableSources[currentIndex];
            const isFrench = currentSource.isFrench;

            let nextIndex = (currentIndex + 1) % this.availableSources.length;
            while (nextIndex !== currentIndex) {
                if (this.availableSources[nextIndex].isFrench === isFrench) {
                    this.selectedSource = this.availableSources[nextIndex].id;
                    this.updateVideoUrl();
                    return;
                }
                nextIndex = (nextIndex + 1) % this.availableSources.length;
            }
        },

        handleProviderLoad() {
            if (this.currentVideoUrl === this.lastUrl) {
                if (this.providerTimeout) {
                    clearTimeout(this.providerTimeout);
                }
                if (this.messageTimeout) {
                    clearTimeout(this.messageTimeout);
                }
                this.providerDown = false;
                this.showDownMessage = false;
            }
        },

        updateVideoUrl() {
            const source = this.availableSources.find(s => s.id === this.selectedSource);
            if (!source) return '';

            const params = this.isShow
                ? {id: this.contentId, season: this.selectedSeason, episode: this.selectedEpisode}
                : {id: this.contentId};

            const newUrl = this.getSourceUrl(
                this.selectedSource,
                this.isShow ? 'tv' : 'movie',
                params
            );

            if (newUrl !== this.currentVideoUrl) {
                this.currentVideoUrl = newUrl;
                this.checkProviderStatus();
            }
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

        async updateEpisodes() {
            const url = `https://api.themoviedb.org/3/tv/${this.contentId}/season/${this.selectedSeason}?api_key=${this.apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                this.seasonData = data;
                this.episodes = Array.from({length: data.episodes.length}, (_, i) => i + 1);
                this.selectedEpisode = 1;
                this.updateVideoUrl();
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        },

        loadEpisode() {
            this.updateVideoUrl();
        },

        sections: {
            overview: true,
            details: true,
            cast: true,
            production: true,
            trailers: true,
            reviews: true,
            viewingGuide: true
        },
        videos: [],
        reviews: [],
        castPage: 0,

        get maxCastPage() {
            return Math.max(0, Math.ceil((this.content?.credits?.cast?.length || 0) / 6) - 1);
        },

        get displayedCast() {
            const start = this.castPage * 6;
            return this.content?.credits?.cast?.slice(start, start + 6) || [];
        },

        toggleSection(section) {
            this.sections[section] = !this.sections[section];
        },

        torrentInfo: undefined,

        async fetchTorrentInfo() {
            const contentTitle = this.content?.title || this.content?.name;
            const releaseYear = (this.content?.release_date || this.content?.first_air_date || '').substring(0, 4);
            if (!contentTitle) return;

            this.torrentInfo = undefined;

            try {
                const corsProxy = 'https://api.allorigins.win/raw?url=';

                let searchQuery = contentTitle;
                if (releaseYear) {
                    searchQuery += ` ${releaseYear}`;
                }
                if (this.isShow) {
                    searchQuery += ` S${String(this.selectedTorrentSeason).padStart(2, '0')}`;
                }

                const targetUrl = `https://cloudtorrents.com/search?query=${encodeURIComponent(searchQuery)}&ordering=-se`;
                console.log('Fetching torrents from:', targetUrl);

                const response = await fetch(corsProxy + encodeURIComponent(targetUrl));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const rows = doc.querySelectorAll('tbody tr');
                console.log('Found rows:', rows.length);

                const qualityTypeMap = new Map();

                for (const row of rows) {
                    const titleElement = row.querySelector('td:first-child a');
                    if (!titleElement) continue;

                    const title = titleElement.textContent.trim();

                    if (!this.verifyTorrentTitle(title, contentTitle, releaseYear)) continue;

                    const magnetElement = row.querySelector('a[href^="magnet:"]');
                    if (!magnetElement) continue;

                    const magnetLink = magnetElement.href;

                    let quality = 'N/A';
                    const qualityMatch = title.match(/\b(720p|1080p|2160p|4K)\b/i);
                    if (qualityMatch) {
                        quality = qualityMatch[1].toUpperCase();
                    }

                    let type = 'N/A';
                    const typeMatch = title.match(/\b(BluRay|WEBDL|WEB-DL|WEBRip|HDRip|BRRip|DVDRip)\b/i);
                    if (typeMatch) {
                        type = typeMatch[1].replace('WEBDL', 'WEB-DL');
                    }

                    const sizeElement = row.querySelector('td:nth-child(4)');
                    const seedersElement = row.querySelector('td:nth-child(5)');
                    const seeders = parseInt(seedersElement?.textContent.trim() || '0', 10);

                    const torrent = {
                        quality,
                        type,
                        size: sizeElement ? sizeElement.textContent.trim() : 'N/A',
                        seeders: seeders,
                        magnet: magnetLink
                    };

                    const key = `${quality}-${type}`;

                    if (!qualityTypeMap.has(key) || qualityTypeMap.get(key).seeders < seeders) {
                        qualityTypeMap.set(key, torrent);
                    }
                }

                const torrents = Array.from(qualityTypeMap.values());
                torrents.sort((a, b) => {
                    const qualityOrder = {'4K': 4, '2160P': 3, '1080P': 2, '720P': 1, 'N/A': 0};
                    const qualityDiff = (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
                    if (qualityDiff !== 0) return qualityDiff;
                    return b.seeders - a.seeders;
                });

                this.torrentInfo = torrents.slice(0, 4);
                if (this.torrentInfo.length === 0) {
                    this.torrentInfo = null;
                }
            } catch (error) {
                console.error('Error fetching torrent info:', error);
                this.torrentInfo = null;
            }
        },

        verifyTorrentTitle(torrentTitle, contentTitle, releaseYear) {
            const cleanTorrentTitle = torrentTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanContentTitle = contentTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

            if (!cleanTorrentTitle.includes(cleanContentTitle)) {
                return false;
            }

            if (releaseYear && !torrentTitle.includes(releaseYear)) {
                return false;
            }

            if (this.isShow) {
                const seasonPattern = new RegExp(`S${String(this.selectedTorrentSeason).padStart(2, '0')}`, 'i');
                if (!seasonPattern.test(torrentTitle)) {
                    return false;
                }
            }

            return true;
        }
    }
}