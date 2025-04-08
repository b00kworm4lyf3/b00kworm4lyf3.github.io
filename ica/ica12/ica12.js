const btn = document.querySelector(".new-quote");
const answerBtn = document.querySelector(".twitter")
const APIEndPt = "https://trivia.cyberwisp.com/getrandomchristmasquestion";
let current = {
    question: "",
    answer: ""
};

btn.addEventListener("click", getQuote);
answerBtn.addEventListener("click", () => displayAnswer(current.answer));

getQuote();

async function getQuote(){
    try{
        const response = await fetch(APIEndPt);

        if(!response.ok){
            throw Error(response.statusText);
        }

        const json = await response.json();
            current.question = json.question;
            current.answer = json.answer;

            displayQuote(current.question);

            const answerText = document.querySelector("#js-answer-text");
            answerText.textContent = "";
        }

        catch(err){
            console.log(err);
            alert("Fail");
        }
}

function displayQuote(quote){
    const quoteText = document.querySelector("#js-quote-text")
    quoteText.textContent = quote;
}

function displayAnswer(answer){
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = answer;
}