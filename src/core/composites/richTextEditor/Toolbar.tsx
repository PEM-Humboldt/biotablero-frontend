import { UndoRedo } from "@composites/richTextEditor/toolbar/UndoRedo";
import { TextStructureSelector } from "@composites/richTextEditor/toolbar/TextStructureSelector";
import { TextFormatSelector } from "@composites/richTextEditor/toolbar/TextFormatSelector";
import { ListTypeSelector } from "@composites/richTextEditor/toolbar/ListTypeSelector";
import { TextBlockSelector } from "@composites/richTextEditor/toolbar/TextBlockSelector";

export function Toolbar() {
  return (
    <div className="flex items-center rounded gap-2 p-2 bg-muted">
      <UndoRedo />
      <TextBlockSelector />
      <TextFormatSelector />
      <ListTypeSelector />
      <TextStructureSelector />
    </div>
  );
}
