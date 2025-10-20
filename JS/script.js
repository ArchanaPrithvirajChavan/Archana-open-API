const showStatsBtn = document.createElement('button');
showStatsBtn.textContent = "Show More Breed Stats";
document.querySelector('.controls').appendChild(showStatsBtn);

showStatsBtn.addEventListener('click', async () => {
  const breedId = dogSelect.value;
  if (!breedId) return alert('Please select a breed first.');

  try {
    // Example of a second fetch: more images or API data
    const res = await fetch(
      `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&limit=10`, 
      { headers: { 'x-api-key': apiKey } }
    );
    const data = await res.json();

    breedInfo.innerHTML = `<h2>Additional Stats for ${allBreeds.find(b => b.id==breedId).name}</h2>`;

    gallery.innerHTML = '';
    data.forEach(img => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${img.url}" alt="Additional Info" width="250">
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
});
