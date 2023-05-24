import { Post } from '../types/types';
import { fetchData } from './fetchData';

export const fetchSearchResults = async (query: string): Promise<Post[]> => {
  try {
    // Perform a Firestore query to fetch search results
    const searchResults = await fetchData('posts');

    // Filter the search results based on the query
    const filteredResults = searchResults.filter((post: Post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );

    return filteredResults;
  } catch (error) {
    // Handle any errors that occurred during the data fetching process
    console.error('Error fetching search results:', error);
    throw error;
  }
};
