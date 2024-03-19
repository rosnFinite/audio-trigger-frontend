import {
  Card,
  Container,
  Image,
  Flex,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { TbCheck, TbTrashX } from "react-icons/tb";

export default function Recording({
  freq,
  dba,
  qScore,
  saveLocation,
  timestamp,
}: {
  freq: string;
  dba: string;
  qScore: string;
  saveLocation: string;
  timestamp: string;
}) {
  return (
    <Card
      radius="md"
      mb={8}
      shadow="sm"
      withBorder
      h={150}
      pt={0}
      pl={0}
      pr={0}
    >
      <Flex>
        <Image src="/temp/TEST_C001H001S0002000001.jpg" h={150} w={150} />
        <Container ml={0} mt={10} h={"100%"}>
          <Group>
            <Text fw={700}>Frequenz-Bin [Hz]:</Text>
            <Text>{freq.slice(0, -2) + "." + freq.slice(-2)}</Text>
          </Group>
          <Group>
            <Text fw={700}>Dezibel-Bin [db(A)]:</Text>
            <Text>{dba}</Text>
          </Group>
          <Group>
            <Text fw={700}>Q-Score:</Text>
            <Text>{qScore}</Text>
          </Group>
          <Group>
            <Text fw={700}>Speicherort:</Text>
            <Text>{saveLocation}</Text>
          </Group>
          <Group>
            <Text fw={700}>Zeitstempel:</Text>
            {timestamp}
          </Group>
        </Container>
        <Button
          h="100%"
          color="green"
          rightSection={<TbCheck size={30} />}
          pr={25}
        />
        <Button
          h="100%"
          color="red"
          rightSection={<TbTrashX size={30} />}
          pr={25}
        />
      </Flex>
    </Card>
  );
}
