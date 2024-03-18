import {
  Card,
  Container,
  Image,
  Flex,
  Text,
  Button,
  Group,
} from "@mantine/core";

export default function Recording({
  freqBereich,
  dbBereich,
  qScore,
  saveLocation,
  timestamp,
}: {
  freqBereich: string;
  dbBereich: string;
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
            <Text fw={700}>Frequenzbereich [Hz]:</Text>
            <Text>{freqBereich}</Text>
          </Group>
          <Group>
            <Text fw={700}>Dezibelbereich [db(A)]:</Text>
            <Text>{dbBereich}</Text>
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
        <Button h="100%" color="red">
          Löschen
        </Button>
      </Flex>
    </Card>
  );
}
