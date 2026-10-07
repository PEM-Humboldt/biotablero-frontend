import type { MutableRefObject, ReactNode } from "react";
import React, { Fragment } from "react";
import { Text, View, Link } from "@react-pdf/renderer";

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
import { defaultMarkdownStyles } from "@hooks/useReport/layout/mdLayout";

const nodes = [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode];

type RenderOptions = {
  plain?: boolean;
  headingsOffset?: number;
  renderToPdf?: boolean;
  overWriteDefaultStyles?: Partial<typeof defaultMarkdownStyles>;
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
  const styles: typeof defaultMarkdownStyles = {
    ...defaultMarkdownStyles,
    ...options.overWriteDefaultStyles,
  };

  return lexNodes.map((lexNode, i) => {
    const index = `parsed_md_${i}`;

    if (options.plain) {
      return <Fragment key={index}>{lexNode.getTextContent()}</Fragment>;
    }

    if ($isHeadingNode(lexNode)) {
      const headingOffset = options.headingsOffset ?? 0;
      const headingLevel = parseInt(lexNode.getTag().replace("h", ""), 10);
      const newHeading = Math.min(6, Math.max(1, headingLevel + headingOffset));
      const children = lexNodesToReactNodes(
        lexNode.getChildren(),
        options ?? {},
      );

      if (options.renderToPdf) {
        const headingStyle =
          styles[`h${newHeading}` as keyof typeof styles] || styles.h4;
        return (
          <Text key={index} style={headingStyle}>
            {children}
          </Text>
        );
      }

      const Tag = `h${newHeading}` as keyof JSX.IntrinsicElements;
      return <Tag key={index}>{children}</Tag>;
    }

    if ($isListNode(lexNode)) {
      const children = lexNodesToReactNodes(
        lexNode.getChildren(),
        options ?? {},
      );

      if (options.renderToPdf) {
        return (
          <View key={index} style={styles.list}>
            {children}
          </View>
        );
      }

      if (lexNode.getListType() === "number") {
        return (
          <ol key={index} start={lexNode.getStart()}>
            {children}
          </ol>
        );
      }

      return <ul key={index}>{children}</ul>;
    }

    if ($isListItemNode(lexNode)) {
      const isNestedListWrapper = (node: LexicalNode) =>
        $isListItemNode(node) &&
        node.getChildrenSize() > 0 &&
        node.getChildren().every((c) => $isListNode(c));

      if (options.renderToPdf) {
        if (isNestedListWrapper(lexNode)) {
          return (
            <View key={index} style={styles.nestedList}>
              {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
            </View>
          );
        }

        const parent = lexNode.getParent();
        const isOrdered =
          $isListNode(parent) && parent.getListType() === "number";

        const position = lexNode
          .getPreviousSiblings()
          .filter((s) => $isListItemNode(s) && !isNestedListWrapper(s)).length;
        const start = $isListNode(parent) ? parent.getStart() : 1;
        const marker = isOrdered ? `${start + position}.` : "•";

        const liChildren = lexNode.getChildren();
        const inlineChildren = liChildren.filter((c) => !$isListNode(c));
        const nestedLists = liChildren.filter((c) => $isListNode(c));

        return (
          <View key={index} style={styles.listItem} wrap={false}>
            <Text style={styles.listMarker}>{marker}</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                {lexNodesToReactNodes(inlineChildren, options ?? {})}
              </Text>
              {nestedLists.length > 0 && (
                <View style={styles.nestedList}>
                  {lexNodesToReactNodes(nestedLists, options ?? {})}
                </View>
              )}
            </View>
          </View>
        );
      }

      return (
        <li
          key={index}
          style={
            lexNode.getChildrenSize() === 1 &&
            $isListNode(lexNode.getFirstChild())
              ? { listStyleType: "none" }
              : undefined
          }
        >
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </li>
      );
    }

    if ($isLinkNode(lexNode)) {
      const url = lexNode.getURL();

      if (options.renderToPdf) {
        return (
          <Link key={index} src={url} style={styles.link}>
            {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
          </Link>
        );
      }

      return (
        <a key={index} href={url} target="_blank">
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </a>
      );
    }

    if ($isQuoteNode(lexNode)) {
      if (options.renderToPdf) {
        return (
          <View key={index} style={styles.quoteBox} wrap={false}>
            <Text style={styles.quoteText}>
              {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
            </Text>
          </View>
        );
      }

      return (
        <blockquote key={index}>
          {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
        </blockquote>
      );
    }

    if (lexNode instanceof TextNode) {
      let content: ReactNode = lexNode.getTextContent();
      const format = lexNode.getFormat();

      // NOTE: el manejo de estilos del textnode en lxical se hace por bit
      if (options.renderToPdf) {
        const textStyles: Record<string, number | string>[] = [];

        if (format & 1) {
          textStyles.push(styles.bold);
        }
        if (format & 2) {
          textStyles.push(styles.italic);
        }
        if (format & 8) {
          textStyles.push(styles.underline);
        }

        return (
          <Text key={index} style={textStyles}>
            {content}
          </Text>
        );
      }

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
      if (options.renderToPdf) {
        return (
          <Text key={index} style={styles.paragraph}>
            {lexNodesToReactNodes(lexNode.getChildren(), options ?? {})}
          </Text>
        );
      }

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
