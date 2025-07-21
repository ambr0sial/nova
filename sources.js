const availableSources = [
  {
    id: "pstream",
    name: "P-Stream",
    isFrench: false,
    urls: {
      movie: "https://iframe.pstream.mov/media/tmdb-movie-{id}",
      tv: "https://iframe.pstream.mov/media/tmdb-tv-{id}/{season}/{episode}",
    },
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    isFrench: false,
    urls: {
      movie: "https://multiembed.mov/?video_id={id}&tmdb=1",
      tv: "https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}",
    },
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    isFrench: false,
    urls: {
      movie: "https://moviesapi.club/movie/{id}",
      tv: "https://moviesapi.club/tv/{id}-{season}-{episode}",
    },
  },
  {
    id: "embedsu",
    name: "EmbedSU",
    isFrench: false,
    urls: {
      movie: "https://embed.su/embed/movie/{id}",
      tv: "https://embed.su/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "hexa",
    name: "Hexa",
    isFrench: false,
    urls: {
      movie: "https://hexa.watch/watch/movie/{id}",
      tv: "https://hexa.watch/watch/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidlink",
    name: "VidLink",
    isFrench: false,
    urls: {
      movie: "https://vidlink.pro/movie/{id}",
      tv: "https://vidlink.pro/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcXyz",
    name: "VidSrcXyz",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.xyz/embed/movie/{id}",
      tv: "https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcrip",
    name: "VidSrcRIP",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.rip/embed/movie/{id}",
      tv: "https://vidsrc.rip/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcsu",
    name: "VidSrcSU",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.su/embed/movie/{id}",
      tv: "https://vidsrc.su/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrcvip",
    name: "VidSrcVIP",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.vip/embed/movie/{id}",
      tv: "https://vidsrc.vip/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "2embed",
    name: "2Embed",
    isFrench: false,
    urls: {
      movie: "https://www.2embed.cc/embed/{id}",
      tv: "https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}",
    },
  },
  {
    id: "123embed",
    name: "123Embed",
    isFrench: false,
    urls: {
      movie: "https://play2.123embed.net/movie/{id}",
      tv: "https://play2.123embed.net/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "111movies",
    name: "111Movies",
    isFrench: false,
    urls: {
      movie: "https://111movies.com/movie/{id}",
      tv: "https://111movies.com/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    isFrench: false,
    urls: {
      movie: "https://player.smashy.stream/movie/{id}",
      tv: "https://player.smashy.stream/tv/{id}?s={season}&e={episode}",
    },
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    isFrench: false,
    urls: {
      movie: "https://player.autoembed.cc/embed/movie/{id}",
      tv: "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "videasy",
    name: "VidEasy (4K)",
    isFrench: false,
    urls: {
      movie: "https://player.videasy.net/movie/{id}?color=8834ec",
      tv: "https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec",
    },
  },
  {
    id: "vidfast",
    name: "VidFast (4K)",
    isFrench: false,
    urls: {
      movie: "https://vidfast.pro/movie/{id}",
      tv: "https://vidfast.pro/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidify",
    name: "Vidify",
    isFrench: false,
    urls: {
      movie: "https://vidify.top/embed/movie/{id}",
      tv: "https://vidify.top/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "rive",
    name: "RiveStream",
    isFrench: false,
    urls: {
      movie: "https://rivestream.org/embed?type=movie&id={id}",
      tv: "https://rivestream.org/embed?type=tv&id={id}&season={season}&episode={episode}",
    },
  },
  {
    id: "vidora",
    name: "Vidora",
    isFrench: false,
    urls: {
      movie: "https://vidora.su/movie/{id}",
      tv: "https://vidora.su/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidsrccc",
    name: "VidSrcCC",
    isFrench: false,
    urls: {
      movie: "https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false",
      tv: "https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false",
    },
  },
  {
    id: "streamflix",
    name: "StreamFlix",
    isFrench: false,
    urls: {
      movie: "https://watch.streamflix.one/movie/{id}/watch?server=1",
      tv: "https://watch.streamflix.one/tv/{id}/watch?server=1&season={season}&episode={episode}",
    },
  },
  {
    id: "nebula",
    name: "NebulaFlix",
    isFrench: false,
    urls: {
      movie: "https://nebulaflix.stream/movie?mt={id}&server=1",
      tv: "https://nebulaflix.stream/show?st={id}&season={season}&episode={episode}&server=1",
    },
  },
  {
    id: "vidjoy",
    name: "VidJoy",
    isFrench: false,
    urls: {
      movie: "https://vidjoy.pro/embed/movie/{id}",
      tv: "https://vidjoy.pro/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "vidzee",
    name: "VidZee",
    isFrench: false,
    urls: {
      movie: "https://player.vidzee.wtf/embed/movie/{id}",
      tv: "https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "spenflix",
    name: "Spenflix",
    isFrench: false,
    urls: {
      movie: "https://spencerdevs.xyz/movie/{id}",
      tv: "https://spencerdevs.xyz/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "uembed",
    name: "UEmbed (premium)",
    isFrench: false,
    urls: {
      movie:
        "https://uembed.site/?id={id}&apikey=thisisforsurenotapremiumkey_right?",
      tv: "https://uembed.site/?id={id}&season={season}&episode={episode}&apikey=thisisforsurenotapremiumkey_right?",
    },
  },
  {
    id: "xprime",
    name: "Xprime",
    isFrench: false,
    urls: {
      movie: "https://xprime.tv/watch/{id}",
      tv: "https://xprime.tv/watch/{id}/{season}/{episode}",
    },
  },
  {
    id: "primewire",
    name: "PrimeWire",
    isFrench: false,
    urls: {
      movie: "https://www.primewire.tf/embed/movie?tmdb={id}",
      tv: "https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}",
    },
  },
  {
    id: "player4u",
    name: "Player 4U",
    isFrench: false,
    urls: {
      movie: "https://vidapi.xyz/embed/movie?tmdb={id}",
      tv: "https://vidapi.xyz/embed/tv/{id}&s={season}&e={episode}",
    },
  },
  {
    id: "spencer",
    name: "Spencer",
    isFrench: false,
    urls: {
      movie: "https://spencerdevs.xyz/movie/{id}",
      tv: "https://spencerdevs.xyz/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "bludflix",
    name: "BludFlix",
    isFrench: false,
    urls: {
      movie: "https://watch.bludclart.com/movie/{id}/watch",
      tv: "https://watch.bludclart.com/tv/{id}/watch?season={season}&episode={episode}",
    },
  },
  {
    id: "flixersu",
    name: "Flixer SU",
    isFrench: false,
    urls: {
      movie: "https://flixer.su/watch/movie/{id}",
      tv: "https://flixer.su/watch/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "mocine",
    name: "Mocine",
    isFrench: false,
    urls: {
      movie: "https://mocine.cam/watching-movie?movieId={id}",
      tv: "https://mocine.cam/watching-series?id={id}&season={season}&episode={episode}",
    },
  },
  {
    id: "filmku",
    name: "Filmku",
    isFrench: false,
    urls: {
      movie: "https://filmku.stream/embed/{id}",
      tv: "https://filmku.stream/embed/{id}/{season}/{episode}",
    },
  },
  {
    id: "asguard",
    name: "Asguard",
    isFrench: false,
    urls: {
      movie: "https://asgardstream-api.pages.dev/movie/{id}",
      tv: "https://asgardstream-api.pages.dev/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "onemovie",
    name: "OneMovie",
    isFrench: false,
    urls: {
      movie: "https://111movies.com/movie/{id}",
      tv: "https://111movies.com/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "turbovid",
    name: "TurboVid",
    isFrench: false,
    urls: {
      movie: "https://turbovid.eu/api/req/movie/{id}",
      tv: "https://turbovid.eu/api/req/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "smashy",
    name: "Smashy",
    isFrench: false,
    urls: {
      movie:
        "https://embed.smashystream.com/playere.php?tmdb={id}&btPosition=10",
      tv: "https://embed.smashystream.com/playere.php?tmdb={id}&season={season}&episode={episode}&btPosition=10",
    },
  },
  {
    id: "mostream",
    name: "Mostream",
    isFrench: false,
    urls: {
      movie: "https://mostream.us/emb.php?tmdb={id}",
      tv: "https://mostream.us/emb.php?tmdb={id}&s={season}&e={episode}",
    },
  },
  {
    id: "nontongo",
    name: "NonTongo",
    isFrench: false,
    urls: {
      movie: "https://www.nontongo.win/embed/movie/{id}",
      tv: "https://www.nontongo.win/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "gomo",
    name: "Gomo",
    isFrench: false,
    urls: {
      movie: "https://gomo.to/movie/{id}",
      tv: "https://gomo.to/show/{id}/{season}-{episode}",
    },
  },
  {
    id: "godriveplayer",
    name: "Google Drive",
    isFrench: false,
    urls: {
      movie: "https://godriveplayer.com/player.php?type=movie&tmdb={id}",
      tv: "https://godriveplayer.com/player.php?type=series&tmdb={id}&season={season}&episode={episode}",
    },
  },
  {
    id: "indian",
    name: "Indian",
    isFrench: false,
    urls: {
      movie: "https://player.vidpro.top/embed/movie/{id}",
      tv: "https://player.vidpro.top/embed/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "russian",
    name: "Russian",
    isFrench: false,
    urls: {
      movie: "https://api.insertunit.ws/embed/imdb/{id}",
      tv: "https://api.insertunit.ws/embed/imdb/{id}?season={season}&episode={episode}",
    },
  },
  {
    id: "french",
    name: "French",
    isFrench: true,
    urls: {
      movie: "https://frembed.lol/api/film.php?id={id}",
      tv: "https://frembed.lol/api/serie.php?id={id}&sa={season}&epi={episode}",
    },
  },
  {
    id: "spanish",
    name: "Spanish",
    isFrench: false,
    urls: {
      movie: "https://kllamrd.org/video/{id}",
      tv: "https://kllamrd.org/video/{id}-{season}x{episode}",
    },
  },
  {
    id: "portuguese",
    name: "Portuguese",
    isFrench: false,
    urls: {
      movie: "https://embed.warezcdn.link/filme/{id}",
      tv: "https://embed.warezcdn.link/serie/{id}/{season}/{episode}",
    },
  },
  {
    id: "rgshows",
    name: "RgShows",
    isFrench: false,
    urls: {
      movie: "https://www.rgshows.me/player/movies/api4/index.html?id={id}",
      tv: "https://www.rgshows.me/player/series/api4/index.html?id={id}&s={season}&e={episode}",
    },
  },
  {
    id: "vidsrcnl",
    name: "VidSrc NL",
    isFrench: false,
    urls: {
      movie: "https://player.vidsrc.nl/embed/movie/{id}",
      tv: "https://player.vidsrc.nl/embed/tv/{id}/{season}/{episode}",
    },
  },
    {
    id: "watchlol",
    name: "Watchlol",
    isFrench: false,
    urls: {
      movie: "https://watchseries.lol/embed/pid{id}",
      tv: "https://watchseries.lol/embed/tvd{id}/{season}/{episode}",
    },
  },
  {
    id: "vidstream",
    name: "VidStream",
    isFrench: false,
    urls: {
      movie: "https://vidstreams.net/embed/pid{id}",
      tv: "https://vidstreams.net/embed/tvd{id}/{season}/{episode}",
    },
  },
  {
    id: "anyembed",
    name: "AnyEmbed",
    isFrench: false,
    urls: {
      movie: "https://anyembed.xyz/movie/{id}",
      tv: "https://anyembed.xyz/tv/{id}/{season}/{episode}",
    },
  },
  {
    id: "ythd",
    name: "YTHD",
    isFrench: false,
    urls: {
      movie: "https://ythd.org/embed/{id}",
      tv: "https://ythd.org/embed/{id}",
    },
  },
];
