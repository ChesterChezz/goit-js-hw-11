import axios from 'axios';

export async function getPhotos(query, pageCount) {
  const KEY = '37633727-a43a3450b24a92792b7acd2e2';
  const link = 'https://pixabay.com/api/';
  const url = `${link}?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${query}&per_page=40&page=${pageCount}`;

  console.log(url);

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.warn('Error:', error);
    throw error;
  }
}
