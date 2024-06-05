import {
  Divider,
  Group,
  NativeSelect,
  ScrollArea,
  Stack,
  Title,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Logs() {
  const [logs, setLogs] = useState("");
  const [selectedLog, setSelectedLog] = useState("server");
  const [reloadableSeed, setReloadableSeed] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/logs/${selectedLog}`
        );
        setLogs(response.data.text_content);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    setLoading(true);
    // setup interval to fetch logs
    const intervalTimer = setInterval(fetchLogs, 1000);
    setReloadableSeed(reloadableSeed + 1); // trigger re-render to update ScrollArea content (key changed)

    // function to clean up effect when component unmounts
    return () => clearInterval(intervalTimer);
  }, [selectedLog]); // empty dependency array to run when mounted

  return (
    <Layout>
      <Stack h="100%">
        <Title order={2}>Logs</Title>
        <Divider />
        <Group align="flex-end">
          <NativeSelect
            label="Log-Datei"
            description="Auswahl der anzuzeigenden Log-Datei. Aufgeteilt in Logs der einzelnen Backendkomponenten."
            value={selectedLog}
            onChange={(event) => setSelectedLog(event.currentTarget.value)}
            data={["server", "client"]}
          />
        </Group>
        {loading ? (
          <Center mt="30vh">
            <Loader size="xl" />
          </Center>
        ) : (
          <>
            <ScrollArea
              key={reloadableSeed}
              h="100%"
              type="auto"
              offsetScrollbars
              scrollbarSize={8}
              scrollHideDelay={1500}
            >
              <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
                {logs}
              </Text>
            </ScrollArea>
          </>
        )}
      </Stack>
    </Layout>
  );
}
