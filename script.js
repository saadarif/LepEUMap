
const map = L.map('map').setView([54, 20], 3);
const btnWrapper = document.getElementById('btn-container');

//initialize map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//global variables
let marker;
//setup a marker group
let markers;

function plotSpecies(e) {
  const [genus, species]  = e.target.innerText.split(' ');
  const speciesToPlot = genus[0] + species;
  showCoordinates(speciesToPlot);

  //add header for map
  const speciesLabel = document.getElementById("species-label");
  speciesLabel.innerHTML = `<h3>${genus + ' ' + species}</h3>`;

  //highlight button
  const speciesBtn =  document.querySelector(`button[species-key="${speciesToPlot}"]`);
  speciesBtn.classList.add('selected');

  setTimeout(() => {
    speciesBtn.classList.remove('selected');
  }, 100);

}

async function showCoordinates(insect) {

    if (typeof markers !== 'undefined') {
         markers.clearLayers();
       }
    // make new layer group for markers
    markers = L.layerGroup().addTo(map);
    
    const collections = await getCoordinatesForInsect(insect);
    plotCoordinates(collections);
    }

async function getCoordinatesForInsect(insect) {
    try {
        const response = await fetch(`coordinates/${insect.toLowerCase()}.json`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        return [[0, 0]]; // Return default coordinates if there's an error
      }
    }

function plotCoordinates(collections) {
      collections.collected.coordinates.forEach((coordinate) => {       
      marker = L.marker(coordinate).addTo(map);
      marker._icon.classList.add("collected"); 
      //add marker to layer
      markers.addLayer(marker);
  });

  //Coordinates for planned collections
      collections.planned.coordinates.forEach((coordinate) => {
      marker = L.marker(coordinate).addTo(map);
      marker._icon.classList.add("planned"); 
      //add marker to layer
      markers.addLayer(marker);
  });
}

btnWrapper.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }

  plotSpecies(event)
})