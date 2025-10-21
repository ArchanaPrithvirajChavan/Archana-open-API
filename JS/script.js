const dogSelect = document.getElementById('dog-breed');
const gallery = document.getElementById('gallery');
const breedInfo = document.getElementById('breed-info');
const showFavBtn = document.getElementById('showFavourites');
const showDetailsBtn = document.getElementById('showDetails');

const apiKey = 'live_Ysf4euTUTcyPb5RgLcJGcZG5wcspqHS29RCcHqfBQlZGmb2hcrOdguxt2fxHEOMx';
let allBreeds = [];
let currentMode = 'breeds'; 

// --- Fetch all dog breeds ---
async function fetchDogBreeds() {
  try {
    const res = await fetch('https://api.thedogapi.com/v1/breeds', { headers: { 'x-api-key': apiKey } });
    allBreeds = await res.json();

    allBreeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      dogSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error fetching dog breeds:', err);
  }
}

// --- Display breed images and basic info ---
async function displayBreed(breedId) {
  currentMode = 'breeds';
  gallery.innerHTML = '';
  breedInfo.innerHTML = '';

  if (!breedId) return;

  const selectedBreed = allBreeds.find(b => b.id == breedId);
  if (!selectedBreed) return;

  breedInfo.innerHTML = `
    <h2>${selectedBreed.name}</h2>
    <p><strong>Weight:</strong> ${selectedBreed.weight.imperial} lbs (${selectedBreed.weight.metric} kg)</p>
    <p><strong>Height:</strong> ${selectedBreed.height.imperial} in (${selectedBreed.height.metric} cm)</p>
    <p><strong>Life Span:</strong> ${selectedBreed.life_span}</p>
    <p><strong>Temperament:</strong> ${selectedBreed.temperament || 'Not available'}</p>
    <p><strong>Origin:</strong> ${selectedBreed.origin || 'Not available'}</p>
  `;

  try {
    const res = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&limit=6`, {
      headers: { 'x-api-key': apiKey }
    });
    let images = await res.json();

    if (images.length === 0 && selectedBreed.reference_image_id) {
      const fallbackRes = await fetch(`https://api.thedogapi.com/v1/images/${selectedBreed.reference_image_id}`, {
        headers: { 'x-api-key': apiKey }
      });
      const fallbackData = await fallbackRes.json();
      images.push(fallbackData);
    }

    images.forEach(img => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${img.url}" alt="${selectedBreed.name}" width="250">
        <div><button onclick="addToFavourites('${img.id}')">❤️ Favourite</button></div>
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching breed images:', err);
  }
}

// breed details (data point) 
async function showBreedDetails() {
  currentMode = 'details';
  const breedId = dogSelect.value;
  if (!breedId) return alert('Please select a breed first.');

  const selectedBreed = allBreeds.find(b => b.id == breedId);
  if (!selectedBreed) return;

  
  breedInfo.innerHTML = `
    <h2>Breed Details: ${selectedBreed.name}</h2>
    <p><strong>Origin:</strong> ${selectedBreed.origin || 'Unknown'}</p>
    <p><strong>Life Span:</strong> ${selectedBreed.life_span}</p>
    <p><strong>Breed Group:</strong> ${selectedBreed.breed_group || 'Unknown'}</p>
    <p><strong>Purpose / Temperament:</strong> ${selectedBreed.temperament || 'Not available'}</p>
  `;

  gallery.innerHTML = '';
}

// --- Add Image to Favourites ---
async function addToFavourites(imageId) {
  try {
    const res = await fetch('https://api.thedogapi.com/v1/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ image_id: imageId })
    });
    if (res.ok) alert('Added to favourites! 🐾');
    else alert('Failed to add favourite.');
  } catch (err) {
    console.error(err);
  }
}

// --- Show Favourites ---
async function showFavourites() {
  currentMode = 'favourites';
  gallery.innerHTML = '';
  breedInfo.innerHTML = '<h2>Your Favourite Dogs ❤️</h2>';

  try {
    const res = await fetch('https://api.thedogapi.com/v1/favourites', {
      headers: { 'x-api-key': apiKey }
    });
    const data = await res.json();

    if (!data.length) {
      gallery.innerHTML = '<p>No favourites yet.</p>';
      return;
    }

    data.forEach(fav => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${fav.image.url}" alt="Favourite Dog" width="250">
        <div><button onclick="removeFavourite(${fav.id})">Remove</button></div>
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// --- Remove Favourite ---
async function removeFavourite(favId) {
  try {
    const res = await fetch(`https://api.thedogapi.com/v1/favourites/${favId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apiKey }
    });
    if (res.ok) {
      alert('Removed from favourites 🐾');
      showFavourites();
    }
  } catch (err) {
    console.error(err);
  }
}

// --- Event Listeners ---
dogSelect.addEventListener('change', e => displayBreed(e.target.value));
showFavBtn.addEventListener('click', showFavourites);
showDetailsBtn.addEventListener('click', showBreedDetails);

// --- Initialize ---
fetchDogBreeds();
