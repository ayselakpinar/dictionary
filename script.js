const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let txt = document.getElementById("txt").value;
    fetch(`${url}${txt}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        result.innerHTML = `
        <div class="word">
            <h3>${txt}</h3>
            <button id="play-sound">🔊</button>
        </div>
        <div class="details">
            <p>${data[0].meanings[0].partOfSpeech}</p>
            <p>${data[0].phonetic}</p>
        </div>
        <p class="word-meaning">${data[0].meanings[0].definitions[0].definition}</p>
        <p class="word-example">${data[0].meanings[0].definitions[0].example || ""}</p>`;
        
        sound.src = data[0].phonetics[0]?.audio || "";

        const playButton = document.getElementById("play-sound");
        
        playButton.addEventListener("click", () => {
            if (sound.src && sound.src !== "") {
                sound.play().catch((error) => {
                    console.error("Playback failed:", error);
                    alert("Playback failed: The audio element has no supported sources or there was an issue during playback.");
                });
            } else {
                alert("No valid audio source available.");
            }
        });
    })
    .catch(() => {
        result.innerHTML = `<p>Word not found. Please try another word.</p>`;
    });
});






