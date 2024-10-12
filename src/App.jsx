import React, { useState } from "react";
import axios from 'axios';
import "./App.css";

function App()  {
  const [inputData, setInputData] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


  const searchImage = async (newSearch = false) => {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      const results = response.data.results;

      if (newSearch) {
        setImages(results);
      } else {
        setImages((prevImages) => [...prevImages, ...results]);
      }

      if (results.length > 0) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("An error occurred while fetching images. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    searchImage(true);
  };

  const handleShowMore = () => {
    setPage((prevPage) => prevPage + 1);
    searchImage();
  };

  return (
    <div className="app-container">
      <h1>Image Generator App</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          id="search-input"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Search for images..."
        />
        <button type="submit">Search</button>
      </form>

      <div id="image-container">
        {images.map((image, index) => (
          <div className="search-result" key={index}>
            <img loading="lazy" src={image.urls.small} alt={image.alt_description} />
            <a href={image.links.html} target="_blank" rel="noopener noreferrer">
              {image.alt_description || "View on Unsplash"}
            </a>
          </div>
        ))}
      </div>

      {loading && <div className="loader">Loading...</div>}

      {showMore && !loading && (
        <button onClick={handleShowMore} id="show-more-btn">
          Show More
        </button>
      )}
    </div>
  );
}

export default App;
