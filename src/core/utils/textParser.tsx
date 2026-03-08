import type { ReactNode } from "react";
import React from "react";

import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { createHeadlessEditor } from "@lexical/headless";
import { $getRoot, type LexicalNode, ElementNode, TextNode } from "lexical";
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

const nodes = [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode];

export function parseSimpleMarkdown(markdown: string): ReactNode {
  if (!markdown) {
    return null;
  }

  const editor = createHeadlessEditor({ nodes });
  let reactContent: ReactNode = null;

  editor.update(() => {
    $convertFromMarkdownString(markdown, TRANSFORMERS);

    const root = $getRoot();
    reactContent = lexNodesToReactNodes(root.getChildren());
  });

  return reactContent;
}

export function lexNodesToReactNodes(lexNodes: LexicalNode[]): ReactNode {
  return lexNodes.map((lexNode, i) => {
    const index = `parsed_md_${i}`;

    if ($isHeadingNode(lexNode)) {
      const Tag = lexNode.getTag();
      const children = lexNodesToReactNodes(lexNode.getChildren());

      return <Tag key={index}>{children}</Tag>;
    }

    if ($isListNode(lexNode)) {
      const listType = lexNode.getListType();
      const Tag = listType === "number" ? "ol" : "ul";
      return (
        <Tag key={index}>{lexNodesToReactNodes(lexNode.getChildren())}</Tag>
      );
    }

    if ($isListItemNode(lexNode)) {
      return <li key={index}>{lexNodesToReactNodes(lexNode.getChildren())}</li>;
    }

    if ($isLinkNode(lexNode)) {
      const url = lexNode.getURL();
      return (
        <a key={index} href={url} target="_blank">
          {lexNodesToReactNodes(lexNode.getChildren())}
        </a>
      );
    }

    if ($isQuoteNode(lexNode)) {
      return (
        <blockquote key={index}>
          {lexNodesToReactNodes(lexNode.getChildren())}
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
      return <p key={index}>{lexNodesToReactNodes(lexNode.getChildren())}</p>;
    }

    return null;
  });
}
