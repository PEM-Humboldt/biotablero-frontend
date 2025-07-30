import React, { useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar: React.FC = () => {
  const [text, setText] = useState("");
  const [state, setState] = useState("");
  const [initiative, setInitiative] = useState("");
  const [naturalLevel, setNaturalLevel] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /* TODO: Load real data from Monitoring API*/
  const statesOptions = ["Amazonas", "Antioquia", "Arauca"];
  const initiativesOptions = ["Cuidadora de la Amazonía", "Fundación Gaia", "Fundación Omacha"];
  const naturalLevelsOptions = ["Genes", "Pobladores", "Ecosistemas"];

  const handleSearch = () => {
    /* TODO: Define search action behavior */
  };

  return (
    <div id="search-bar">
      <div className="search-bar-container">
        <div className="search-bar-field">
          <input
            type="text"
            placeholder="Explorar el contenido"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="search-bar-input"
          />
          <SearchIcon fontSize="small" />
        </div>

        <div className="search-bar-field">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="search-bar-input"
          >
            <option value="">Departamento</option>
            {statesOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="search-bar-field">
          <select
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            className="search-bar-input"
          >
            <option value="">Iniciativas</option>
            {initiativesOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="search-bar-field">
          <select
            value={naturalLevel}
            onChange={(e) => setNaturalLevel(e.target.value)}
            className="search-bar-input"
          >
            <option value="">Nivel natural</option>
            {naturalLevelsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="search-bar-field">
          <input
            type="text"
            placeholder="Año de Inicio"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="search-bar-input"
          />
          <CalendarTodayIcon fontSize="small" />
        </div>

        <button className="search-bar-button" onClick={handleSearch}>
          Buscar
        </button>
      </div>
    </div>
  );
};