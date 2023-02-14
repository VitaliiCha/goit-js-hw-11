import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '33491464-caf4a17fde7a678ff49af1096';
let pageNumber;

async function searchImages(request) {
  const response = await axios
    .get(`${ENDPOINT}?key=${API_KEY}&q=${request}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`)
    .then(data => {
      pageNumber += 1
        return data;
      });
   return response.data;
}
function newSearcImages(request) {
  pageNumber = request;
}
export default { searchImages, newSearcImages };
