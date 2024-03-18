import NivoVoicemap from "../components/map/NivoVoicemap";
import {
  Blockquote,
  Button,
  Center,
  Divider,
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

export default function VoiceField({ socket }: SocketProp) {
  return (
    <Layout>
      <Stack h={"100%"}>
        <Title order={2}>Stimmfeld</Title>
        <Divider my="xs" />
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
        <Center>
          <Link to="/stimmfeld/patientenansicht" target="_blank">
            <Button rightSection={<TbSwipe />}>Patientenansicht</Button>
          </Link>
        </Center>
        <ControlButtonGroup socket={socket} />
        <NivoVoicemap socket={socket} />
        <Title order={2}>Aufnahmen</Title>
        <Divider my="xs" />
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
        <ScrollArea
          h={450}
          type="auto"
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={1500}
        >
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
          <Recording
            freqBereich="113.66-146.33"
            dbBereich="45-50"
            qScore="26.34"
            saveLocation="C:/user/images/fksdjhfsd.jpg"
            timestamp="2024-03-17 14:22:12"
          />
        </ScrollArea>
      </Stack>
    </Layout>
  );
}
