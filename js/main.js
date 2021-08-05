const jsmediatags = window.jsmediatags;

window.addEventListener('load', function() {
  const route = 'img/slide-recordar/imagen-';
  const routeDinner = 'img/Dinner/dinner-december-';
  const routePlaylistMp3 = 'mp3/playlist/track-';
  let imagenes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  let playlist = [1,2,3,4,5,6,7,8];
  const limit = imagenes.length - 1;
  const limitPlaylist = playlist.length - 1;
  const limitAlumbrado = 2;
  let imagesIndex = 0;
  let playlistIndex = 0;
  let foodIndex = 0;
  let alumbradoIndex = 0;
  let time = 3000;
  let timeAlumbrado = 400;
  const jpgFile = 'jpg';
  const svgFile = 'svg';
  const mp3File = 'mp3';
  const oggFile = 'ogg';

  const app = document.getElementById('app');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const sliderGalery = document.getElementById('slider-1');
  const carrouselGalery = document.getElementById('carrousel-1');
  const sliderFood = document.getElementById('slider-2');
  const alumbrado = document.getElementById('alumbrado');
  const Starter = document.getElementById('starter');
  const PanderetaStarter = document.getElementById('pandereta-starter');
  const ContStarter = document.getElementById('contStarter');
  let autoAnimate, autoAnimateFood, autoAnimateAlumbrado; 

  //elementos
  const oficinaCont = document.getElementById('oficina');
  const truckCont = document.getElementById('truck');

  //Audio
  const SoundPandereta = document.getElementById('panderetaSound');
  const SoundTruck = document.getElementById('truckSound');
  const SoundGeneral = document.getElementById('soundGeneral');
  const ControlAudio = document.getElementById('controlAudio');
  let EstadoDeAudio = false;

  //iniciar sonido automático
  SoundGeneral.volume = 0.2;

  Starter.addEventListener("click", function(){
    PanderetaStarter.classList.add("suenaQueSuena");
    setTimeout(function(){
      ContStarter.classList.add("hide");
      new WOW().init();
      EstadoDeAudio = true;
      controlAudio.setAttribute('status', 'pause');
      SoundGeneral.play();
      app.classList.remove("inner");
    },500)
  })
  
  //Playlist
  const Playlist = document.getElementById('playlist');
  const PlaylistNext = document.getElementById('playlistNext');
  const PlaylistPrev = document.getElementById('playlistPrev');
  const PlaylistPlay = document.getElementById('playlistPlay');
  
  const TrackRemainTime = document.getElementById('trackRemainTime');
  
  PlaylistPlay.addEventListener('click', function() {
      desactiveSong();
      if (Playlist.paused) {
          Playlist.play();
          PlaylistPlay.setAttribute('status','pause');
      } else {
          Playlist.pause();
          PlaylistPlay.setAttribute('status','play');
          activeSong();
      }
  })

  Playlist.addEventListener('timeupdate', function() {
      if (Playlist.currentTime < Playlist.duration) {
          const TrackProgress = document.getElementById('trackProgress');
          TrackProgress.style.width = (Playlist.currentTime * 100) /Playlist.duration + '%';
      }
      const RemainTime = convertToTime((Playlist.duration - Playlist.currentTime) * 1000);
      TrackRemainTime.innerHTML = RemainTime.clock; 
  })

  PlaylistPrev.addEventListener('click', function() {
      Playlist.pause();
      desactiveSong();
      if (playlistIndex > 0) {
          playlistIndex--;
      } else {
          playlistIndex = limitPlaylist;
      }
      loadTrack(playlistIndex);
      PlaylistPlay.setAttribute('status','pause');
  })
  
  PlaylistNext.addEventListener('click', function() {
      Playlist.pause();
      desactiveSong();
      if (playlistIndex < limitPlaylist) {
          playlistIndex++;
      } else {
          playlistIndex = 0;
      }
      loadTrack(playlistIndex);
      PlaylistPlay.setAttribute('status','pause');
  })

  //hover para la pandereta
  oficinaCont.addEventListener('mouseover', function() {
      SoundPandereta.volume = 0.2;
      SoundPandereta.play();
  })

  oficinaCont.addEventListener('mouseleave', function() {
      setTimeout(function() {SoundPandereta.pause()}, 500);
  })

  //hover para el tractor
  truckCont.addEventListener('mouseover', function() {
      SoundTruck.volume = 0.4;
      SoundTruck.play();
  })

  truckCont.addEventListener('mouseleave', function() {
      setTimeout(function() {SoundTruck.pause()}, 500);
  })

  //boton para pausar
  ControlAudio.addEventListener('click', function() {
      if (EstadoDeAudio) {
        desactiveSong();
      } else {
        activeSong();
      }
  })

  prev.addEventListener('click', function() {
      if (imagesIndex > 0) {
          imagesIndex--;
          changeImages(imagesIndex, sliderGalery, route, jpgFile);
      } else {
          imagesIndex = limit;
          changeImages(imagesIndex, sliderGalery, route, jpgFile);
      }
  })
  
  next.addEventListener('click', function() {
      if (imagesIndex < limit) {
          imagesIndex++;
          changeImages(imagesIndex, sliderGalery, route, jpgFile);
      } else {
          imagesIndex = 0;
          changeImages(imagesIndex, sliderGalery, route, jpgFile);
      }
  })

  carrouselGalery.addEventListener('mouseover', function() {
      clearInterval(autoAnimate);
  })

  carrouselGalery.addEventListener('mouseleave', function() {
      autoAnimate = setInterval(autoplay, time);
  })


  // Functions

  function activeSong(){
    SoundGeneral.play()
    EstadoDeAudio = true;
    controlAudio.setAttribute('status', 'pause');
  }

  function desactiveSong(){
    SoundGeneral.pause()
    EstadoDeAudio = false;
    controlAudio.setAttribute('status', 'play');
  }
   
  function loadPlaylist() {
    const firstTrack = 'mp3/playlist/track-0.mp3';
    Playlist.src = firstTrack;
    loadMetaDataTrack(false);
    loadMetaData(firstTrack);
  }
  
  function loadMetaData(file) {
    jsmediatags.read(`${window.location}${file}`, {
        onSuccess: function(data) {
        const PlaylistName = document.getElementById('playName');
          PlaylistName.innerHTML = data.tags.title;
        },
        onError: function(error) {
            console.log(error);
        }
    });
  }
  
  function convertToTime(ms) {
    if (Number.isNaN(ms)) {
      return {
        hours : 0,
        minutes : 0,
        seconds : 0,
        clock : '00:00'
      };
    } else {
      const hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
      const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
      const seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
      const formatedMinutes = minutes.toString().padStart(2, '0')
      const formatedSeconds = seconds.toString().padStart(2, '0')
      const totalTime = formatedMinutes + ':' + formatedSeconds;
        return {
          hours : hours,
          minutes : minutes,
          seconds : seconds,
          clock : totalTime
        };
    }
  }
  
  function loadTrack(track) {
    const file = `${routePlaylistMp3}${track}.${mp3File}`
    Playlist.src = file;
    loadMetaDataTrack(true);
    loadMetaData(file)
  }
  
  function loadMetaDataTrack(play) {
    setTimeout(function() {
      if (Playlist.duration) {
        const TimeTrack = convertToTime(Playlist.duration * 1000);
        const TrackTime = document.getElementById('trackTime');
        TrackTime.innerHTML = TimeTrack.clock;
      }

      if (play) {
        Playlist.play();
      }
    }, 100)
  }
  
  
  function changeImages(index, slider, urlImg, format) {
    if (index != -1) {
      slider.src = `${urlImg}${(index + 1)}.${format}`;
    }
  }
  
  function changeAlumbrado(index) {
    if (index != -1) {
      alumbrado.style.background = `url(img/set/alumbrado-${(index + 1)}.svg) no-repeat bottom center` ;
    }
  }
  
  function autoplay() {
    next.click();
  }
  
  function autoplayFood() {
    if (foodIndex < 2) {
      foodIndex++;
    } else {
      foodIndex = 0;
    }
    changeImages(foodIndex, sliderFood, routeDinner, svgFile);
  }
  
  function autoplayAlumbrado() {
    if (alumbradoIndex < limitAlumbrado) {
      alumbradoIndex++;
    } else {
      alumbradoIndex = 0;
    }
    changeAlumbrado(alumbradoIndex);
  }

    //Galery initial
    changeImages(imagesIndex, sliderGalery, route, jpgFile);

    //Galery foof
    changeImages(foodIndex, sliderFood, routeDinner, svgFile);

    //Galery alumbrado
    changeAlumbrado(alumbradoIndex);
    
    autoAnimate = setInterval(autoplay, time);
    autoAnimateFood = setInterval(autoplayFood, time);
    autoAnimateAlumbrado = setInterval(autoplayAlumbrado, timeAlumbrado);

    //llamar la playlist
    loadPlaylist();
})