const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");


btn.addEventListener("click", (event) => {
    event.preventDefault();
    errorMessage.textContent = "";
    let txt = document.getElementById("txt").value;

    if (!txt) {
        result.innerHTML = `<p>Please enter a word.</p>`;
        return;
    }
    
    if (!/^[a-zA-Z]+$/.test(txt)) {
        result.innerHTML = `<p>Please enter a valid word containing only letters.</p>`;
        return;
    }

    fetch(`${url}${txt}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.status === 404 ? "Word not found" : `HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        errorMessage.textContent = "";
        result.innerHTML = '';

        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        
        const h3 = document.createElement('h3');
        h3.textContent = txt;
        wordDiv.appendChild(h3);

        const playButton = document.createElement('button');
        playButton.id = 'play-sound';
        playButton.textContent = '🔊';
        wordDiv.appendChild(playButton);

        result.appendChild(wordDiv);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';

        const partOfSpeech = document.createElement('p');
        partOfSpeech.textContent = data[0].meanings[0].partOfSpeech;
        detailsDiv.appendChild(partOfSpeech);

        const phonetic = document.createElement('p');
        phonetic.textContent = data[0].phonetic;
        detailsDiv.appendChild(phonetic);

        result.appendChild(detailsDiv);

        const meaning = document.createElement('p');
        meaning.className = 'word-meaning';
        meaning.textContent = data[0].meanings[0].definitions[0].definition;
        result.appendChild(meaning);

        const example = document.createElement('p');
        example.className = 'word-example';
        example.textContent = data[0].meanings[0].definitions[0].example || '';
        result.appendChild(example);
        
        sound.src = data[0].phonetics[0]?.audio || "";

        playButton.addEventListener("click", () => {
            if (sound.src) {
                sound.play().catch((error) => {
            console.error("Playback failed:", error);
            errorMessage.textContent = "Playback failed: The audio element has no supported sources or there was an issue during playback.";
    });
            } else {
             errorMessage.textContent = "No valid audio source available.";
            }
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        result.innerHTML = ''; 
        if (error.message === "Word not found") {
            console.log("Word not found error caught!");
            result.innerHTML = '<p class="error">Word not found. Please try another word.</p>';
        } else {
            result.innerHTML = `<p class="error">${error.message}</p>`;
        }
    });
});