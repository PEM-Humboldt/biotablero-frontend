import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DotIcon from "@material-ui/icons/FiberManualRecord";
import { CloseIcon } from "core/ui/IconsIndicators";

const boxColors = [
  "#b1babc",
  "#b1b2b7",
  "#666a72",
  "#b8bfcf",
  "#8792af",
  "#697f9f",
  "#5a6e7e",
  "#b8bcaf",
  "#7b8780",
  "#988b7d",
] as const;

type BoxColor = (typeof boxColors)[number];
type TagWithColor = [tag: string, color: BoxColor];
type TagManagerProps = {
  data: Map<string, string[]>;
  filterData: (filters: string[]) => void;
};

export function TagManager({ data, filterData }: TagManagerProps) {
  const [selected, setSelected] = useState<TagWithColor[]>([]);

  useEffect(() => {
    filterData(selected.map((pair) => pair[0]));
  }, [selected, filterData]);

  const clearTags = () => {
    setSelected([]);
  };

  const toggleTag = (tag: string, color: BoxColor) => {
    setSelected((prev) => {
      const filtered = prev.filter((item) => item[0] !== tag);

      if (filtered.length === prev.length) {
        filtered.push([tag, color]);
      }

      return filtered;
    });
  };

  const isTagSelected = (tag: string): boolean => {
    return selected.some((item) => item[0] === tag);
  };

  const isCategorySelected = (color: BoxColor): boolean => {
    return selected.some((item) => item[1] === color);
  };

  return (
    <>
      <div className="tagList">
        <div className="tagCount">
          {selected.length > 0 && (
            <h4>
              <button
                className="clearFilters"
                title="Limpiar filtros"
                type="button"
                onClick={clearTags}
              >
                <CloseIcon />
              </button>
              {`${selected.length} filtro${selected.length > 1 ? "s" : ""}`}
            </h4>
          )}
        </div>
        {Array.from(data).map(([title, list], idx) => {
          const color = boxColors[idx];

          return (
            <Accordion className="tagBox" key={title}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${title}-content`}
                id={title}
                className="tagCat"
                style={{ backgroundColor: color }}
              >
                <div>{title}</div>
                {isCategorySelected(color) && (
                  <div>
                    <DotIcon fontSize="inherit" />
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <div className="tagOptions">
                  {list.map((tag) => (
                    <div key={tag}>
                      <input
                        type="checkbox"
                        value={tag}
                        checked={isTagSelected(tag)}
                        onChange={() => toggleTag(tag, color)}
                      />
                      {tag}
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <div className="selectedTags">
        {selected.map(([tag, color]) => (
          <div key={`${tag}-selected`} style={{ backgroundColor: color }}>
            {tag}
          </div>
        ))}
      </div>
    </>
  );
}
