import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { Link, useParams } from "react-router";

export function ReadTS() {
  const { storys, currentStory } = useTerritoryStorysCTX();
  const { initiativeId } = useParams();
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  return (
    <ul>
      {storys.map((story) => (
        <li key={story.id}>
          <Link to={`${baseUrl}${story.id}`}>{story.title}</Link>
        </li>
      ))}
    </ul>
  );
}
