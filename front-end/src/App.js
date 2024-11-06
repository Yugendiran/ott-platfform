import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import MovieDetails from "./MovieDetails";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/edit-movie/:movieId" element={<EditMovie />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
