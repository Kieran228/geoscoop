//todo I created a simple searchbar that tracks the users input

//todo next we need to implement the logic to actually be able to search for locations... what api will allow me to geocode that? OpenStreetMap has Nominatim, and they're both free. Let's try that

//! I want to make sure not to add api calls for every keystroke within the input field, that would be too many requests
//todo What I need to do is to wait for the user to pauses typing - Which is called "Debouncing".

//todo Now lets update the app from it's previous functionality.

// Great, we're getting results back from the api call. Thing is, i dont want to diplay all of this raw Data. There are a lot of properties that i dont actually need at this point in time. Let's clean this up and only keep what's important
//todo We need to have it display as a dropdown menu with suggestions

// We got the dropdown to display, but they aren't clickable yet and the list stays open all the time.
//todo Now we need to add selecting a location functionality...

import { useEffect, useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  // Adding the suggestion dropdown
  const [suggestions, setSuggestions] = useState([]);

  // Making the dropdown work
  const [showSuggestions, setshowSuggestions] = useState([false]);

  //? how do i search for a location?
  // lets try a basic fetch request to the Nominatim api
  // That worked, so now it's time to what i need from each result..

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
    <div>
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
