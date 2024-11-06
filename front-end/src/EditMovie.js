import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditMovie = () => {
  const { movieId } = useParams(); // movieId from route parameters
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch movie data on component load
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/${movieId}`
        );
        if (response.data.success) {
          const { title, description, videoSrc, thumbnail } =
            response.data.movie;
          setTitle(title);
          setDescription(description);
          setVideoSrc(videoSrc);
          setThumbnail(thumbnail);
        } else {
          setMessage("Failed to fetch movie data.");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        setMessage("An error occurred while fetching the movie.");
      }
    };

    fetchMovie();
  }, [movieId]);

  // Handle thumbnail change
  const handleThumbnailChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size and type
    if (file.size > 10000000) {
      setMessage("File size is too large. Max size is 10MB.");
      return;
    }
    if (!file.type.match("image.*")) {
      setMessage("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/asset/upload",
          { file: reader.result, fileName: file.name },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          setThumbnail(response.data.srcUrl); // Update thumbnail URL
          setMessage("Thumbnail uploaded successfully!");
        } else {
          setMessage("Failed to upload thumbnail.");
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        setMessage("An error occurred while uploading the thumbnail.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Handle remove thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnail(""); // Clear the thumbnail URL
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/movies/${movieId}`,
        {
          title,
          description,
          videoSrc,
          thumbnail,
        }
      );

      if (response.data.success) {
        setMessage("Movie updated successfully!");
        navigate("/"); // Navigate back to the home page after successful edit
      } else {
        setMessage("Failed to update movie.");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      setMessage("An error occurred while updating the movie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full min-h-screen p-8 mx-auto text-white bg-gray-800 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-500">
          Go Back
        </button>
        <h1 className="text-2xl font-bold">Edit Movie</h1>
        <div></div>
      </div>

      <script src="https://player.vimeo.com/api/player.js"></script>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="videoSrc" className="block mb-1 text-sm font-medium">
            Video Source URL
          </label>
          <input
            type="text"
            id="videoSrc"
            value={videoSrc}
            onChange={(e) => setVideoSrc(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="thumbnail" className="block mb-1 text-sm font-medium">
            Thumbnail Image
          </label>
          {thumbnail ? (
            <div className="mb-2">
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-32 h-32 mb-2 rounded"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Remove Thumbnail
              </button>
            </div>
          ) : (
            <input
              type="file"
              onChange={handleThumbnailChange}
              accept="image/*"
              className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
            />
          )}
          {isUploading && (
            <p className="mt-2 text-sm text-gray-400">Uploading thumbnail...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Update Movie"}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-sm font-medium text-center text-green-400">
          {message}
        </div>
      )}
    </div>
  );
};

export default EditMovie;
