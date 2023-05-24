import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchSearchResults } from '../utils/index';
import { Post } from '../types/types';
import PostListItem from '../components/PostListItem';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const results = await fetchSearchResults(query as string);
        setSearchResults(results);
      }
    };

    fetchData();
  }, [query]);

  const handleSortBy = (sortOption: string) => {
    setSortBy(sortOption);
  };


  useEffect(() => {
    const sortResults = () => {
      let sortedResults = [...searchResults];

      // Sort search results based on selected sort option
      switch (sortBy) {
        case 'latest':
          sortedResults.sort((a, b) => b.dateCreated.valueOf() - a.dateCreated.valueOf());
          break;
        case 'oldest':
          sortedResults.sort((a, b) => a.dateCreated.valueOf() - b.dateCreated.valueOf());
          break;
        case 'az':
          sortedResults.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'za':
          sortedResults.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }

      setSearchResults(sortedResults);
    };

    sortResults();
  }, [sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        <div className="mb-4">
          <label className="mr-2 font-bold">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortBy(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="latest">Latest to Oldest</option>
            <option value="oldest">Oldest to Latest</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>
        {searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
