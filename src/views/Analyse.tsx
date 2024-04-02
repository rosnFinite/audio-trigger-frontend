import { Blockquote, Group, Stack, Title, Text, rem } from "@mantine/core";
import Layout from "../components/Layout/Layout";
import { TbFileMusic, TbInfoCircle, TbLetterX } from "react-icons/tb";
import { Dropzone } from "@mantine/dropzone";

export default function Analyse() {
  return (
    <Layout>
      <Stack h="100%">
        <Title order={2}>Audioanalyse</Title>
        <Blockquote
          color="blue"
          icon={<TbInfoCircle size={"25"} />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Über die Audioanalyse können Sie aufgenommenen Audiodaten manuell
          analysieren und bewerten. Hierzu wird die zu analysierende WAV-Datei
          hochgeladen. Im Hintergrund werden relevante Statistiken und
          Visualisierung über PRAAT erstellt und auf dieser Seite angezeigt.
        </Blockquote>
        <Blockquote
          color="red"
          icon={<TbInfoCircle size={"25"} />}
          mt="xs"
          pt={10}
          pb={10}
        >
          Noch in Entwicklung
        </Blockquote>
        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          accept={["audio/wav"]}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <TbFileMusic
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-blue-6)",
                }}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <TbLetterX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-red-6)",
                }}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <TbFileMusic
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Audiodatei hierein ziehen oder klicken zum manuellen Auswählen
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Es können beliebig viele WAV Audiodateien angehangen werden
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Stack>
    </Layout>
  );
}
