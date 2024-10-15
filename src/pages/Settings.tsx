import React, { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import {
  Accordion,
  Button,
  Divider,
  Group,
  Stack,
  Title,
  TextInput,
  Alert,
  Tooltip,
} from "@mantine/core";
import { TbArrowBackUp, TbCheck } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { notifications } from "@mantine/notifications";
import Layout from "../components/layout/Layout";
import { generateEmptyGrid } from "../utils/stateUtils";
import { useWebSocketCtx } from "../context";
import {
  AudioSettingsPanel,
  CalibrationSettingsPanel,
  TriggerSettingsPanel,
} from "../components/panels";
import ConfirmationModal from "../components/modals/Confirmation";
import { Socket } from "socket.io-client";

function emitSettings(socket: Socket, settings: SettingsState) {
  if (!socket) {
    console.error("Socket is not initialized");
    return;
  }
  console.log("Emitting settings_update event", settings);
  socket.emit("settings_update_request", settings);
}

export default function Settings() {
  const { socket } = useWebSocketCtx();
  const [patientError, setPatientError] = useState("");
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const [settings, setSettings] = useState(
    useAppSelector((state) => state.settings.values)
  );
  const [patient, setPatient] = useState(settings.patient);
  const status = useAppSelector((state) => state.settings.values.status);
  const stateSettings = useAppSelector((state) => state.settings.values);
  const dispatch = useAppDispatch();

  const handlePatientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    // Update the patient state with the input value
    setPatient(event.currentTarget.value);
    // Check if the input value contains only alphanumeric characters, including umlauts and the sharp s
    const isValid = /^[a-zA-Z0-9äöüÄÖÜß]*$/.test(value);
    // Update the settings state and error message based on input validity
    if (isValid) {
      setSettings({ ...settings, patient: value });
      setPatientError("");
    } else {
      setPatientError(
        "Der Patientenname darf nur Buchstaben und Zahlen enthalten."
      );
    }
  };

  // update internal settings state when audio client emitted a statusChanged event
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    const settingsUpdateHandler = (data: any) => {
      dispatch({ type: "settings/UPDATE_SETTINGS", payload: data });
      // generate a new empty grid based on the updated settings
      dispatch({
        type: "voicemap/SET_DATAMAP",
        payload: generateEmptyGrid(
          {
            lower: data["db"]["lower"],
            upper: data["db"]["upper"],
            steps: data["db"]["steps"],
          },
          {
            lower: data["frequency"]["lower"],
            upper: data["frequency"]["upper"],
            steps: data["frequency"]["steps"],
          }
        ),
      });
      // update the color settings for 'score' based on the new min_score
      dispatch({
        type: "voicemap/SET_COLOR",
        payload: {
          stat: "score",
          color: {
            min: data["min_score"],
            max: 1,
            type: "diverging",
            scheme: "blues",
          },
        },
      });
      setSettings(data);
      setPatient(data.patient);
      notifications.show({
        title: "Neue Instanz gestartet",
        message: "Die Einstellungen wurden erforlgreich angewendet.",
        color: "green",
        autoClose: 2000,
        icon: <TbCheck size={"20"} />,
      });
    };
    const statusUpdateHandler = (changedStatus: any) => {
      dispatch({ type: "settings/UPDATE_STATUS", payload: changedStatus });
    };

    socket.on("settings_update_complete", settingsUpdateHandler);
    socket.on("status_update_complete", statusUpdateHandler);

    return () => {
      socket.off("settings_update_complete", settingsUpdateHandler);
      socket.off("status_update_complete", statusUpdateHandler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <Stack h="100%">
        <Title order={2}>Einstellungen</Title>
        {status !== "offline" &&
        JSON.stringify(settings) === JSON.stringify(stateSettings) ? (
          <Alert color="green" icon={null} mt={0} pt={10} pb={10} w="270px">
            Einstellungen des aktuellen Prozesses.
          </Alert>
        ) : status === "offline" ? null : (
          <Alert color="red" icon={null} mt={0} pt={10} pb={10} w="270px">
            Einstellung noch nicht angewendet.
          </Alert>
        )}
        <Divider />
        <TextInput
          label="Patient"
          description="Messungen werden gespeichert unter <patientenname>_<date>_<time>"
          placeholder="Patientenname"
          value={patient}
          onChange={handlePatientChange}
          error={patientError}
        />

        <Accordion multiple defaultValue={["Audio"]} variant="separated">
          <AudioSettingsPanel settings={settings} setSettings={setSettings} />
          <CalibrationSettingsPanel
            settings={settings}
            setSettings={setSettings}
          />
          <TriggerSettingsPanel settings={settings} setSettings={setSettings} />
        </Accordion>
        <Group justify="center">
          <Button
            color="green"
            disabled={
              JSON.stringify(settings) === JSON.stringify(stateSettings)
            }
            rightSection={<TbCheck size={"20"} />}
            onClick={() => {
              if (
                status !== "offline" &&
                JSON.stringify(settings) !== JSON.stringify(stateSettings)
              ) {
                setConfirmationModalOpened(true);
              }
              if (
                status === "offline" &&
                JSON.stringify(settings) !== JSON.stringify(stateSettings)
              ) {
                emitSettings(socket, settings);
              }
            }}
          >
            Speichern
          </Button>
          <Tooltip label="Setzt">
            <Button
              color="red"
              disabled={
                JSON.stringify(settings) === JSON.stringify(stateSettings)
              }
              rightSection={<TbArrowBackUp size={"20"} />}
              onClick={() => {
                setSettings(stateSettings);
                let message =
                  "Auf Einstellungen des aktuellen Prozesses zurückgesetzt.";
                if (status === "offline") {
                  message = "Einstellungen auf Standardwerte zurückgesetzt.";
                }
                notifications.show({
                  withCloseButton: true,
                  title: "Einstellungen zurückgesetzt",
                  message: message,
                  color: "green",
                  autoClose: 2000,
                });
              }}
            >
              Zurücksetzen
            </Button>
          </Tooltip>
        </Group>
        <ConfirmationModal
          size="lg"
          title={"Laufenden Prozess beenden?"}
          descriptionTitle={
            "Soll der laufende Prozess wirklich beendet werden?"
          }
          descriptionText={
            "Anwenden neuer Parameter beendet den laufenden Prozess und startet einen neuen. Das Fortsetzen der aktuellen Aufnahme ist daraufhin nicht mehr möglich. Alle bisher erhobenen Daten bleiben gespeichert."
          }
          opened={confirmationModalOpened}
          onAbort={() => setConfirmationModalOpened(false)}
          onConfirm={() => {
            emitSettings(socket, settings);
            setConfirmationModalOpened(false);
          }}
          confirmBtnText="Ja"
          abortBtnText="Nein"
        />
      </Stack>
    </Layout>
  );
}
