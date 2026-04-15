export const inputTheme = {
  paragraph: "text-lg leading-relaxed text-foreground mb-4 last:mb-0",
  quote:
    "border-l-4 border-primary px-4 py-1 my-4 ml-16 italic text-primary font-normal bg-muted max-w-[50ch] rounded-r-sm",
  heading: {
    h1: "text-5xl font-bold mt-8 mb-4",
    h2: "text-4xl font-bold mt-6 mb-3",
    h3: "text-3xl font-normal mt-5 mb-2",
    h4: "text-2xl font-normal mt-4 mb-2",
    h5: "text-xl font-bold mt-4 mb-2",
    h6: "text-xl font-bold mt-4 mb-2",
  },
  list: {
    ul: "list-disc ml-6 mb-2 space-y-1 editor-list-ul",
    ol: "list-decimal ml-6 mb-2 space-y-1 editor-list-ol",
    listitem: "mb-1 relative editor-listItem",
    nested: {
      listitem: "list-none ml-4 editor-nested-listitem",
    },
  },
  link: "text-accent underline transition-colors font-normal hover:text-primary",
  text: {
    bold: "font-normal text-foreground",
    italic: "italic",
  },
};
