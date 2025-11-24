import type { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { searchBarItems } from "pages/monitoring/outlets/initiativesAdmin/layout/searchBarContent";
import { useState } from "react";

const INITIATIVES_PER_PAGE = 20;

export function InitiativesAdmin() {
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: INITIATIVES_PER_PAGE,
    orderby: "timeStamp desc",
  });

  console.log(searchParams);

  return (
    <div className="ml-[60px]">
      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">cabezote</div>
      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">
        <ODataSearchBar
          components={searchBarItems}
          setSearchParams={setSearchParams}
          submit={"submit"}
          reset={"reset"}
          className="bg-red-500"
        />
      </div>
      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">
        iniciativas
        <div className="bg-red-300 my-8">formulario edicion</div>
        <div className="bg-red-300 my-8">barra iniciativa</div>
      </div>
      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">paginador</div>
    </div>
  );
}
