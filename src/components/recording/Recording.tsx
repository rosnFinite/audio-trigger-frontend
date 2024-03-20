import {
  Card,
  Container,
  Image,
  Flex,
  Text,
  Button,
  Group,
  Modal,
  Alert,
} from "@mantine/core";
import { TbCheck, TbInfoCircle, TbTrashX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Socket } from "socket.io-client";
import { useDisclosure } from "@mantine/hooks";

export default function Recording({
  socket,
  freqBin,
  dbaBin,
  qScore,
  saveLocation,
  timestamp,
  acceptable = true,
}: {
  socket: Socket;
  freqBin: number;
  dbaBin: number;
  qScore: string;
  saveLocation: string;
  timestamp: string;
  acceptable: boolean;
}) {
  const datamapBinNames = useAppSelector(
    (state) => state.voicemap.value.datamapBinNames
  );
  const dispatch = useAppDispatch();
  const [opened, { open, close }] = useDisclosure(false);

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
      <Flex
        onClick={() => {
          dispatch({
            type: "voicemap/SET_ANNOTATION",
            payload: {
              id: `${datamapBinNames.dba[dbaBin]}.${datamapBinNames.freq[freqBin]}`,
              text: "Auswahl",
            },
          });
        }}
      >
        <Image src="/temp/TEST_C001H001S0002000001.jpg" h={150} w={150} />
        <Container ml={0} mt={10} h={"100%"}>
          <Group>
            <Text fw={700}>Frequenz-Bin [Hz]:</Text>
            <Text>
              {datamapBinNames.freq[freqBin].slice(0, -2) +
                "." +
                datamapBinNames.freq[freqBin].slice(-2)}
            </Text>
          </Group>
          <Group>
            <Text fw={700}>Dezibel-Bin [db(A)]:</Text>
            <Text>{datamapBinNames.dba[dbaBin]}</Text>
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
        {acceptable ? (
          <Button
            h="100%"
            color="green"
            rightSection={<TbCheck size={30} />}
            pr={25}
            radius={0}
            onClick={() => {
              dispatch({
                type: "voicemap/ACCEPT_RECORDING",
                payload: { freqBin: freqBin, dbaBin: dbaBin },
              });
            }}
          />
        ) : (
          <></>
        )}
        <Modal opened={opened} onClose={close} centered title="Löschen">
          <Alert
            variant="light"
            color="red"
            title="Soll die Aufnahme wirklisch gelöscht werden?"
            icon={<TbInfoCircle size={25} />}
          >
            Diese Aktion wird die ausgewählte Aufnahme dauerhaft entfernen und
            das Stimmfeld aktualisieren.
          </Alert>
          <Group mt={15} grow>
            <Button variant="light" onClick={close}>
              Abbrechen
            </Button>
            <Button
              color="red"
              onClick={() => {
                socket.emit("removeRecording", {
                  freqBin: freqBin,
                  dbaBin: datamapBinNames.dba.length - dbaBin - 1,
                });
                dispatch({
                  type: "voicemap/REMOVE_RECORDING",
                  payload: { freqBin: freqBin, dbaBin: dbaBin },
                });
                close();
              }}
            >
              Löschen
            </Button>
          </Group>
        </Modal>
        <Button
          h="100%"
          color="red"
          rightSection={<TbTrashX size={30} />}
          pr={25}
          radius={0}
          onClick={open}
        />
      </Flex>
    </Card>
  );
}
