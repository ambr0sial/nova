const availableSources = [
    {
        id: 'pstream',
        name: 'P-Stream',
        isFrench: false,
        urls: {
            movie: 'https://iframe.pstream.org/embed/tmdb-movie-{id}',
            tv: 'https://iframe.pstream.org/embed/tmdb-tv-{id}/{season}/{episode}'
        }
    },
    {
        id: 'streamflix',
        name: 'StreamFlix',
        isFrench: false,
        urls: {
            movie: 'https://watch.streamflix.one/movie/{id}}/watch?server=1',
            tv: 'https://watch.streamflix.one/tv/{id}}/watch?server=1&season={season}}&episode={episode}}'
        }
    },
    {
        id: 'nebula',
        name: 'NebulaFlix',
        isFrench: false,
        urls: {
            movie: 'https://nebulaflix.stream/movie?mt={id}&server=1',
            tv: 'https://nebulaflix.stream/show?st={id}&season={season}&episode={episode}&server=1'
        }
    },
    {
        id: 'vidjoy',
        name: 'VidJoy',
        isFrench: false,
        urls: {
            movie: 'https://vidjoy.pro/embed/movie/{id}',
            tv: 'https://vidjoy.pro/embed/tv/{id}}/{season}/{episode}'
        }
    },
    {
        id: 'vidzee',
        name: 'VidZee',
        isFrench: false,
        urls: {
            movie: 'https://vidzee.wtf/movie/movie.php?id={id}',
            tv: 'https://vidzee.wtf/tv/tv.php?id={id}&season={season}&episode={episode}'
        }
    },
    {
        id: 'spenflix',
        name: 'Spenflix',
        isFrench: false,
        urls: {
            movie: 'https://spencerdevs.xyz/movie/{id}',
            tv: 'https://spencerdevs.xyz/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'betaspenflix',
        name: 'Beta Spenflix',
        isFrench: false,
        urls: {
            movie: 'https://beta.spencerdevs.xyz/movie/{id}',
            tv: 'https://beta.spencerdevs.xyz/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidora',
        name: 'Vidora',
        isFrench: false,
        urls: {
            movie: 'https://vidora.su/movie/{id}',
            tv: 'https://vidora.su/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'multiembed',
        name: 'MultiEmbed',
        isFrench: false,
        urls: {
            movie: 'https://multiembed.mov/?video_id={id}&tmdb=1',
            tv: 'https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}'
        }
    },
    {
        id: 'frembed',
        name: 'Frembed',
        isFrench: true,
        urls: {
            movie: 'https://frembed.cc/api/film.php?id={id}',
            tv: 'https://frembed.cc/api/serie.php?id={id}&sa={season}&epi={episode}'
        }
    },
    {
        id: 'moviesapi',
        name: 'MoviesAPI',
        isFrench: false,
        urls: {
            movie: 'https://moviesapi.club/movie/{id}',
            tv: 'https://moviesapi.club/tv/{id}-{season}-{episode}'
        }
    },
    {
        id: 'embedsu',
        name: 'EmbedSU',
        isFrench: false,
        urls: {
            movie: 'https://embed.su/embed/movie/{id}',
            tv: 'https://embed.su/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'hexa',
        name: 'Hexa',
        isFrench: false,
        urls: {
            movie: 'https://api.hexa.watch/movie/{id}',
            tv: 'https://api.hexa.watch/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidlink',
        name: 'VidLink',
        isFrench: false,
        urls: {
            movie: 'https://vidlink.pro/movie/{id}',
            tv: 'https://vidlink.pro/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrccc',
        name: 'VidSrcCC',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false',
            tv: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false'
        }
    },
    {
        id: 'vidsrcto',
        name: 'VidSrcTO',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.to/embed/movie/{id}',
            tv: 'https://vidsrc.to/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcrip',
        name: 'VidSrcRIP',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.rip/embed/movie/{id}',
            tv: 'https://vidsrc.rip/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcxyz',
        name: 'VidSrcXYZ',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.xyz/embed/movie/{id}',
            tv: 'https://vidsrc.xyz/embed/tv/{id}/{season}-{episode}'
        }
    },
    {
        id: 'vidsrcvip',
        name: 'VidSrcVIP',
        isFrench: false,
        urls: {
            movie: 'https://vidsrc.vip/embed/movie/{id}',
            tv: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: '2embed',
        name: '2Embed',
        isFrench: false,
        urls: {
            movie: 'https://www.2embed.cc/embed/{id}',
            tv: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}'
        }
    },
    {
        id: 'primewire',
        name: 'PrimeWire',
        isFrench: false,
        urls: {
            movie: 'https://www.primewire.tf/embed/movie?tmdb={id}',
            tv: 'https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}'
        }
    },
    {
        id: '123embed',
        name: '123Embed',
        isFrench: false,
        urls: {
            movie: 'https://play2.123embed.net/movie/{id}',
            tv: 'https://play2.123embed.net/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: '111movies',
        name: '111Movies',
        isFrench: false,
        urls: {
            movie: 'https://111movies.com/movie/{id}',
            tv: 'https://111movies.com/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'smashystream',
        name: 'SmashyStream',
        isFrench: false,
        urls: {
            movie: 'https://embed.smashystream.com/playere.php?tmdb={id}',
            tv: 'https://embed.smashystream.com/playere.php?tmdb={id}&season={season}&episode={episode}'
        }
    },
    {
        id: 'autoembed',
        name: 'AutoEmbed',
        isFrench: false,
        urls: {
            movie: 'https://player.autoembed.cc/embed/movie/{id}',
            tv: 'https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'videasy',
        name: 'VidEasy (4K)',
        isFrench: false,
        urls: {
            movie: 'https://player.videasy.net/movie/{id}?color=8834ec',
            tv: 'https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec'
        }
    },
    {
        id: 'vidfast',
        name: 'VidFast',
        isFrench: false,
        urls: {
            movie: 'https://vidfast.pro/movie/{id}',
            tv: 'https://vidfast.pro/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidify',
        name: 'Vidify',
        isFrench: false,
        urls: {
            movie: 'https://vidify.top/embed/movie/{id}',
            tv: 'https://vidify.top/embed/tv/{id}/{season}/{episode}'
        }
    },
];