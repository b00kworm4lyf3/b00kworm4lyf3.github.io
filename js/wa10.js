document.addEventListener('DOMContentLoaded', stars);

const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

const storyText = "Under the pale moon on an unnaturally cold, 33.5 degree fahrenheit night, :insertName: ventured into the forbidden grove. Carrying a mysterious :insertItem: weighing 13 pounds, they moved :insertMovement: through the mist. When they reached :insertLocation:, they froze in terror as they witnessed :insertSighting:. Then, without warning, :insertConsequence:. The Elder Fae watched from afar, their glimmering eyes unblinking — for they knew that anyone carrying 13 pounds of :insertItem: should never disturb the fairy rings when the moon is full.";
const names = ["Thistle Nightshade", "Morrow Duskwing", "Briar Thornheart", "Wisteria Gloomveil", "Hemlock Shadowmoss"];
const items = ["ancient grimoire", "bag of stolen moonlight", "crystal containing whispered secrets", "bundle of bone flutes", "jar of preserved memories"];
const adjs = ["silently", "clumsily", "gracefully", "frantically", "cautiously"];
const locs = ["the ancient fairy circle", "the weeping willow throne", "the glass mushroom field", "the bone flower garden", "the midnight spring"];
const sights = ["a circle of fairies drinking from a human skull", "tiny winged creatures stitching a cloak of human hair", "fairies extracting teeth from a sleeping fox", "a fairy queen consuming a butterfly's dreams", "diminutive shadows dancing with their own severed wings"];
const cons = ["their shadow was stolen and replaced with something ancient and hungry", "their reflection now shows tiny fairies living behind their eyes", "their laughter became the sound of breaking glass", "their tears turned to thorns that grew beneath their skin", "their heartbeat synchronized with the pulsing of the fairy lights"];

randomize.addEventListener('click', result);

function result() {
    let name = randomValueFromArray(names);
    let item = randomValueFromArray(items);
    let move = randomValueFromArray(adjs);
    let loc = randomValueFromArray(locs);
    let sight = randomValueFromArray(sights);
    let con = randomValueFromArray(cons);

    let newStory = storyText.replace(/:insertItem:/g, item);
    newStory = newStory.replace(/:insertMovement:/g, move);
    newStory = newStory.replace(/:insertLocation:/g, loc);
    newStory = newStory.replace(/:insertSighting:/g, sight);
    newStory = newStory.replace(/:insertConsequence:/g, con);

    if(customName.value !== '') {
        name = customName.value;
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    newStory = newStory.replace(/:insertName:/g, name);
    
    if(document.getElementById("uk").checked) {
        const weight = Math.round(13/2.205) + ' kilograms';
        const temperature =  Math.round((33.5 - 32) * 5/9) + ' degree centigrade';
        
        newStory = newStory.replaceAll("13 pounds", weight);
        newStory = newStory.replace("33.5 degree fahrenheit", temperature);
    }

    story.textContent = newStory;
    story.style.visibility = 'visible';
}

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}

function stars(){
    const body = document.body;
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'twinkle';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size (some slightly larger)
        const size = Math.random() < 0.8 ? '2px' : '3px';
        star.style.width = size;
        star.style.height = size;
        
        // Random delay for animation
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        body.appendChild(star);
    }
}