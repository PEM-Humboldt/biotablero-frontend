import { Switch } from "@ui/shadCN/component/switch";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";

type SubmitStoryProps = {
  enabled: boolean;
  setEnabled: (set: boolean) => void;
  restricted: boolean;
  setRestricted: (set: boolean) => void;
  submitErrors: string[];
  text: {
    title: string;
    enabled: {
      ariaLabel: string;
      title: { enabled: string; disabled: string };
      sr: { enabled: string; disabled: string };
      label: { enabled: string; disabled: string };
    };
    restricted: {
      ariaLabel: string;
      title: { restricted: string; unrestricted: string };
      sr: { restricted: string; unrestricted: string };
      label: { restricted: string; unrestricted: string };
    };
    submit: { reset: string; save: string; publish: string };
  };
};

export function SubmitStory({
  enabled,
  setEnabled,
  restricted,
  setRestricted,
  submitErrors,
  text,
}: SubmitStoryProps) {
  return (
    <>
      <div className="w-full md:w-[50%] lg:w-[30%] ml-auto bg-background flex flex-col rounded-lg border border-input p-2">
        <span className="text-primary font-normal">{text.title}</span>
        <div className="flex gap-2 items-center">
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label={text.enabled.ariaLabel}
          />
          <label
            htmlFor="enabled"
            className="cursor-pointer"
            title={
              enabled ? text.enabled.title.enabled : text.enabled.title.disabled
            }
          >
            <span className="sr-only">
              {enabled ? text.enabled.sr.enabled : text.enabled.sr.disabled}
            </span>
            {enabled ? text.enabled.label.enabled : text.enabled.label.disabled}
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <Switch
            id="restricted"
            checked={restricted}
            onCheckedChange={setRestricted}
            aria-label={text.restricted.ariaLabel}
          />
          <label
            htmlFor="restricted"
            className="cursor-pointer"
            title={
              restricted
                ? text.restricted.title.restricted
                : text.restricted.title.unrestricted
            }
          >
            <span className="sr-only">
              {restricted
                ? text.restricted.sr.restricted
                : text.restricted.sr.unrestricted}
            </span>
            {restricted
              ? text.restricted.label.restricted
              : text.restricted.label.unrestricted}
          </label>
        </div>
      </div>

      <ErrorsList
        className="w-full md:w-[50%] lg:w-[30%] ml-auto bg-accent/10 border border-accent p-4 rounded-lg"
        errorItems={submitErrors}
      />

      <div className="flex justify-between">
        <Button type="reset" variant="outline_destructive">
          {text.submit.reset}
        </Button>
        <Button type="submit">
          {enabled ? text.submit.publish : text.submit.save}
        </Button>
      </div>
    </>
  );
}
