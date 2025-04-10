const btn = document.querySelector(".new-quote");
const answerBtn = document.querySelector(".twitter");
const jokeAPIEndPt = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const bgImgAPIEndPt = "https://php-noise.com/noise.php?hex=${hex}&json";
let current = {
    part1: "",
    part2: null
};

btn.addEventListener("click", getJoke);
answerBtn.addEventListener("click", () => displayAnswer(current))

getBG();
getJoke();

async function getBG(){
    try{
        const hex = Math.floor(Math.random()*16777215).toString(16);
        const bgImgAPIEndPt = `https://php-noise.com/noise.php?hex=${hex}&json`;

        updateUIColors(hex);

        document.querySelector("body").style.backgroundImage = `url(${bgImgAPIEndPt})`;
    }

    catch(err){
        console.log(err);
        document.querySelector("body").style.backgroundImage = "#000000";
    }
}

async function getJoke(){
    try{
        const response = await fetch(jokeAPIEndPt);

        if(!response.ok){
            throw Error(response.statusText);
        }

        const json = await response.json();
        if (json.type === "twopart") {
            current.part1 = json.setup;
            current.part2 = json.delivery;

            answerBtn.style.display = "block";
        }
        else{
            current.part1 = json.joke;
            current.part2 = null;

            answerBtn.style.display = "none";
        }

        getBG();
        displayJoke(current);

        const part2Text = document.querySelector("#js-answer-text");
        part2Text.textContent = "";
    }

    catch(err){
        console.log(err);
        alert("Fail");
    }
}

function displayJoke(joke){
    const part1Text = document.querySelector("#js-quote-text")

    part1Text.textContent = joke.part1;
}

function displayAnswer(joke){
    const part2Text = document.querySelector("#js-answer-text");

    if(joke.part2){
        part2Text.textContent = joke.part2
    }
}

function getColorBrightness(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 4), 16);
    const b = parseInt(hexColor.substr(4, 6), 16);
    
    return ((r * 299) + (g * 587) + (b * 114)) / 1000000;
}

function updateUIColors(hex){
    const header = document.querySelector("header");
    const quotes = document.querySelector(".quotes");
    const controls = document.querySelector(".controls");
    const brightness = getColorBrightness(hex);
    // console.log(brightness);
    const textColor = brightness > 10 ? "#000000" : "#FFFFFF";

    header.style.backgroundColor = `#${hex}` + "95";
    header.style.color = textColor;
    quotes.style.backgroundColor = `#${hex}` + "65";
    document.querySelector("#js-quote-text").style.color = textColor;
    controls.style.backgroundColor = `#${hex}` + "95";
    document.querySelector("footer").style.color = textColor;
    document.querySelectorAll("a").forEach((e) => {
        e.style.color = textColor;
    });

    btn.style.backgroundColor = `#${hex}`;
    btn.style.color = textColor;
    
    if (answerBtn.style.display !== "none") {
        document.querySelector("#js-answer-text").style.color = textColor;
        answerBtn.style.backgroundColor = `#${hex}` + "40";
        answerBtn.style.color = textColor;
    }

}