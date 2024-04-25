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
import { useContext, useMemo, useState } from "react";
import Details from "./Details";
import SocketContext from "../../context/SocketContext";

const findRecordingById = (recordings: RecordingStats[], dbBin: number, freqBin: number) => {
  const recording = recordings[
    recordings.findIndex(
      (item) => item.dbaBin === dbBin && item.freqBin === freqBin
    )
  ];
  return recording;
};

interface DataOnlyProps {
  data: RecordingStats;
  freqBin?: never;
  dbaBin?: never;
  acceptable: boolean;
}

interface BinOnlyProps {
  data?: never;
  freqBin: number;
  dbaBin: number;
  acceptable: boolean;
}

type RecordingProps = DataOnlyProps | BinOnlyProps;

export default function Recording(props: RecordingProps) {
  const socket = useContext(SocketContext);

  const datamapBinNames = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const recordings = useAppSelector(
    (state) => state.voicemap.values.recordings
  );
  const settingsSaveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const dispatch = useAppDispatch();
  const recording = useMemo(() => {
    if (props.data) {
      return props.data;
    }
    return findRecordingById(recordings, props.dbaBin, props.freqBin);
  }, [props.data, recordings, props.dbaBin, props.freqBin]);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [confirmOpened, setConfirmOpened] = useState(false);

  // get the basic api endpoint url for recording related informations
  const get_endpoint_url = () => {
    const splittedLocation = settingsSaveLocation.split("\\");
    const filename = `${datamapBinNames.dba.length - recording.dbaBin - 1}_${recording.freqBin}`;
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
              id: `${datamapBinNames.dba[recording.dbaBin]}.${datamapBinNames.freq[recording.freqBin]}`,
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
              {datamapBinNames.freq[recording.freqBin].slice(0, -2) +
                "." +
                datamapBinNames.freq[recording.freqBin].slice(-2)}
            </Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Dezibel [db(A)]:
            </Text>
            <Text size="xs">{datamapBinNames.dba[recording.dbaBin]}</Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Q-Score:
            </Text>
            <Text size="xs">{recording.qScore}</Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Zeitstempel:
            </Text>
            <Text size="xs">{recording.timestamp}</Text>
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
          title={`Aufnahmedetails zu ${datamapBinNames.dba[recording.dbaBin]} db(A) / ${
            datamapBinNames.freq[recording.freqBin].slice(0, -2) +
            "." +
            datamapBinNames.freq[recording.freqBin].slice(-2)
          } Hz / ${recording.qScore}`}
          opened={detailsOpened}
          onClose={() => setDetailsOpened(false)}
          api_endpoint={api_endpoint}
          recordingData={recording}
        />
        {props.acceptable ? (
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
                payload: { freqBin: recording.freqBin, dbaBin: recording.dbaBin },
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
                socket.emit("remove_recording_request", {
                  freqBin: recording.freqBin,
                  dbaBin: datamapBinNames.dba.length - recording.dbaBin - 1,
                });
                dispatch({
                  type: "voicemap/REMOVE_RECORDING",
                  payload: { freqBin: recording.freqBin, dbaBin: recording.dbaBin },
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
