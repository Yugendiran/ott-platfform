import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movies from the API
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/movies?offset=0&limit=3"
        );
        if (response.data.success) {
          setMovies(response.data.movies);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen text-white bg-gray-900">
      <header className="flex items-center justify-between w-full p-6">
        <h1 className="mb-4 text-4xl font-bold">Sample OTT</h1>
        <nav className="flex space-x-4">
          <a href="/add-movie">
            <div className="text-lg">Add Movie</div>
          </a>
        </nav>
      </header>

      <main className="p-6">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-semibold">
            Welcome to the OTT Platform
          </h2>
          <p className="mt-2 text-lg">Stream your favorite movies</p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Featured Movies</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {movies.map((movie) => (
              <div
                key={movie.movieId}
                className="w-full p-4 bg-gray-800 rounded-md cursor-pointer aspect-video"
                onClick={() => handleMovieClick(movie.movieId)}
              >
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="object-cover w-full h-full rounded-md"
                />
                <div className="flex items-center justify-between w-full mt-2">
                  <div>
                    <h1 className="font-semibold text-white/90">
                      {movie.title}
                    </h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
