//todo I created a simple searchbar that tracks the users input

//todo next we need to implement the logic to actually be able to search for locations... what api will allow me to geocode that? OpenStreetMap has Nominatim, and they're both free. Let's try that

//! I want to make sure not to add api calls for every keystroke within the input field, that would be too many requests
//todo What I need to do is to wait for the user to pauses typing - Which is called "Debouncing".

//todo Now lets update the app from it's previous functionality.

// Great, we're getting results back from the api call. Thing is, i dont want to diplay all of this raw Data. There are a lot of properties that i dont actually need at this point in time. Let's clean this up and only keep what's important
//todo We need to have it display as a dropdown menu with suggestions

// We got the dropdown to display, but they aren't clickable yet and the list stays open all the time.
//todo Now we need to add selecting a location functionality...

// Great, the dropdown list items are now clickable and return properties, but when i click outside of the search box nothing happens.
//todo Now I need to add a click-outside click handler, will detect clicks outside the component. 
//? I dont know how to detect clicks outside of my componenet, let me look it up
// We found out that we can detect outside clicks using the useRef hook. Let's try it...
//? I was wondering if I should be using multiple useEffect hooks in one component. Reddit said it was okay, for certain use cases. It happens.

// Great! We got it working, now I need it to actually do something when I click one of the suggestions.
// I'm assuming that we will have to connect the map to the dropdown itself, or the nomatim api. Let's see...


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
      if (searchContainerReference.current && !searchContainerReference.current.contains(event.target)) {
        setshowSuggestions(false);
      }
    };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
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
