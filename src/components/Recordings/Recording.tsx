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
  Skeleton,
} from "@mantine/core";
import { TbCheck, TbInfoCircle, TbSwipe, TbTrashX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useMemo, useState } from "react";
import Details from "./Details";
import { getRestBaseUrlForRecording } from "../../utils/apiUtils";
import { useWebSocketCtx } from "../../context";

interface RecordingProps {
  data: RecordingStats;
  acceptable: boolean;
  size: number;
}

export default function Recording({ data, acceptable, size }: RecordingProps) {
  const { socket } = useWebSocketCtx();

  const voicefieldBins = useAppSelector(
    (state) => state.voicemap.values.fieldBinNames
  );
  const saveLocation = useAppSelector(
    (state) => state.settings.values.save_location
  );
  const dispatch = useAppDispatch();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [confirmOpened, setConfirmOpened] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const endpoint = useMemo(
    () =>
      getRestBaseUrlForRecording(
        saveLocation,
        voicefieldBins.dba.length - data.dbaBin - 1,
        data.freqBin
      ),
    [saveLocation, data.dbaBin, data.freqBin]
  );

  useEffect(() => {
    let retryTimeoutId: NodeJS.Timeout | null = null;

    const fetchImage = async () => {
      try {
        console.log(endpoint);
        console.log("Fetching image");
        const response = await fetch(`${endpoint}/image_grid.png`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image (404): ${response.statusText}`
          );
        }
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to fetch image:", error);
        // Retry after 1 second if an error occurs
        retryTimeoutId = setTimeout(fetchImage, 1000);
      }
    };

    if (!imageSrc) {
      fetchImage();
    }

    // Clean up the timeout when the component unmounts or the dependencies change
    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  return (
    <Card
      radius="md"
      mb={8}
      shadow="sm"
      withBorder
      h={size}
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
              id: `${voicefieldBins.dba[data.dbaBin]}.${
                voicefieldBins.freq[data.freqBin]
              }`,
              text: "Auswahl",
            },
          });
        }}
      >
        {imageSrc === null ? (
          <Skeleton height={size} w={size} />
        ) : (
          <Image src={imageSrc} h={size} w={size} />
        )}
        <Stack ml={10} align="stretch" justify="center" gap={1}>
          <Group>
            <Text size="xs" fw={700}>
              Frequenz [Hz]:
            </Text>
            <Text size="xs">
              {voicefieldBins.freq[data.freqBin].slice(0, -2) +
                "." +
                voicefieldBins.freq[data.freqBin].slice(-2)}
            </Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Dezibel [db(A)]:
            </Text>
            <Text size="xs">{voicefieldBins.dba[data.dbaBin]}</Text>
          </Group>
          <Group>
            <Text size="xs" fw={700}>
              Q-Score:
            </Text>
            <Text size="xs">{data.qScore}</Text>
          </Group>
        </Stack>
        <ActionIcon
          mr={15}
          variant="light"
          size="lg"
          radius="lg"
          ml={"auto"}
          aria-label="detail-modal"
          onClick={() => {
            setDetailsOpened(true);
          }}
        >
          <TbSwipe size="60%" />
        </ActionIcon>
        <Details
          title={`Aufnahmedetails zu ${
            voicefieldBins.dba[data.dbaBin]
          } db(A) / ${
            voicefieldBins.freq[data.freqBin].slice(0, -2) +
            "." +
            voicefieldBins.freq[data.freqBin].slice(-2)
          } Hz / ${data.qScore}`}
          opened={detailsOpened}
          onClose={() => setDetailsOpened(false)}
          api_endpoint={endpoint}
          recordingData={data}
        />
        {acceptable ? (
          <Button
            h="100%"
            w="15%"
            color="green"
            rightSection={<TbCheck size={30} />}
            pr={25}
            radius={0}
            onClick={() => {
              console.log("Accepting recording");
              dispatch({
                type: "voicemap/ACCEPT_RECORDING",
                payload: { freqBin: data.freqBin, dbaBin: data.dbaBin },
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
                  freqBin: data.freqBin,
                  dbaBin: voicefieldBins.dba.length - data.dbaBin - 1,
                });
                dispatch({
                  type: "voicemap/REMOVE_RECORDING",
                  payload: { freqBin: data.freqBin, dbaBin: data.dbaBin },
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
          w="15%"
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
