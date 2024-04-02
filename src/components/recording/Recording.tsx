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
  ActionIcon,
} from "@mantine/core";
import { TbCheck, TbInfoCircle, TbSwipe, TbTrashX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Socket } from "socket.io-client";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Details from "./Details";

export default function Recording({
  socket,
  freqBin,
  dbaBin,
  qScore,
  timestamp,
  acceptable = true,
}: {
  socket: Socket;
  freqBin: number;
  dbaBin: number;
  qScore: string;
  timestamp: string;
  acceptable: boolean;
}) {
  const datamapBinNames = useAppSelector(
    (state) => state.voicemap.value.datamapBinNames
  );
  const settingsSaveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const dispatch = useAppDispatch();
  const [path, setPath] = useState("");
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [confirmOpened, setConfirmOpened] = useState(false);

  useEffect(() => {
    // settingsSaveLocation contains complete path to local folder, for the api request we only need the last part
    const splittedLocation = settingsSaveLocation.split("\\");
    const path = `http://localhost:5001/api/recordings/${splittedLocation.pop()}/${
      datamapBinNames.dba.length - dbaBin - 1
    }_${freqBin}`;
    setPath(path);
  }, []);

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
        align="center"
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
        <Image src={`${path}\\spectrogram_intensity.png`} h={150} w={150} />
        <Container ml={0} mt={10} h={"100%"}>
          <Group>
            <Text fw={700}>Frequenz [Hz]:</Text>
            <Text>
              {datamapBinNames.freq[freqBin].slice(0, -2) +
                "." +
                datamapBinNames.freq[freqBin].slice(-2)}
            </Text>
          </Group>
          <Group>
            <Text fw={700}>Dezibel [db(A)]:</Text>
            <Text>{datamapBinNames.dba[dbaBin]}</Text>
          </Group>
          <Group>
            <Text fw={700}>Q-Score:</Text>
            <Text>{qScore}</Text>
          </Group>
          <Group>
            <Text fw={700}>Speicherort:</Text>
            <Text>{`${settingsSaveLocation}\\${
              datamapBinNames.dba.length - dbaBin - 1
            }_${freqBin}`}</Text>
          </Group>
          <Group>
            <Text fw={700}>Zeitstempel:</Text>
            {timestamp}
          </Group>
        </Container>
        <ActionIcon
          mr={15}
          variant="light"
          size="xl"
          radius="lg"
          aria-label="detail-modal"
          onClick={() => {
            setDetailsOpened(true);
          }}
        >
          <TbSwipe size={30} />
        </ActionIcon>
        <Details
          title={`Aufnahmedetails zu ${datamapBinNames.dba[dbaBin]} db(A) / ${
            datamapBinNames.freq[freqBin].slice(0, -2) +
            "." +
            datamapBinNames.freq[freqBin].slice(-2)
          } Hz / ${qScore}`}
          opened={detailsOpened}
          onClose={() => setDetailsOpened(false)}
          path={path}
        />
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
        <Modal
          opened={confirmOpened}
          onClose={() => setConfirmOpened(false)}
          centered
          title="Löschen"
        >
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
            <Button variant="light" onClick={() => setConfirmOpened(false)}>
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
                setConfirmOpened(false);
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
          onClick={() => setConfirmOpened(true)}
        />
      </Flex>
    </Card>
  );
}
