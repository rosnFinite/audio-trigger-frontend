import React, {useEffect, useState} from 'react';
import './App.css';
import '@mantine/core/styles.css';
import {Button, FileButton, FileInput, Flex, Group, NativeSelect, Stack, Text} from "@mantine/core";
import JsonFileInput from "./components/JsonFileInput";

export default function App() {
  const [inputDevices, setInputDevices] = useState([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/input-devices")
      .then((response) => response.json())
      .then((data) => {
        setInputDevices(data["devices"])
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, []);


  useEffect(() => {
    const uploadFile = async (): Promise<void> => {
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("http://localhost:5001/upload-calib", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("Erfolgreich hochgeladen");
          } else {
            console.log("Fehler", response.statusText);
          }
        } catch (error) {
          console.error("Fehler", error);
        }
      }
    }

    uploadFile();
  }, [file]);

  return (
    <Stack
      h="100vh"
    >
      <NativeSelect label="Eingabegerät" data={inputDevices} />
      <Group>
        <FileButton onChange={setFile} accept={"application/json"}>
          {(props) => <Button {...props}>Kalibrierungsdatei hochladen</Button>}
        </FileButton>
      </Group>
      {file && (
        <Text size="sm" ta="left" mt="sm">
          {file.name}
        </Text>
      )}
    </Stack>
  );
}

