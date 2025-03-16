import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
// import Suggest from "./Suggestion";
const suggestions = ["Food", "Nature", "Bikes", "Models"];

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGE_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);

  const fetchImages = useCallback(
    async (query = searchInput.current.value) => {
      try {
        if (query.trim()) {
          setErrorMsg("");
          const result = await axios.get(
            `${API_URL}?query=${query}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${
              import.meta.env.VITE_API_KEY
            }`
          );
          setImages(result.data.results);
          setTotalPages(result.data.total_pages);
        }
      } catch (error) {
        setErrorMsg("Error fetching images. Try again later");
        console.log(error);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchImages();
  }, [fetchImages, page]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchImages();
    setPage(1);
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    setPage(1);
    fetchImages(selection); // Pass selected query directly
  };

  const openModal = async (image) => {
    setSelectedImage(image);
    try {
      const result = await axios.get(
        `${API_URL}?query=${
          image.tags ? image.tags[0].title : image.description
        }&per_page=5&client_id=${import.meta.env.VITE_API_KEY}`
      );
      setRelatedImages(result.data.results);
    } catch (error) {
      console.log("Error fetching related images", error);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    setRelatedImages([]);
  };

  return (
    <>
      <h1 className="text-center mt-10 text-[60px]">FotoFolio</h1>
      {errorMsg && <p className="text-red-600 text-center mt-5">{errorMsg}</p>}
      <div className="flex justify-center mt-10">
        <input
          ref={searchInput}
          className="border p-2 rounded"
          type="search"
          placeholder="Search..."
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-black text-white rounded"
        >
          Search
        </button>
      </div>
      <div className="flex space-x-2 items-center justify-center mt-5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="rounded-md bg-pink-200 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={() => handleSelection(suggestion)} // Changed from onSelect to handleSelection
          >
            {suggestion}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="cursor-pointer rounded shadow-md"
            style={{ height: "210px", objectFit: "cover" }}
            onClick={() => openModal(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-5">
          <div className="bg-white p-5 rounded-lg w-full max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg"
            >
              ✖
            </button>
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description}
              className="w-full rounded"
            />
            <a
              href={selectedImage.urls.full}
              download
              className="block text-center mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Download
            </a>
            <h3 className="text-center mt-4">Related Images</h3>
            <div className="flex gap-2 mt-4 justify-center">
              {relatedImages.map((image) => (
                <img
                  key={image.id}
                  src={image.urls.thumb}
                  alt={image.alt_description}
                  className="cursor-pointer w-20 h-20 rounded shadow-md"
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
