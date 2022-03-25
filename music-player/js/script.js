const wrapper = document.querySelector('.wrapper'),
    musicImg = wrapper.querySelector('.img-area img'),
    musicName = wrapper.querySelector('.song-details .name'),
    musicArtist = wrapper.querySelector('.song-details .artist'),
    mainAudio = wrapper.querySelector('#main-audio'),
    playPauseBtn = wrapper.querySelector('.play-pause'),
    prevBtn = wrapper.querySelector('#prev'),
    nextBtn = wrapper.querySelector('#next'),
    progressBar = wrapper.querySelector('.progress-bar')
    progressArea = wrapper.querySelector('.progress-area'),
    musicList = wrapper.querySelector('.music-list')
    showMoreBtn = wrapper.querySelector('#more-music'),
    hideMusicBtn = musicList.querySelector('#close')



let musicIndex = 1
window.addEventListener('load', () => {
    loadMusic(musicIndex)
    playingNow()
})
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name
    musicArtist.innerText = allMusic[indexNumb - 1].artist
    musicImg.src = `/images/${allMusic[indexNumb - 1].img}.png`
    mainAudio.src = `/songs/${allMusic[indexNumb - 1].src}.mp3`
}

function playMusic() {
    wrapper.classList.add('paused')
    playPauseBtn.querySelector('i').innerText = 'pause'
    mainAudio.play()
}
function pauseMusic() {
    wrapper.classList.remove('paused')
    playPauseBtn.querySelector('i').innerText = 'play_arrow'
    mainAudio.pause()
    playingNow()
}

playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused')
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow()
})

function nextMusic() {
    musicIndex++
    if (musicIndex > allMusic.length) musicIndex = 1
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}
function prevMusic() {
    musicIndex--
    if (musicIndex < 1) musicIndex = allMusic.length
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}
nextBtn.addEventListener('click', () => {
    nextMusic()
    playingNow()
})
prevBtn.addEventListener('click', () => {
    prevMusic()
    playingNow()
})
mainAudio.addEventListener('timeupdate', (e) => {
    const totalTime = mainAudio.duration,
        currentTime = mainAudio.currentTime
    progressBar.style.width = `${(currentTime / totalTime) * 100}%`

    let musicDurationTime = wrapper.querySelector('.duration')
    let musicCurrentTime = wrapper.querySelector('.current')
    mainAudio.addEventListener('loadeddata', () => {

        // total song duration

        let audioDuration = mainAudio.duration
        let minutes = Math.floor(audioDuration / 60)
        let seconds = Math.floor(audioDuration % 60)
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        musicDurationTime.innerText = `${minutes}:${seconds}`

    })
    // current song duration
    let audioCurrentTime = mainAudio.currentTime
    let currentMinutes = Math.floor(audioCurrentTime / 60)
    let currentSeconds = Math.floor(audioCurrentTime % 60)
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`
    }
    musicCurrentTime.innerText = `${currentMinutes}:${currentSeconds}`
})
progressArea.addEventListener('click', (e) => { 
    let progressWidthVal = progressArea.clientWidth
    let clikedOffsetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clikedOffsetX / progressWidthVal) * songDuration
    playMusic()

})

// repeat, shuffle song
const repeatBtn = wrapper.querySelector('#repeat-plist')
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute('title', 'Repeat One')
            break
        case "repeat_one":
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute('title', 'Shuffle')
            break
        case "shuffle": 
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute('title', 'Repeat')
            playingNow()
            break
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText

    switch (getText) {
        case "repeat":
            nextMusic()
            break
        case "repeat_one":
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break
        case "shuffle": 
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1)

            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            } while (musicIndex == randIndex) {
                musicIndex = randIndex
                loadMusic(musicIndex)
                playMusic()
                playingNow()
            }
            break   
    }
})

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show')
})
hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click()
})

const ulTag = wrapper.querySelector('ul')
for (let i = 0; i < allMusic.length; i++) {

    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`
    ulTag.insertAdjacentHTML('beforeend', liTag)

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration = liAudioTag.duration
        let minutes = Math.floor(audioDuration / 60)
        let seconds = Math.floor(audioDuration % 60)
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        liAudioDuration.innerText = `${minutes}:${seconds}`
        liAudioDuration.setAttribute("t-duration", `${minutes}:${seconds}`)
    })
}
const allLiTags = ulTag.querySelectorAll('li')
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector('.audio-duration')

    // remove the playing class if contain
    if (allLiTags[j].classList.contains('playing')) {
        allLiTags[j].classList.remove('playing')
        
        let adDuration = audioTag.getAttribute("t-duration")
        audioTag.innerText = adDuration
    }
    
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
        allLiTags[j].classList.toggle('playing')
        audioTag.innerText = 'Playing'
    }
    allLiTags[j].setAttribute('onclick', 'clicked(this)')
}  
}

function clicked(elemet) {
    let getLiIndex = elemet.getAttribute("li-index")
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}