const dogSelect = document.getElementById('dog-breed');
const gallery = document.getElementById('gallery');
const breedInfo = document.getElementById('breed-info');
const showFavBtn = document.getElementById('showFavourites');

const apiKey = 'live_Ysf4euTUTcyPb5RgLcJGcZG5wcspqHS29RCcHqfBQlZGmb2hcrOdguxt2fxHEOMx'; 
let allBreeds = [];

//  Fetch all dog breeds
async function fetchDogBreeds() {
  try {
    const response = await fetch('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': apiKey }
    });
    const breeds = await response.json();
    allBreeds = breeds;

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      dogSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
  }
}

//  Display breed images and info
async function displayBreedImages(breedId) {
  if (!breedId) {
    gallery.innerHTML = "";
    breedInfo.innerHTML = "";
    return;
  }

  try {
    const selectedBreed = allBreeds.find(b => b.id == breedId);
    if (!selectedBreed) return;

    // Display breed info
    breedInfo.innerHTML = `
      <h2>${selectedBreed.name}</h2>
      <p><strong>Weight:</strong> ${selectedBreed.weight.imperial} lbs (${selectedBreed.weight.metric} kg)</p>
      <p><strong>Height:</strong> ${selectedBreed.height.imperial} in (${selectedBreed.height.metric} cm)</p>
      <p><strong>Life Span:</strong> ${selectedBreed.life_span}</p>
      <p><strong>Temperament:</strong> ${selectedBreed.temperament || 'Not available'}</p>
      <p><strong>Origin:</strong>${selectedBreed.origin || 'Not available'}</p>
    `;

    // Fetch multiple images
    const res = await fetch(
      `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&limit=6`,
      { headers: { 'x-api-key': apiKey } }
    );
    const data = await res.json();

    // If no images returned, fallback to reference_image_id
    const images = data.length > 0 ? data : [];
    if (images.length === 0 && selectedBreed.reference_image_id) {
      const fallbackRes = await fetch(
        `https://api.thedogapi.com/v1/images/${selectedBreed.reference_image_id}`,
        { headers: { 'x-api-key': apiKey } }
      );
      const fallbackData = await fallbackRes.json();
      images.push(fallbackData);
    }

    // Display images
    gallery.innerHTML = "";
    images.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${item.url}" alt="${selectedBreed.name}" width="250">
        <div>
          <button onclick="addToFavourites('${item.id}')">❤️ Favourite</button>
        </div>
      `;
      gallery.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching breed images:', error);
  }
}

//  Add Image to Favourites
async function addToFavourites(imageId) {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/favourites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({ image_id: imageId })
    });
    if (res.ok) {
      alert("Added to favourites! 🐾");
    } else {
      alert("Failed to add favourite.");
    }
  } catch (err) {
    console.error("Error adding favourite:", err);
  }
}

// Show Favourite Dogs
async function showFavourites() {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/favourites", {
      headers: { "x-api-key": apiKey }
    });
    const data = await res.json();

    gallery.innerHTML = "";
    breedInfo.innerHTML = "<h2>Your Favourite Dogs ❤️</h2>";

    data.forEach(fav => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${fav.image.url}" alt="Favourite Dog" width="250">
        <div>
          <button onclick="removeFavourite(${fav.id})"> Remove</button>
        </div>
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading favourites:", err);
  }
}

// Remove Favourite
async function removeFavourite(favId) {
  try {
    const res = await fetch(`https://api.thedogapi.com/v1/favourites/${favId}`, {
      method: "DELETE",
      headers: { "x-api-key": apiKey }
    });
    if (res.ok) {
      alert("Removed from favourites 🐾");
      showFavourites();
    }
  } catch (err) {
    console.error("Error removing favourite:", err);
  }
}

// Event listeners
dogSelect.addEventListener('change', e => displayBreedImages(e.target.value));
showFavBtn.addEventListener('click', showFavourites);

//Initialize
fetchDogBreeds();
