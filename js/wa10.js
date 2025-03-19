const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

const storyText = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
const insertX = ["Willy the Goblin", "Big Daddy", "Father Christmas"];
const insertY = ["the soup kitchen", "Disneyland", "the White House"];
const insertZ = ["spontaneously combusted", "melted into a puddle on the sidewalk", "turned into a slug and crawled away"];

randomize.addEventListener('click', result);

function result() {
    let xItem = randomValueFromArray(insertX);
    let yItem = randomValueFromArray(insertY);
    let zItem = randomValueFromArray(insertZ);

    let newStory = storyText.replace(/:insertx:/g, xItem);
    newStory = newStory.replace(/:inserty:/g, yItem);
    newStory = newStory.replace(/:insertz:/g, zItem);

    if(customName.value !== '') {
        let name = customName.value;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        newStory = newStory.replace("Bob", name);
    }
    
    if(document.getElementById("uk").checked) {
        const weight = Math.round(300/14) + ' stone';
        const temperature =  Math.round((94 - 32) * 5/9) + ' centigrade';
        
        newStory = newStory.replace("300", weight);
        newStory = newStory.replace("94", temperature);
    }

    story.textContent = newStory;
    story.style.visibility = 'visible';
}

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}