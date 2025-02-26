function sportsApp() {
    return {
        sports: [],
        matches: [],
        filteredMatches: [],
        selectedSport: '',
        matchType: 'live',
        showPopular: false,
        mobileMenu: false,
        showModal: false,
        selectedMatch: null,
        selectedStream: null,
        availableStreams: [],

        async init() {
            await this.loadSports();
            await this.loadMatches();
        },

        async loadSports() {
            try {
                const response = await fetch('https://streamed.su/api/sports');
                this.sports = await response.json();
            } catch (error) {
                console.error('Error loading sports:', error);
                this.sports = [];
            }
        },

        async loadMatches() {
            let endpoint = '';
            switch (this.matchType) {
                case 'live':
                    endpoint = this.showPopular ? '/api/matches/live/popular' : '/api/matches/live';
                    break;
                case 'today':
                    endpoint = this.showPopular ? '/api/matches/all-today/popular' : '/api/matches/all-today';
                    break;
                case 'all':
                    endpoint = this.showPopular ? '/api/matches/all/popular' : '/api/matches/all';
                    break;
            }

            try {
                const response = await fetch(`https://streamed.su${endpoint}`);
                this.matches = await response.json();
                this.filterMatches();
            } catch (error) {
                console.error('Error loading matches:', error);
                this.matches = [];
                this.filterMatches();
            }
        },

        filterMatches() {
            this.filteredMatches = this.selectedSport
                ? this.matches.filter(match => match.category === this.selectedSport)
                : this.matches;
        },

        togglePopular() {
            this.showPopular = !this.showPopular;
            this.loadMatches();
        },

        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        },

        closeModal() {
            this.showModal = false;
            this.selectedStream = null;
            this.selectedMatch = null;
            this.availableStreams = [];

            const container = document.getElementById('streamContainer');
            if (container) {
                container.innerHTML = '';
            }
        },

        async openStream(match) {
            if (this.showModal) {
                this.closeModal();
            }

            this.selectedMatch = match;
            this.selectedStream = null;
            this.availableStreams = [];
            this.showModal = true;

            for (const source of match.sources) {
                try {
                    const response = await fetch(`https://streamed.su/api/stream/${source.source}/${source.id}`);
                    const streams = await response.json();
                    this.availableStreams = [...this.availableStreams, ...streams];
                } catch (error) {
                    console.error(`Error loading stream for ${source.source}:`, error);
                }
            }

            if (this.availableStreams.length > 0) {
                this.selectStream(this.availableStreams[0]);
            }
        },

        selectStream(stream) {
            const container = document.getElementById('streamContainer');
            if (container) {
                container.innerHTML = '';
            }

            this.selectedStream = stream;

            this.$nextTick(() => {
            });
        }
    }
}