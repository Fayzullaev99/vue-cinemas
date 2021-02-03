// Top nav 
const navToggleElements = document.querySelectorAll('.top-nav__btn, .top-nav__list'),
  navControlElements = document.querySelectorAll('.top-nav__btn, .top-nav__close');

navControlElements.forEach(btn => btn.addEventListener('click', () =>
  navToggleElements.forEach(el => el.classList.toggle('open'))
))

// One-film Video
// linear-gradient(90deg, #DEF7FF 0%, #F4FCFF 45.64%, rgba(255, 255, 255, 0) 100.72%)
const fillBg = (animationTime, i = 0) => {
  let time = animationTime / 100
  if (i <= 100) {
    oneFilm.style.background = `linear-gradient(90deg, #DEF7FF ${i}%, #F4FCFF 45.64%, rgba(255, 255, 255, 0) 100.72%)`
    setTimeout(() => fillBg(animationTime, i + 1), time)
  }
}

const clearBg = (animationTime, i = 100) => {
  let time = animationTime / 100
  if (i >= 0) {
    oneFilm.style.background = `linear-gradient(90deg, #DEF7FF ${i}%, #F4FCFF 45.64%, rgba(255, 255, 255, 0) 100.72%)`
    setTimeout(() => clearBg(animationTime, i - 1), time)
  }
}

const film = document.querySelector('.one-film__bg'),
  filmBlock = document.querySelector('.one-film__video-block'),
  oneFilm = document.querySelector('.one-film'),
  filmClose = document.querySelector('.one-film__close'),
  play = document.getElementById('play'),
  playPause = document.querySelector('.controls__play'),
  current = document.getElementById('current'),
  controls = document.querySelector('.controls'),
  duration = document.getElementById('duration'),
  speedUp = document.querySelector('.controls__speed-up'),
  speedDown = document.querySelector('.controls__speed-down'),
  speed = document.querySelector('.controls__speed'),
  stop = document.querySelector('.controls__stop'),
  volumeProgress = document.querySelector('.controls__volume-progress'),
  volumeIcon = document.querySelector('.controls__volume-icon'),
  volumeRuler = document.querySelector('.controls__volume-ruler'),
  volumeLine = document.querySelector('.controls__volume-line')


play.onclick = e => {
  duration.innerHTML = translateTime(film.duration)
  e.preventDefault()
  filmBlock.style.opacity = 0
  document.body.style.overflowY = 'hidden'
  setTimeout(() => filmBlock.classList.add('active'), 500)
  setTimeout(() => filmBlock.style.opacity = '1', 1000)
  fillBg(500)
}

filmClose.onclick = () => {
  if (!film.paused) {
    film.pause()
    clearInterval(currentTimeInterval)
  }
  filmBlock.style.opacity = 0
  document.body.style.overflowY = 'scroll'
  setTimeout(() => filmBlock.classList.remove('active'), 500)
  setTimeout(() => filmBlock.style.opacity = '1', 1000)
  clearBg()
}

// Video play and pause
let currentTimeInterval
playPause.onclick = e => {
  e.target.classList.toggle('paused')
  if (film.paused) {
    film.play()
    currentTimeInterval = setInterval(() => {
      current.innerHTML = translateTime(film.currentTime)
    }, 1000)
  } else {
    film.pause()
    clearInterval(currentTimeInterval)
  }
}

// Translate seconds to time
function translateTime(time) {
  const addZero = num => num < 10 ? '0' + num : num
  let hour = Math.trunc(time / 3600)
  time -= hour * 3600
  let minute = Math.trunc(time / 60)
  time -= minute * 60
  time = Math.trunc(time)
  return `${hour}:${addZero(minute)}:${addZero(time)}`
}

// Film speed change

speedUp.onclick = e => speedChange(e.target)
speedDown.onclick = e => speedChange(e.target)

function speedChange(btn) {
  if (speedUp === btn && film.playbackRate < 3) {
    film.playbackRate += 0.25
  } else if (speedDown === btn && film.playbackRate > 0) {
    film.playbackRate -= 0.25
  }
  writeSpeed()
}

// Film restart

stop.onclick = e => {
  if (!film.paused) {
    film.pause()
    clearInterval(currentTimeInterval)
    playPause.classList.remove('paused')
  }
  film.currentTime = 0
  current.innerHTML = translateTime(film.currentTime)
  film.playbackRate = 1
  writeSpeed()
}

// Write film speed
function writeSpeed() {
  speed.innerHTML = film.playbackRate + 'x'
}

// On film end
film.onended = () => {
  film.pause()
  clearInterval(currentTimeInterval)
  playPause.classList.remove('paused')
  film.currentTime = 0
  current.innerHTML = translateTime(film.currentTime)
}

// Volume change

const volumeClasses = ['up', 'slash', 'down', 'normal', 'off', 'mute']

film.onvolumechange = () => {
  volumeProgress.style.width = film.volume * 100 + '%'

  let volume = film.volume * 100


  volumeClasses.forEach(className => volumeIcon.classList.remove(className))
  if (film.muted) {
    volumeIcon.classList.add('slash')
  } else if (volume > 75) {
    volumeIcon.classList.add('up')
  } else if (volume > 50) {
    volumeIcon.classList.add('normal')
  } else if (volume > 25) {
    volumeIcon.classList.add('down')
  } else if (volume > 0) {
    volumeIcon.classList.add('off')
  } else if (volume === 0) {
    volumeIcon.classList.add('mute')
  }
}

// Volume Icon click

volumeIcon.onclick = () => film.muted = !film.muted

// Volume line click 

volumeLine.onclick = e => {
  if (e.target !== volumeRuler) {
    film.volume = e.offsetX / 100
  }
}

// Volume Rule

volumeRuler.onmousedown = () => {
  window.onmousemove = volumeMove
}
window.onmouseup = () => {
  window.onmousemove = null
}

function volumeMove(e) {
  if (e.clientX >= volumeLine.offsetLeft && e.clientX <= volumeLine.offsetLeft + volumeLine.clientWidth) {
    film.volume = (e.clientX - volumeLine.offsetLeft) / 100
  }
}

// MouseWheel volume control

filmBlock.onwheel = e => {
  let volume = Math.trunc(film.volume * 100)
  if (e.deltaY < 0 && volume < 96) {
    volume += 5
  } else if (e.deltaY > 0 && volume > 4) {
    volume -= 5
  }
  film.volume = volume / 100
}


// Controls panel show

const controlsShow = ()=>{
  if (window.innerHeight < window.innerWidth) {
    if (controls.classList.contains('show')) {
      controls.classList.remove('show')
    }
  }
}

let controlsInterval = setInterval(controlsShow, 3000)

film.ontouchstart = ()=>{
  clearInterval(controlsInterval)
  controlsInterval = setInterval(controlsShow, 3000)
  if (!controls.classList.contains('show')) {
    controls.classList.add('show')
  }
}


// window.addEventListener('scroll', ()=>{
//   if (oneFilm.offsetTop < pageYOffset + innerHeight) {
//     console.dir(film)
//     film.play()
//   }
// })