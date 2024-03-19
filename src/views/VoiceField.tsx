import NivoVoicemap from "../components/map/NivoVoicemap";
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
} from "@mantine/core";
import { TbInfoCircle, TbSwipe } from "react-icons/tb";
import { Link } from "react-router-dom";
import ControlButtonGroup from "../components/ControlButtonGroup";
import Layout from "../components/Layout/Layout";
import { SocketProp } from "../types/SocketProp.types";
import Recording from "../components/recording/Recording";
import { useAppSelector } from "../redux/hooks";
import { useMemo } from "react";
import { generateLowerBounds } from "../utils/voicemapUtils";

export default function VoiceField({ socket }: SocketProp) {
  const data = useAppSelector((state) => state.voicemap.value.data);
  const settingsDb = useAppSelector((state) => state.settings.values.db);
  const settingsFreq = useAppSelector(
    (state) => state.settings.values.frequency
  );
  const lowerBounds = useMemo(() => {
    const bounds = generateLowerBounds(settingsDb, settingsFreq);
    // we need to reverse the arrays to match the order of the heatmap (generateLowerBounds is a helper function for the heatmap)
    bounds.dba = bounds.dba.reverse();
    return bounds;
  }, [settingsDb, settingsFreq]);

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
        <NivoVoicemap socket={socket} />
        <Group gap="xs">
          <Title order={2}>Aufnahmen</Title>
          <Badge circle size="xl">
            {data.length}
          </Badge>
          <Badge circle size="xl" color="green">
            {data.length}
          </Badge>
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
        <ScrollArea
          h={450}
          type="auto"
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={1500}
        >
          {data.map((item, index) => (
            <Recording
              key={index}
              freq={lowerBounds.freq[item.freqBin]}
              dba={lowerBounds.dba[item.dbaBin]}
              qScore={item.qScore}
              saveLocation="C:/user/images/fksdjhfsd.jpg"
              timestamp={item.timestamp}
            />
          ))}
        </ScrollArea>
      </Stack>
    </Layout>
  );
}
