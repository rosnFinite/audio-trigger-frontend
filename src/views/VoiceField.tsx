import Voicemap from "../components/map/Voicemap";
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
  ActionIcon,
} from "@mantine/core";
import { TbInfoCircle, TbRefresh, TbSwipe } from "react-icons/tb";
import { Link } from "react-router-dom";
import ControlButtonGroup from "../components/ControlButtonGroup";
import Layout from "../components/Layout/Layout";
import { SocketProp } from "../types/SocketProp.types";
import Recording from "../components/recording/Recording";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";

interface RecordingData {
  id: number;
  freqBin: number;
  dbaBin: number;
  qScore: string;
  timestamp: string;
  accepted: boolean;
}

export default function VoiceField({ socket }: SocketProp) {
  const data = useAppSelector((state) => state.voicemap.value.data);
  const [activeRecordingTab, setActiveRecordingTab] = useState("new");
  const [reloadableSeed, setReloadableSeed] = useState(1);
  const [newRecordings, setNewRecordings] = useState<RecordingData[]>([]);
  const [acceptedRecordings, setAcceptedRecordings] = useState<RecordingData[]>(
    []
  );
  const [sortedBy, setSortedBy] = useState("timestamp");

  useEffect(() => {
    // addind random id to each item to avoid key conflicts in dynamic rendering of Recording components
    const tmp_data = data.map((item) => {
      return { ...item, id: Math.random() };
    });
    setNewRecordings(tmp_data.filter((item) => !item.accepted));
    setAcceptedRecordings(tmp_data.filter((item) => item.accepted));
  }, [data]);

  //TODO: update badge to count accepted and pending recordings
  return (
    <Layout>
      <Stack h={"100%"}>
        <Title order={2}>Stimmfeld</Title>
        <Blockquote
          color="blue"
          icon={<TbInfoCircle size={"25"} />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Über die Schaltfläche 'Patientenansicht' wird ein neuer Tab geöffnet,
          in dem die Patientenansicht angezeigt wird. Diese beinhaltet
          ausschließlich das Stimmfeld und keine weiteren Schaltflächen.
        </Blockquote>
        <Divider />
        <Center>
          <Link to="/stimmfeld/patientenansicht" target="_blank">
            <Button rightSection={<TbSwipe />}>Patientenansicht</Button>
          </Link>
        </Center>
        <ControlButtonGroup socket={socket} />
        <Voicemap socket={socket} />
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
          icon={<TbInfoCircle size={"25"} />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Hier können die vom Trigger aufgezeichneten Audio, sowie Bildaufnahmen
          analysiert und selektiert werden. Sollten Aufnahmen nicht einer
          vordefinierten Qualität entsprechen besteht hier die Möglichkeit diese
          zu entfernen und eine erneute Aufnahme dieser zu starten.
        </Blockquote>
        <Divider my="xs" />
        <SegmentedControl
          data={[
            { label: "Neu", value: "new" },
            { label: "Akzeptiert", value: "accepted" },
          ]}
          onChange={(value) => setActiveRecordingTab(value)}
        />
        <Group>
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
          <Tooltip label="Aktualisiert die dargestellten Aufnahmen, falls Visualisierung/Daten fehlen sollten.">
            <ActionIcon
              onClick={() => setReloadableSeed(reloadableSeed + 1)}
              aria-label="refresh-button"
            >
              <TbRefresh />
            </ActionIcon>
          </Tooltip>
        </Group>
        <ScrollArea
          key={reloadableSeed}
          h={450}
          type="auto"
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={1500}
        >
          {data.length === 0 ? (
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
                  socket={socket}
                  freqBin={item.freqBin}
                  dbaBin={item.dbaBin}
                  qScore={item.qScore}
                  timestamp={item.timestamp}
                  acceptable
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
                  socket={socket}
                  freqBin={item.freqBin}
                  dbaBin={item.dbaBin}
                  qScore={item.qScore}
                  timestamp={item.timestamp}
                  acceptable={false}
                />
              ))
          )}
        </ScrollArea>
      </Stack>
    </Layout>
  );
}
