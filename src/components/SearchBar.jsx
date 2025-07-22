import { useEffect, useRef, useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  // Adding the suggestion dropdown
  const [suggestions, setSuggestions] = useState([]);

  // Making the dropdown work
  const [showSuggestions, setshowSuggestions] = useState([false]);

  // Adding outside click detection reference
  const searchContainerReference = useRef(null);

  //? how do i search for a location?
  // lets try a basic fetch request to the Nominatim api
  // That worked, so now it's time to Display what i need from each result..

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerReference.current &&
        !searchContainerReference.current.contains(event.target)
      ) {
        setshowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    //todo Remember, I dont want to make an api call for every keystroke, so lets add a delay of some sort
    const timer = setTimeout(() => {
      if (query) {
        // Let's try to fetch some data
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        )
          .then((response) => response.json())
          .then((data) => {
            const simplifiedData = data.map((item) => ({
              id: item.place_id,
              name: item.display_name,
              rank: item.place_rank,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));
            setSuggestions(simplifiedData);
          })
          .catch((error) => {
            console.error("Error", error);
          });
      }
    }, 300); // Wait 300ms after typing stops to diplay results

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setshowSuggestions(false);
    // Do something with the selected location
    console.log("Selected", suggestion);
  };

  return (
    <div ref={searchContainerReference}>
      <input
        type="text"
        placeholder="Search for a Location..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setshowSuggestions(true);
        }}
        onFocus={() => setshowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {/* Let's see what the data looks like */}
      {/* <pre>
        {JSON.stringify(suggestions, null, 2)}
       </pre> */}
    </div>
  );
};

export default SearchBar;
