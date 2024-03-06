import { Blockquote, Stack, Title } from "@mantine/core";
import Layout from "../components/Layout/Layout";
import { TbInfoCircle } from "react-icons/tb";

export default function Recordings() {
  return (
    <Layout>
      <Stack h={"100%"}>
        <Title order={2}>
          Aufnahmen
        </Title>
        <Blockquote color='blue' icon={<TbInfoCircle size={"25"}/>} mt="xs" pt={10} pb={10}>
          Hier können die vom Trigger aufgezeichneten Audio, sowie Bildaufnahmen analysiert und selektiert werden. Sollten Aufnahmen nicht
          einer vordefinierten Qualität entsprechen besteht hier die Möglichkeit diese zu entfernen und eine erneute Aufnahme dieser zu starten.
        </Blockquote>
      </Stack>
    </Layout>
  );
}