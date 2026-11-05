import { useCallback, useEffect, useState } from "react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import {
  type TopicData,
  type TopicMetadata,
} from "pages/monitoring/types/topics";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  getTopicData,
  getTopicMetadata,
  getTopicsByInitiative,
} from "pages/monitoring/api/services/topics";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";
import { Button } from "@ui/shadCN/component/button";
import { ScanSearch } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { motion } from "motion/react";
import { TopicVersionCard } from "pages/monitoring/outlets/topicsAdmin/topicsList/TopicVersionCard";
import { TopicHeader } from "pages/monitoring/outlets/topicsAdmin/topicsList/TopicHeader";
import { uiText } from "pages/monitoring/outlets/topicsAdmin/layout/uiText";

export function TopicsList({
  fromInitiative,
}: {
  fromInitiative: InitiativeByLocation | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [editTopic, setEditTopic] = useState<number | null>(null);
  const [topicsMetadata, setTopicsMetadata] = useState<TopicMetadata[]>([]);
  const [selectedTopicVersion, setSelectedTopicVersion] =
    useState<TopicData | null>(null);

  useEffect(() => {
    if (!fromInitiative) {
      return;
    }

    const fetchTopicsMetadata = async () => {
      setErrors([]);
      setIsLoading(true);

      const res = await getTopicsByInitiative(fromInitiative.id);
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return [];
      }
      setTopicsMetadata(res);
    };

    void fetchTopicsMetadata();
  }, [fromInitiative]);

  const handleGetVersion = useCallback(async (topicVersionId: number) => {
    setErrors([]);
    setIsLoading(true);

    const res = await getTopicData(topicVersionId);
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      setSelectedTopicVersion(null);
      return;
    }

    setSelectedTopicVersion(res);
  }, []);

  const updateTopicMetadata = async (topicId: number) => {
    setIsLoading(true);
    setErrors([]);

    const updatedTopic = await getTopicMetadata(topicId);
    setIsLoading(false);
    if (isMonitoringAPIError(updatedTopic)) {
      setErrors(updatedTopic.data.map((err) => err.msg));
      return;
    }

    setTopicsMetadata((oldTopics) => {
      const newTopics = oldTopics.map((oldTopic) =>
        oldTopic.id === updatedTopic.id ? updatedTopic : oldTopic,
      );
      return newTopics;
    });
  };

  const handleSetTopicToEdit = useCallback(
    (topicId: number | null) => {
      setEditTopic(topicId);

      if (
        topicId !== null &&
        selectedTopicVersion &&
        selectedTopicVersion.topicId !== topicId
      ) {
        setSelectedTopicVersion(null);
      }
    },
    [selectedTopicVersion],
  );

  return (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 p-4 border border-accent rounded-lg"
      />

      {isLoading && (
        <LoadingDiv text={uiText.topicsList.loadind} className="absolute" />
      )}

      <ul
        aria-label={uiText.topicsList.listDescription.sr}
        className="space-y-4"
      >
        {topicsMetadata.map((topic) => {
          const isEditModeOn = topic.id === editTopic;

          return (
            <motion.li
              key={`topicCard_${topic.id}`}
              layout
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 25 },
              }}
              className={cn(
                "relative border border-muted rounded-lg p-4 overflow-hidden",
                isEditModeOn ? "shadow-xl border-primary" : "",
              )}
            >
              <motion.div layout="position" className="flex flex-col gap-2">
                <Button
                  onClick={() =>
                    handleSetTopicToEdit(isEditModeOn ? null : topic.id)
                  }
                  className="ml-auto"
                >
                  {isEditModeOn
                    ? "cerrar el modo de edición"
                    : "Iniciar el modo de edición"}
                </Button>

                <TopicHeader
                  topic={topic}
                  editMode={isEditModeOn}
                  onUpdateSuccess={() => updateTopicMetadata(topic.id)}
                />

                <div aria-label={uiText.topicsList.versionsListDescription.sr}>
                  {isEditModeOn
                    ? uiText.topicsList.versionsListDescriptionEdit.label
                    : uiText.topicsList.versionsListDescription.label}

                  <ul className="border-t border-t-muted py-2 flex flex-wrap gap-2">
                    {topic.versions.map((version) => {
                      const isThisVersionSelected =
                        version.id === selectedTopicVersion?.id;

                      return (
                        <li key={`topic-${topic.id}_version-${version.id}`}>
                          <Button
                            onClick={() =>
                              isThisVersionSelected
                                ? setSelectedTopicVersion(null)
                                : void handleGetVersion(version.id)
                            }
                            variant={
                              isThisVersionSelected ? "default" : "outline"
                            }
                            title={uiText.topicsList.openVersionBtn.sr(
                              version.version,
                              new Date(version.creationDate),
                            )}
                            aria-label={uiText.topicsList.openVersionBtn.sr(
                              version.version,
                              new Date(version.creationDate),
                            )}
                          >
                            <ScanSearch className="size-6" />
                            {uiText.topicsList.openVersionBtn.label(
                              version.version,
                              new Date(version.creationDate),
                            )}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {selectedTopicVersion &&
                  selectedTopicVersion.topicId === topic.id && (
                    <>
                      <TopicVersionCard
                        topicData={selectedTopicVersion}
                        editingThis={isEditModeOn}
                        onUpdateSuccess={() =>
                          handleGetVersion(selectedTopicVersion.id)
                        }
                      />

                      {isEditModeOn && (
                        <Button
                          onClick={() => handleSetTopicToEdit(null)}
                          className="ml-auto"
                        >
                          {"cerrar el modo de edición"}
                        </Button>
                      )}
                    </>
                  )}
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}
