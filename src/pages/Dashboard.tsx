import {
  Badge,
  Blockquote,
  Button,
  Center,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Title,
  Text,
  Tooltip,
  SegmentedControl,
  NativeSelect,
  Slider,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { TbInfoCircle, TbRefresh, TbSwipe } from "react-icons/tb";
import { Link } from "react-router-dom";
import ControlButtonGroup from "../components/controls/ControlButtonGroup";
import Layout from "../components/Layout/Layout";
import Recording from "../components/recording/Recording";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import VoiceField from "../components/field/VoiceField";

interface ReloadableRecordingStats extends RecordingStats {
  id: number;
}

export default function Dashboard() {
  const recordings = useAppSelector(
    (state) => state.voicemap.values.recordings
  );
  const patient = useAppSelector((state) => state.settings.values.patient);
  const saveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const [activeRecordingTab, setActiveRecordingTab] = useState("new");
  const [reloadableSeed, setReloadableSeed] = useState(1);
  const [newRecordings, setNewRecordings] = useState<
    ReloadableRecordingStats[]
  >([]);
  const [acceptedRecordings, setAcceptedRecordings] = useState<
    ReloadableRecordingStats[]
  >([]);
  const [sortedBy, setSortedBy] = useState("timestamp");
  const [recordingSize, setRecordingSize] = useState(150);

  useEffect(() => {
    // addind random id to each item to avoid key conflicts in dynamic rendering of Recording components
    const tmp_data = recordings.map((item) => {
      return { ...item, id: Math.random() };
    });
    setNewRecordings(tmp_data.filter((item) => !item.accepted));
    setAcceptedRecordings(tmp_data.filter((item) => item.accepted));
  }, [recordings]);

  return (
    <Layout>
      <Stack h={"100%"} gap="xs">
        <Title order={2}>Stimmfeld</Title>
        <Text size="xl">
          Patient:{" "}
          {patient !== "" ? (
            <Text span c="blue" inherit>
              {patient}
            </Text>
          ) : (
            <Text span c="red" inherit>
              Kein Name angegeben
            </Text>
          )}
        </Text>
        <Text mt={-15}>
          Aufnahme:{" "}
          <Text span c="blue" inherit>
            {saveLocation.split("\\").pop()}
          </Text>
        </Text>
        <Divider />
        <ControlButtonGroup />
        <Link to="/dashboard/patient" target="_blank">
          <Tooltip label="Öffnet Ansicht für den Patienten in neuen Tab">
            <Button rightSection={<TbSwipe />} ml={15} mb={-10} size="xs">
              Patientenansicht
            </Button>
          </Tooltip>
        </Link>
        <VoiceField />
        <Group gap="xs">
          <Title order={2}>Aufnahmen</Title>
          <Tooltip label="Anzahl ausstehender Aufnahmen">
            <Badge circle size="xl">
              {newRecordings.length}
            </Badge>
          </Tooltip>
          <Tooltip label="Anzahl akzeptierter Aufnahmen">
            <Badge circle size="xl" color="green">
              {acceptedRecordings.length}
            </Badge>
          </Tooltip>
        </Group>
        <Blockquote
          color="blue"
          iconSize={20}
          icon={<TbInfoCircle size="20px" />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Hier können die vom Trigger aufgezeichneten Audio, sowie Bildaufnahmen
          analysiert und selektiert werden. Sollten Aufnahmen nicht einer
          vordefinierten Qualität entsprechen besteht hier die Möglichkeit diese
          zu entfernen und für eine neue Aufnahme freizugeben.
        </Blockquote>
        <Divider my="xs" />
        <SegmentedControl
          data={[
            { label: "Neu", value: "new" },
            { label: "Akzeptiert", value: "accepted" },
          ]}
          onChange={(value) => setActiveRecordingTab(value)}
        />
        <Grid grow align="flex-end">
          <Grid.Col span={{ base: 11, md: 5 }}>
            <Text>Sortieren nach:</Text>
            <NativeSelect
              value={sortedBy}
              onChange={(event) => setSortedBy(event.currentTarget.value)}
              data={[
                { label: "Zeitstempel", value: "timestamp" },
                { label: "Frequenz", value: "freqBin" },
                { label: "Dezibel", value: "dbaBin" },
                { label: "Q-Score", value: "qScore" },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 1 }}>
            <Center>
              <Tooltip label="Aktualisiert die dargestellten Aufnahmen, falls Visualisierung/Daten fehlen sollten.">
                <ActionIcon
                  onClick={() => setReloadableSeed(reloadableSeed + 1)}
                  aria-label="refresh-button"
                  mb={3}
                >
                  <TbRefresh />
                </ActionIcon>
              </Tooltip>
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text>Darstellungsgröße:</Text>
            <Slider
              defaultValue={150}
              min={50}
              max={750}
              mb={20}
              pr={25}
              marks={[
                { value: 50, label: "50px" },
                { value: 250, label: "250px" },
                { value: 500, label: "500px" },
                { value: 750, label: "750px" },
              ]}
              label={(value) => `${value}px`}
              onChange={(value) => setRecordingSize(value)}
            />
          </Grid.Col>
        </Grid>
        <ScrollArea
          key={reloadableSeed}
          h={750}
          type="auto"
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={1500}
        >
          {recordings.length === 0 ? (
            <Center>
              <Text fw={700}>Noch keine Aufnahmen vorhanden.</Text>
            </Center>
          ) : activeRecordingTab === "new" ? (
            newRecordings
              .sort((a, b) => {
                if (
                  a[sortedBy as keyof typeof a] < b[sortedBy as keyof typeof b]
                ) {
                  return -1;
                }
                if (
                  a[sortedBy as keyof typeof a] > b[sortedBy as keyof typeof b]
                ) {
                  return 1;
                }
                return 0;
              })
              .map((item) => (
                <Recording
                  key={item.id}
                  data={item}
                  acceptable={true}
                  size={recordingSize}
                />
              ))
          ) : (
            acceptedRecordings
              .sort((a, b) => {
                if (
                  a[sortedBy as keyof typeof a] < b[sortedBy as keyof typeof b]
                ) {
                  return -1;
                }
                if (
                  a[sortedBy as keyof typeof a] > b[sortedBy as keyof typeof b]
                ) {
                  return 1;
                }
                return 0;
              })
              .map((item) => (
                <Recording
                  key={item.id}
                  data={item}
                  acceptable={false}
                  size={recordingSize}
                />
              ))
          )}
        </ScrollArea>
      </Stack>
    </Layout>
  );
}
