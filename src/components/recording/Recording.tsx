import {
  Card,
  Image,
  Flex,
  Text,
  Button,
  Group,
  Modal,
  Alert,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { TbCheck, TbInfoCircle, TbSwipe, TbTrashX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useContext, useState } from "react";
import Details from "./Details";
import SocketContext from "../../context/SocketContext";

export default function Recording({
  freqBin,
  dbaBin,
  qScore,
  timestamp,
  acceptable = true,
}: {
  freqBin: number;
  dbaBin: number;
  qScore: string;
  timestamp: string;
  acceptable: boolean;
}) {
  const socket = useContext(SocketContext);

  const datamapBinNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const recordings = useAppSelector(
    (state) => state.voicemap.values.recordings
  );
  // find the recording data for the current dbaBin and freqBin
  const recordingData: RecordingStats =
    recordings[
      recordings.findIndex(
        (item) => item.dbaBin === dbaBin && item.freqBin === freqBin
      )
    ];
  const settingsSaveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const dispatch = useAppDispatch();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [confirmOpened, setConfirmOpened] = useState(false);

  // get the basic api endpoint url for recording related informations
  const get_endpoint_url = () => {
    const splittedLocation = settingsSaveLocation.split("\\");
    const filename = `${datamapBinNames.dba.length - dbaBin - 1}_${freqBin}`;
    const endpoint = `http://localhost:5001/api/recordings/${splittedLocation.pop()}/${filename}`;
    return endpoint;
  };
  const api_endpoint = get_endpoint_url();

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
        <Image
          src={`${api_endpoint}\\spectrogram_intensity.png`}
          h={150}
          w={150}
        />
        <Stack ml={10} align="stretch" justify="center" gap={1}>
          <Group>
            <Text size="xs" fw={700}>
              Frequenz [Hz]:
            </Text>
            <Text size="xs">
              {datamapBinNames.freq[freqBin].slice(0, -2) +
                "." +
                datamapBinNames.freq[freqBin].slice(-2)}
            </Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Dezibel [db(A)]:
            </Text>
            <Text size="xs">{datamapBinNames.dba[dbaBin]}</Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Q-Score:
            </Text>
            <Text size="xs">{qScore}</Text>
          </Group>
          <Group visibleFrom="md">
            <Text size="xs" fw={700}>
              Speicherort:
            </Text>
            <Text size="xs">{`${settingsSaveLocation}\\${
              datamapBinNames.dba.length - dbaBin - 1
            }_${freqBin}`}</Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Zeitstempel:
            </Text>
            <Text size="xs">{timestamp}</Text>
          </Group>
        </Stack>
        <ActionIcon
          mr={15}
          variant="light"
          size="xl"
          radius="lg"
          ml={"auto"}
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
          api_endpoint={api_endpoint}
          recordingData={recordingData}
        />
        {acceptable ? (
          <Button
            h="100%"
            color="green"
            rightSection={<TbCheck size={30} />}
            pr={25}
            radius={0}
            onClick={() => {
              console.log("Accepting recording");
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
                if (!socket) {
                  console.error("Socket is not initialized");
                  return;
                }
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
