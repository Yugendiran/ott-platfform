import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/${movieId}`
        );
        if (response.data.success) {
          setMovie(response.data.movie);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  // Function to open and close the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const deleteMovie = async (movieId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/movies/${movieId}`
      );
      if (response.data.success) {
        alert("Movie deleted successfully!");
        navigate("/");
      } else {
        console.error("Failed to delete movie.");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="flex items-center justify-between w-full mb-10 ">
        <div>
          <button onClick={() => navigate("/")} className="text-blue-500">
            Go Back
          </button>
        </div>
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/edit-movie/${movieId}`)}
            className="text-blue-500"
          >
            Edit
          </button>
          <button onClick={() => deleteMovie(movieId)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>
      <div className="relative w-full h-fit">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="object-cover w-full mb-4 rounded-md "
        />

        <button
          onClick={toggleModal}
          className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-11 w-11"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
          </svg>
        </button>
      </div>
      <p className="text-lg text-white">{movie.description}</p>

      {/* Modal for full screen video */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black">
          <div className="relative w-full h-full">
            <button
              onClick={toggleModal}
              className="absolute text-xl text-white top-4 right-4 z-[999] h-10 w-10 bg-black rounded-full flex items-center justify-center"
            >
              &times;
            </button>
            {/* Replace this with the video player */}
            <div className="flex items-center justify-center w-full h-full">
              <iframe
                src={movie.videoSrc}
                title={`${movie.title} Video`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
