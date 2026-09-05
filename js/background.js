const images = ["bg-img-01.jpg", "bg-img-02.jpg", "bg-img-03.jpg"];
const chosenImage = images[Math.floor(Math.random() * images.length)];
const bgImage = document.createElement("img");

bgImage.src = `img/${chosenImage}`;
bgImage.className = "bg-image";
bgImage.alt = "";
document.body.prepend(bgImage);
