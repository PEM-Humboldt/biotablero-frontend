import type { ReactNode } from "react";
import React from "react";

type Token =
  | { type: "normal"; content: string }
  | { type: "link"; url: string; label: Token[] }
  | { type: "strong"; content: Token[] }
  | { type: "emphasis"; content: Token[] };

const parseRules = {
  link: {
    split: /(\[[^\]]+\]\([^)]+\))/g,
    matchRegex: /\[([^\]]+)\]\(([^)]+)\)/,
  },
  strong: {
    split: /(\*\*[^*]+\*\*|__[^_]+__)/g,
    matchRegex: /(?:\*\*|__)(.+?)(?:\*\*|__)/,
  },
  emphasis: {
    split: /(\*[^*]+\*|_[^_]+_)/g,
    matchRegex: /(?:\*|_)(.+?)(?:\*|_)/,
  },
};

function parseLineToTokens(text: string, rulesIndex = 0): Token[] {
  const ruleKeys = Object.keys(parseRules) as (keyof typeof parseRules)[];
  if (rulesIndex >= ruleKeys.length) {
    return [{ type: "normal", content: text }];
  }

  const currentRuleKey = ruleKeys[rulesIndex];
  const { split, matchRegex } = parseRules[currentRuleKey];

  return text.split(split).flatMap((part): Token[] => {
    if (!part) {
      return [];
    }

    const match = part.match(matchRegex);
    if (match) {
      if (currentRuleKey === "link") {
        return [
          {
            type: "link",
            url: match[2],
            label: parseLineToTokens(match[1], rulesIndex + 1),
          },
        ];
      }

      return [
        {
          type: currentRuleKey,
          content: parseLineToTokens(match[1], rulesIndex + 1),
        },
      ];
    }

    return parseLineToTokens(part, rulesIndex + 1);
  });
}

function renderTokens(tokens: Token[]): ReactNode {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "normal":
        return token.content;
      case "link":
        return (
          <a key={i} href={token.url} className="underline">
            {renderTokens(token.label)}
          </a>
        );
      case "strong":
        return <strong key={i}>{renderTokens(token.content)}</strong>;
      case "emphasis":
        return <em key={i}>{renderTokens(token.content)}</em>;
    }
  });
}

export function parseSimpleMarkdown(text: string): ReactNode {
  const blocks = text.split("\n\n");

  return blocks.map((block, index) => {
    if (/^[-*]\s/.test(block)) {
      const items = block.split("\n");
      return (
        <ul key={index} className="list-disc">
          {items.map((item, i) => {
            const text = item.replace(/^[-*]\s/, "");
            return <li key={i}>{renderTokens(parseLineToTokens(text))}</li>;
          })}
        </ul>
      );
    }

    if (/^\d+\.\s/.test(block)) {
      const items = block.split("\n");
      return (
        <ol key={index} className="list-decimal">
          {items.map((item, i) => {
            const text = item.replace(/^\d+\.\s/, "");
            return <li key={i}>{renderTokens(parseLineToTokens(text))}</li>;
          })}
        </ol>
      );
    }

    const lines = block.split("\n");
    return (
      <p key={index} className="mb-4">
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {renderTokens(parseLineToTokens(line))}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}
