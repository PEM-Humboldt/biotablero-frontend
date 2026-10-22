import { LinkIcon, MailIcon } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";
import { TagInInitiative } from "pages/monitoring/types/odataResponse";
import { cn } from "@ui/shadCN/lib/utils";

export function TagsAndContact() {
  const { initiativeInfo } = useInitiativeCTX();

  const ecosystems =
    initiativeInfo?.tags
      .filter((t) => t.tag.category.name === "Ecosystem")
      .map((t) => t.tag.name) ?? [];

  const politicalContextTags =
    initiativeInfo?.tags.filter(
      (t) =>
        t.tag.category.name === "PoliticalContext" ||
        t.tag.category.name === "SocialContext",
    ) ?? [];

  return !initiativeInfo ? null : (
    <div className="flex-1 space-y-4 px-2 lg:px-4 [&_h4]:m-0 self-end">
      {initiativeInfo.contacts?.map((contact) => (
        <Button
          key={`contactInfo_${contact.email}`}
          variant="outline"
          className="p-0"
          asChild
          title={uiText.profile.tagsAndContact.mailBtn.title}
          aria-label={uiText.profile.tagsAndContact.mailBtn.sr}
        >
          <a href={`mailto:${contact.email}`}>
            <MailIcon />
            {uiText.profile.tagsAndContact.mailBtn.label}
          </a>
        </Button>
      ))}

      {ecosystems.length > 0 && (
        <div>
          <h4>{uiText.profile.tagsAndContact.ecosystemsTitle}</h4>
          <TagsRender
            tags={ecosystems}
            className="[&_li]:bg-green-100 [&_li]:text-green-800 font-normal"
          />
        </div>
      )}

      {politicalContextTags.length > 0 && (
        <div>
          <h4>{uiText.profile.tagsAndContact.politicalContextTitle}</h4>
          <ul>
            {politicalContextTags.map((t) => (
              <li key={`politicalContextTag_${t.tag.id}`}>
                {t.tag?.url ? (
                  <a
                    href={t.tag.url}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-sm whitespace-nowrap hover:text-accent hover:underline"
                  >
                    <LinkIcon className="size-3 text-accent" />
                    <SocialTag tagComplete={t} />
                  </a>
                ) : (
                  <SocialTag tagComplete={t} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SocialTag({ tagComplete }: { tagComplete: TagInInitiative }) {
  const tagInfo = tagComplete.tag;
  const classes = "px-1.5 py-0.5 text-sm whitespace-nowrap";

  return tagInfo.fullName ? (
    <abbr title={tagInfo.fullName} className={classes}>
      {tagInfo.name}
    </abbr>
  ) : (
    <span className={classes}>{tagInfo.name}</span>
  );
}
