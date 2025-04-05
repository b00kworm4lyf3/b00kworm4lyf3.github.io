const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Declaring the array of image filenames */
const images = ['vegas1.jpg', 'vegas2.jpg', 'vegas3.jpg', 'vegas4.jpg', 'vegas5.jpg'];

/* Declaring the alternative text for each image file */
const altTxt = ['Closeup of a human eye', 'Closeup of a rock', 'Closeup of some flowers', 'Egyptian painting', 'A butterfly with its wings open'];

/* Looping through images */
for(let i = 0; i < images.length; i++){
    const newImg = document.createElement('img');
    newImg.setAttribute('src', 'images/' + images[i]);
    newImg.setAttribute('alt', altTxt[i]);
    thumbBar.appendChild(newImg);

    newImg.addEventListener('click', function(e){
        displayedImage.setAttribute('src', newImg.src);
        displayedImage.setAttribute('alt', newImg.alt);
    });
}

/* Wiring up the Darken/Lighten button */
btn.addEventListener('click', function(e){
    if(btn.getAttribute('class') === 'dark'){
        overlay.style.backgroundColor = 'rgba(255, 6, 214, 0.32)';
        btn.setAttribute('class', 'light');
        btn.textContent = 'Lighten';
    }
    else{
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        btn.setAttribute('class', 'dark');
        btn.textContent = 'Pink-ify';
    }
});