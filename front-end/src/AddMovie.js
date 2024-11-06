import React, { useState } from "react";
import axios from "axios";

const CreateMovie = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleThumbnailChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (<10MB)
    if (file.size > 10000000) {
      setMessage("File size is too large. Max size is 10MB.");
      return;
    }

    // Check file type (only images)
    if (!file.type.match("image.*")) {
      setMessage("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    // Read file as Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/asset/upload`,
          {
            file: reader.result,
            fileName: file.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setThumbnail(response.data.srcUrl); // Set the thumbnail to the uploaded file's URL
          setMessage("Thumbnail uploaded successfully!");
        } else {
          setMessage("Failed to upload thumbnail.");
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        setMessage("Something went wrong while uploading.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/movies", {
        title,
        description,
        videoSrc,
        thumbnail,
      });

      if (response.data.success) {
        setMessage("Movie created successfully!");
        setTitle("");
        setDescription("");
        setVideoSrc("");
        setThumbnail("");
      } else {
        setMessage("Failed to create movie.");
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      setMessage("An error occurred while creating the movie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full min-h-screen p-8 mx-auto text-white bg-gray-800 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <a href="/">
            <button className="text-blue-500">Go Back</button>
          </a>
        </div>
        <h1 className="text-2xl font-bold ">Create a New Movie</h1>
        <div></div>
      </div>
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
          <input
            type="file"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
          />
          {isUploading && (
            <p className="mt-2 text-sm text-gray-400">Uploading thumbnail...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Create Movie"}
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

export default CreateMovie;
