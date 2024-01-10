import React from 'react';
import { FileInput } from '@mantine/core';

interface InputProps {
  label: string;
  placeholder: string;
}

function MyFileInputComponent(props: InputProps) {
  const handleFileChange = async (
    file: File | null
  ) => {
    // Überprüfe, ob Dateien vorhanden sind
    try {
      if (file === null) {
        return;
      }
      // Lese den Inhalt der Datei als Text
      const fileContent = await file.text();

      // Parset den Text als JSON
      const jsonData = JSON.parse(fileContent);

      // Hier kannst du mit jsonData arbeiten
      console.log('Inhalt der JSON-Datei:', jsonData);
    } catch (error) {
      console.error('Fehler beim Lesen oder Parsen der Datei:', error);
    }
  };

  return (
    <FileInput
      label={props.label}
      placeholder={props.placeholder}
      accept=".json"
      onChange={e => handleFileChange(e)}
    />
  );
}

export default MyFileInputComponent;
