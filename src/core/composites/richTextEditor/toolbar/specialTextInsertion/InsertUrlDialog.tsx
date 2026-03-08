import { useState, type ReactNode } from "react";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
} from "lexical";
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { Button } from "@ui/shadCN/component/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/shadCN/component/dialog";
import { Input } from "@ui/shadCN/component/input";
import { Label } from "@ui/shadCN/component/label";

import { uiText } from "@composites/richTextEditor/layout/uiTextAndSettings";

export function InsertUrlDialog({ trigger }: { trigger: ReactNode }) {
  const [editor] = useLexicalComposerContext();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [hasLink, setHasLink] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return;
        }

        const selectedText = selection.getTextContent();
        setText(selectedText);

        const nodes = selection.getNodes();
        const linkNode =
          nodes.find((node) => $isLinkNode(node)) || nodes[0]?.getParent();

        if ($isLinkNode(linkNode)) {
          setUrl(linkNode.getURL());
          setHasLink(true);
        } else {
          setUrl("");
          setHasLink(false);
        }
      });
    }
  };

  const handleConfirm = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      if (text !== "" && (selection.getTextContent() !== text || !hasLink)) {
        const linkNode = $createLinkNode(url);
        linkNode.append($createTextNode(text));
        $insertNodes([linkNode]);
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    });
  };

  const handleRemove = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {hasLink ? uiText.linkObject.edit : uiText.linkObject.new}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="flex flex-col gap-2">
          <Label htmlFor="text">
            {uiText.linkObject.inputText.label}
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={uiText.linkObject.inputText.placeholder}
            />
          </Label>

          <Label htmlFor="url">
            {uiText.linkObject.inputUrl.label}
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={uiText.linkObject.inputUrl.placeholder}
            />
          </Label>
        </DialogDescription>

        <DialogFooter>
          {hasLink && (
            <DialogClose asChild>
              <Button variant="outline_destructive" onClick={handleRemove}>
                {uiText.linkObject.remove}
              </Button>
            </DialogClose>
          )}
          <DialogClose asChild>
            <Button onClick={handleConfirm} disabled={!url || !text}>
              {hasLink
                ? uiText.linkObject.confirm.update
                : uiText.linkObject.confirm.new}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
