import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { Link, useParams } from "react-router";

export function ManageTS() {
  const { storys, currentStory } = useTerritoryStorysCTX();
  const { initiativeId } = useParams();
  console.log(storys);
  // NOTE: No usar la url, solo parámetros internos duros
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;
  return (
    <ul>
      {storys.map((story) => (
        <li key={story.id}>
          {story.title} - {new Date(story.creationDate).toLocaleDateString()} -{" "}
          {story.authorUserName}
        </li>
      ))}
    </ul>
  );
}
