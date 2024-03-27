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
} from "@mantine/core";
import { TbInfoCircle, TbSwipe } from "react-icons/tb";
import { Link } from "react-router-dom";
import ControlButtonGroup from "../components/ControlButtonGroup";
import Layout from "../components/Layout/Layout";
import { SocketProp } from "../types/SocketProp.types";
import Recording from "../components/recording/Recording";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useMemo, useState } from "react";

export default function VoiceField({ socket }: SocketProp) {
  const data = useAppSelector((state) => state.voicemap.value.data);
  const [activeRecordingTab, setActiveRecordingTab] = useState("new");
  const [newRecordings, setNewRecordings] = useState(data);
  const [acceptedRecordings, setAcceptedRecordings] = useState(data);
  const [sortedBy, setSortedBy] = useState("timestamp");

  useEffect(() => {
    setNewRecordings(data.filter((item) => !item.accepted));
    setAcceptedRecordings(data.filter((item) => item.accepted));
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
        <Divider my="xs" />
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
        </Group>
        <ScrollArea
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
              .map((item, index) => (
                <Recording
                  key={index}
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
              .map((item, index) => (
                <Recording
                  key={index}
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
