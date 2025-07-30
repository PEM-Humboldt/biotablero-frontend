import { SearchBar } from "pages/monitoring/searchBar";
import { SideBar } from "pages/monitoring/sideBar";
import { Map } from "pages/monitoring/Map";
import "pages/monitoring/utils/monitoring.css";

export const Monitoring = () => {

  return (
    <div>
      <SideBar />
      <SearchBar />
      <Map />
    </div>
  );
};
