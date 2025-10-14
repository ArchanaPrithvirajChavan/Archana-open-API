// Fetching Dog Breeds and Images
const dogSelect = document.getElementById('dog-breed');
const dogImage = document.getElementById('dog-image');
const apiKey = 'x-api-key'; 

// Function to Fetch Breeds from API
async function fetchDogBreeds() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
            headers: {
                'x-api-key': apiKey
            }
        });
        //get data in json//
        const breeds = await response.json();
      console.log(breeds);
        // for loop breed names
        breeds.forEach(breed => {
        
         const option = document.createElement('option');
         //geting breed id as value and bread name as name//
        option.value = breed.id;
        option.textContent = breed.name;
        //append to dogSelect(dog-breed) 
            dogSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching dog breeds:', error);
    }
}

// Function to Selected Breed's Image
async function displayBreedImage(breedId) {
    if (!breedId) {
        dogImage.src = ''; 
        return;
    }

    try {
        //get image data from dogapi with selected (breed id) //
        const response = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`, {
            headers: {
                'x-api-key': apiKey
            }
        });
        //response converted to json data //
        const data = await response.json();
        //get the url  from data
        const imageUrl = data[0].url;
       //condition if the url is null or undefine//
        if (imageUrl) {
            dogImage.src = imageUrl;
        } else {
            dogImage.src = ''; 
        }
    } catch (error) {
        console.error('Error fetching dog image:', error);
    }
}

// Event Listener for Breed Selection Change
dogSelect.addEventListener('change', (event) => {
    //on click get value breedId
    const breedId = event.target.value;
    //send breed id to function
    displayBreedImage(breedId);
});

fetchDogBreeds();
