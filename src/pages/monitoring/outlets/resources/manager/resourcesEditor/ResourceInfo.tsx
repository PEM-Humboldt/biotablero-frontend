import { resourceTypeInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/resourceTypeInfo";
import { helperInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/helperInfo";
import type { ResourceType } from "pages/monitoring/types/odataResponse";
import { parseSimpleMarkdown } from "@utils/textParser";

export function ResourceInfo({
  currentHelper,
  resourceType,
}: {
  currentHelper: string | null;
  resourceType: ResourceType;
}) {
  return (
    <div>
      <h3 className="text-primary">
        {resourceTypeInfo[resourceType.id].title}
      </h3>
      <p className="text-2xl text-primary italic border-b border-b-input pb-4">
        {resourceTypeInfo[resourceType.id].textShort}
      </p>
      <div className="sticky top-4">
        <div className="markdown-renderer [&_p]:text-base text-base">
          {currentHelper !== null && currentHelper !== "" && (
            <h4>
              <span className="block text-base italic text-primary">
                instrucciones para adjunto:
              </span>
              {helperInfo[currentHelper].title}
            </h4>
          )}
          {parseSimpleMarkdown(
            currentHelper
              ? helperInfo[currentHelper].mdText
              : resourceTypeInfo[resourceType.id].textLongMd,
            {
              headingsOffset: 3,
            },
          )}
        </div>
      </div>
    </div>
  );
}
