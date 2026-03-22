import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { Button } from "@ui/shadCN/component/button";
import {
  Eye,
  EyeClosed,
  LockKeyhole,
  LockKeyholeOpen,
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

export function ManageTS() {
  const {
    storys,
    storysAmount,
    currentPage,
    setCurrentPage,
    updateStorys,
    setStorysSearchParams,
  } = useTerritoryStorysCTX();
  const { userStateInInitiative } = useInitiativeCTX();
  const { user } = useUserCTX();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (userStateInInitiative === UserStateInInitiative.USER_PARTICIPANT) {
      setStorysSearchParams((oldParams) => ({ ...oldParams, filter: "" }));
    }
  }, [setStorysSearchParams, userStateInInitiative]);

  const handleEdit = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const handleRestricted = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const handleEnable = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const handleFeatured = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const isAdmin = userStateInInitiative === UserStateInInitiative.USER_LEADER;

  return (
    <div className="p-4 pt-0 space-y-3">
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
                    <div className="font-normal mr-4 capitalize">
                      {story.title}
                    </div>
                    <div className="font-light">Editando...</div>
                  </>
                ) : (
                  <>
                    <div className="font-normal mr-4 capitalize">
                      {story.title}
                    </div>
                    <div className="font-light">
                      escrito por {story.authorUserName} el{" "}
                      {new Date(story.creationDate).toLocaleDateString()}
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
                  onClick={() => handleEnable(story.id)}
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
                  condition={story.enabled && userAuthorized}
                  enabled={story.restricted}
                  onClick={() => handleRestricted(story.id)}
                  text={{
                    disable: {
                      sr: "Marcar como público",
                      title: "Marcar como público",
                      label: "",
                      icon: LockKeyhole,
                    },
                    enable: {
                      sr: "Marcar como privado",
                      title: "Marcar como privado",
                      label: "",
                      icon: LockKeyholeOpen,
                    },
                  }}
                />

                <ConditionalButtonSwitch
                  condition={story.enabled && isAdmin}
                  enabled={story.featuredContent}
                  onClick={() => handleFeatured(story.id)}
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
                    void updateStorys();
                    setEditingId(null);
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
