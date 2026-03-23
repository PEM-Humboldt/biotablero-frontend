import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { Button } from "@ui/shadCN/component/button";
import {
  Eye,
  EyeClosed,
  Pencil,
  Star,
  PencilOff,
  type LucideIcon,
  StarOff,
} from "lucide-react";
import { CreateEditTSForm } from "pages/monitoring/outlets/initiatives/territoryStories/CreateEditTSForm";
import { useEffect, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { useUserCTX } from "@hooks/UserContext";
import { TablePager } from "@composites/TablePager";
import { TERRITORY_STORIES_PER_PAGE } from "@config/monitoring";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  disableTerritoryStory,
  enableTerritoryStory,
  setFeaturedStory,
} from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function ManageTS() {
  const {
    storys,
    storysAmount,
    currentPage,
    setCurrentPage,
    updateStorys,
    setStorysSearchParams,
    isLoading,
    errors,
  } = useTerritoryStorysCTX();
  const { userStateInInitiative } = useInitiativeCTX();
  const { user } = useUserCTX();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [manageErrors, setManageErrors] = useState<string[]>([]);

  useEffect(() => {
    if (userStateInInitiative === UserStateInInitiative.USER_PARTICIPANT) {
      setStorysSearchParams((oldParams) => ({ ...oldParams, filter: "" }));
    }
  }, [setStorysSearchParams, userStateInInitiative]);

  const handleEdit = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const handleEnable = async (storyId: number, isEnabled: boolean) => {
    const res = isEnabled
      ? await disableTerritoryStory(storyId)
      : await enableTerritoryStory(storyId);

    if (isMonitoringAPIError(res)) {
      setManageErrors(res.data.map((err) => err.msg));
    }

    await updateStorys();
  };

  const handleFeatured = async (storyId: number) => {
    const res = await setFeaturedStory(storyId);

    if (isMonitoringAPIError(res)) {
      setManageErrors(res.data.map((err) => err.msg));
    }

    await updateStorys();
  };

  const isAdmin = userStateInInitiative === UserStateInInitiative.USER_LEADER;

  return isLoading ? (
    <div className="bg-primary/10 p-8 mx-4 rounded-lg border border-primary text-4xl text-primary text-center">
      Cargando...
    </div>
  ) : (
    <div className="p-4 pt-0 space-y-3">
      <ErrorsList
        errorItems={[...errors, ...manageErrors]}
        className="bg-accent/10 p-8 rounded-lg border border-accent"
      />

      {storys.map((story) => {
        const userAuthorized =
          isAdmin || story.authorUserName === user?.username;

        return (
          <div
            key={`${story.id}_${story.title}`}
            className={cn(
              editingId === story.id
                ? "shadow-lg rounded-lg overflow-hidden outline outline-primary/20"
                : "",
            )}
          >
            <div
              className={cn(
                "flex gap-2 justify-between px-4 py-2 rounded-lg overflow-hidden",
                "bg-muted text-primary hover:bg-background hover:outline hover:outline-primary",
                !story.enabled &&
                  "bg-red-50 outline outline-accent hover:outline-accent",
                editingId === story.id
                  ? "rounded-b-none bg-primary/20 hover:bg-primary/20 hover:outline-none border-b border-b-primary/20"
                  : "",
              )}
            >
              <div className="">
                {editingId === story.id ? (
                  <>
                    <div className="font-normal text-lg mr-4 capitalize">
                      {story.title}
                    </div>
                    <div className="font-light">Editando...</div>
                  </>
                ) : (
                  <>
                    <div className="font-normal text-lg mr-4 capitalize">
                      {story.title}
                    </div>
                    <div className="font-light">
                      Por{" "}
                      <span className="font-normal">
                        {story.authorUserName},{" "}
                      </span>
                      <time
                        dateTime={new Date(
                          story.creationDate,
                        ).toLocaleDateString()}
                      >
                        {new Date(story.creationDate).toLocaleDateString()}
                      </time>
                      {story.keywords !== undefined && (
                        <ul className="inline-flex gap-2 ml-2">
                          {story.keywords.split(",").map((kw) => (
                            <li
                              key={`kw_${kw}`}
                              className="bg-background text-sm border border-primary/30 px-2 rounded-full"
                            >
                              {kw}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1">
                {!story.enabled && (
                  <span className="font-normal">Relato no publicado</span>
                )}
                <ConditionalButtonSwitch
                  condition={story.enabled && userAuthorized}
                  enabled={editingId === story.id}
                  onClick={() => handleEdit(story.id)}
                  text={{
                    disable: {
                      sr: "Cancelar edición",
                      title: "Cancelar edición",
                      label: "",
                      icon: PencilOff,
                    },
                    enable: {
                      sr: "Editar relato",
                      title: "Editar relato",
                      label: "",
                      icon: Pencil,
                    },
                  }}
                />

                <ConditionalButtonSwitch
                  condition={userAuthorized}
                  enabled={story.enabled}
                  onClick={() => void handleEnable(story.id, story.enabled)}
                  text={{
                    disable: {
                      sr: "Ocultar relato",
                      title: "Ocultar relato",
                      label: "",
                      icon: Eye,
                    },
                    enable: {
                      sr: "Publicar relato",
                      title: "Publicar relato",
                      label: "",
                      icon: EyeClosed,
                    },
                  }}
                />

                <ConditionalButtonSwitch
                  condition={story.enabled && isAdmin}
                  enabled={story.featuredContent}
                  onClick={() => void handleFeatured(story.id)}
                  text={{
                    disable: {
                      sr: "Quitar como destacado",
                      title: "Quitar como destacado",
                      label: "",
                      icon: StarOff,
                    },
                    enable: {
                      sr: "Marcar como relato destacado",
                      title: "Marcar como relato destacado",
                      label: "",
                      icon: Star,
                    },
                  }}
                />
              </div>
            </div>

            {editingId === story.id && (
              <div className="bg-grey-form">
                <CreateEditTSForm
                  territoryStoryId={story.id}
                  onEditSuccess={() => {
                    setEditingId(null);
                    void updateStorys();
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <TablePager
        currentPage={currentPage}
        recordsAvailable={storysAmount}
        onPageChange={setCurrentPage}
        recordsPerPage={TERRITORY_STORIES_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}

function ConditionalButtonSwitch({
  condition = true,
  enabled,
  onClick,
  text,
  className = "",
}: {
  condition?: boolean;
  enabled: boolean;
  onClick: () => void;
  text: {
    enable: { sr: string; label: string; title: string; icon: LucideIcon };
    disable: { sr: string; label: string; title: string; icon: LucideIcon };
  };
  className?: string;
}) {
  const texts = text[enabled ? "disable" : "enable"];
  const Icon = texts.icon;

  return (
    condition && (
      <Button
        variant="ghost"
        size={texts.label !== "" ? "default" : "icon"}
        onClick={onClick}
        title={texts.title}
        className={className}
      >
        <span className="sr-only">{texts.sr}</span>
        <span aria-hidden="true">
          {texts.label}
          <Icon />
        </span>
      </Button>
    )
  );
}
