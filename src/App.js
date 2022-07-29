import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhots] = useState([]);
  const [pagenumber, setPagenumber] = useState(0);
  const [query, setQuery] = useState("");

  const fetchPhotos = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${pagenumber}`;
    const searchQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${searchQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      setPhots((oldvalue) => {
        if (query && pagenumber == 1) {
          return [...data.results];
        }
        if (query) {
          return [...oldvalue, ...data.results];
        } else {
          return [...oldvalue, ...data];
        }
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [pagenumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPagenumber(1);
    fetchPhotos();
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPagenumber((oldvalue) => {
          return oldvalue + 1;
        });
      }
    });

    return () => {
      window.removeEventListener("scroll", event);
    };
  }, []);

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
