import type { MutableRefObject, ReactNode } from "react";
import React, { Fragment } from "react";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { createHeadlessEditor } from "@lexical/headless";
import {
  $getRoot,
  type LexicalNode,
  ElementNode,
  TextNode,
  type EditorState,
} from "lexical";
import {
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import {
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { type Transformer } from "@lexical/markdown";

const nodes = [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode];

type RenderOptions = {
  plain?: boolean;
  headingsOffset?: number;
};

export function parseSimpleMarkdown(
  markdown: string,
  options?: RenderOptions,
): ReactNode {
  if (!markdown) {
    return null;
  }

  const editor = createHeadlessEditor({ nodes });
  let reactContent: ReactNode = null;

  editor.update(() => {
    $convertFromMarkdownString(markdown, TRANSFORMERS);

    const root = $getRoot();
    reactContent = lexNodesToReactNodes(root.getChildren(), options ?? {});
  });

  return reactContent;
}

export function lexNodesToReactNodes(
  lexNodes: LexicalNode[],
  options: RenderOptions,
): ReactNode {
  return lexNodes.map((lexNode, i) => {
    const index = `parsed_md_${i}`;

    if (options.plain) {
      return <Fragment key={index}>{lexNode.getTextContent()}</Fragment>;
    }

    if ($isHeadingNode(lexNode)) {
      const headingOffset = options.headingsOffset ?? 0;
      const headingLevel = parseInt(lexNode.getTag().replace("h", ""), 10);
      const newHeading = Math.min(6, Math.max(1, headingLevel + headingOffset));
      const Tag = `h${newHeading}` as keyof JSX.IntrinsicElements;

      const children = lexNodesToReactNodes(
        lexNode.getChildren(),
        options ?? {},
      );

      return <Tag key={index}>{children}</Tag>;
    }

    if ($isListNode(lexNode)) {
      const listType = lexNode.getListType();
      const Tag = listType === "number" ? "ol" : "ul";

      return (
        <Tag key={index}>
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </Tag>
      );
    }

    if ($isListItemNode(lexNode)) {
      return (
        <li key={index}>
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </li>
      );
    }

    if ($isLinkNode(lexNode)) {
      const url = lexNode.getURL();
      return (
        <a key={index} href={url} target="_blank">
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </a>
      );
    }

    if ($isQuoteNode(lexNode)) {
      return (
        <blockquote key={index}>
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </blockquote>
      );
    }

    if (lexNode instanceof TextNode) {
      let content: ReactNode = lexNode.getTextContent();
      const format = lexNode.getFormat();

      // NOTE: el manejo de estilos del textnode se hace por bit
      if (format & 1) {
        content = <strong key={`b-${index}`}>{content}</strong>;
      }
      if (format & 2) {
        content = <em key={`i-${index}`}>{content}</em>;
      }
      if (format & 8) {
        content = <u key={`u-${index}`}>{content}</u>;
      }

      return <React.Fragment key={index}>{content}</React.Fragment>;
    }

    if (lexNode instanceof ElementNode) {
      return (
        <p key={index}>
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </p>
      );
    }

    return null;
  });
}

export function fromLexicalEditorStateRefToMarkdown(
  textStateRef: MutableRefObject<EditorState | null>,
  transformers: Transformer[],
): string {
  if (!textStateRef.current) {
    return "";
  }

  const markdown = textStateRef.current.read(() =>
    $convertToMarkdownString(transformers),
  );

  return markdown;
}
