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

  const handlePublic = (storyId: number | null) => {
    setEditingId(editingId === storyId ? null : storyId);
  };

  const handleRestricted = (storyId: number | null) => {
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
            key={story.id}
            className={cn(
              "rounded-lg overflow-hidden",
              story.enabled
                ? "bg-muted hover:bg-primary"
                : "bg-red-50 hover:bg-accent",
              editingId === story.id ? "shadow-lg border border-input" : "",
            )}
            data-state={editingId ? true : false}
          >
            <div className="px-4 py-2 flex items-center justify-between text-base">
              <div className="text-primary hover:text-background">
                {editingId === story.id ? (
                  <div>Editando</div>
                ) : (
                  <>
                    <span className="font-normal mr-4">{story.title}</span>
                    <span className="font-light"> escrito por: </span>
                    <span className="font-normal">{story.authorUserName}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1">
                {story.enabled && userAuthorized && (
                  <Button
                    variant="ghost-clean"
                    size="icon"
                    className="hover:text-background"
                    onClick={() => handleEdit(story.id)}
                  >
                    {editingId === story.id ? <PencilOff /> : <Pencil />}
                  </Button>
                )}

                {userAuthorized && (
                  <Button
                    variant="ghost-clean"
                    size="icon"
                    className="hover:text-background"
                    onClick={() => handleRestricted(story.id)}
                  >
                    {story.restricted ? <LockKeyhole /> : <LockKeyholeOpen />}
                  </Button>
                )}

                {userAuthorized && (
                  <Button
                    variant="ghost-clean"
                    size="icon"
                    className="hover:text-background"
                    onClick={() => handlePublic(story.id)}
                  >
                    {story.enabled ? <Eye /> : <EyeClosed />}
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleFeatured(story.id)}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        story.featuredContent ? "fill-accent" : "",
                      )}
                    />
                  </Button>
                )}
              </div>
            </div>

            {editingId === story.id && (
              <div className="bg-muted">
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
