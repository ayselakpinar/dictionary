const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    // In real life, it's quite dangerous (or error-prone) to use input value without validation. Make sure to first check that the content of the input is as expected.
    let txt = document.getElementById("txt").value;
    fetch(`${url}${txt}`)
    /*
        Add extra error handling (instead of .then((response) => response.json())):
        .then((response) => {
        if (!response.ok) {
            // If the response status is not in the 200-299 range, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // If the response is okay, parse the JSON
        return response.json();
    })
    */
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        // Avoid using innerHTML, it's considered unsafe https://medium.com/@verity.carlos/why-you-shouldnt-use-innerhtml-and-what-to-use-instead-ed99d064a416
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
                    // Instead of showing an alert on the screen that blocks the website execution and provides poor UX, add an placeholder element in HTML (e.g. <p> or <div>). If error occurs here, append text to that element. Make sure to reset the error if it is not relevant any more (e.g. when the new search is triggered or user clicks the play button again).
                    alert("Playback failed: The audio element has no supported sources or there was an issue during playback.");
                });
            } else {
                // Same here about alert
                alert("No valid audio source available.");
            }
        });
    })
    .catch(() => {
        // This error would happen if the API request cannot go through. YOu actually need to add extra error handling for cases when API respose is returned with status code other than 200.
        result.innerHTML = `<p>Word not found. Please try another word.</p>`;
    });
});






