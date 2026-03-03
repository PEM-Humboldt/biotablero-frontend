import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";
import { uiText } from "./tagsAdmin/layout/uiText";
import { Button } from "@ui/shadCN/component/button";
import { CircleXIcon, ListPlus } from "lucide-react";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { TagForm } from "./tagsAdmin/TagForm";

const [newTag, setNewTag] = useState(false);
const [error, setError] = useState<string>("");

export function TagsAdmin() {
  const { user } = useUserCTX();

  useEffect(() => {
    if (!user?.username) {
      return;
    }
  }, [user?.username]);

  const onCreateSuccess = () => {
    setNewTag(false);
  };

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
        <Button onClick={() => setNewTag((v) => !v)}>
          {newTag ? uiText.tag.cancelCreation : uiText.tag.createNew}
          {newTag ? <CircleXIcon /> : <ListPlus />}
        </Button>
      </header>

      {error !== "" && <ErrorsList errorItems={[error]} />}

      {newTag ? <TagForm onSuccess={onCreateSuccess} /> : <></>}
    </main>
  );
}
