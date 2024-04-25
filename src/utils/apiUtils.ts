const apiBaseUrl = "http://localhost:5001/api";

function getRestBaseUrlForRecording(recordingSaveLocation: string, dbBin: number, freqBin: number): string{
  const splittedLocation = recordingSaveLocation.split("\\");
  const filename = `${dbBin}_${freqBin}`;
  const endpoint = `${apiBaseUrl}/recordings/${splittedLocation.pop()}/${filename}`;
  return endpoint;
};

export { getRestBaseUrlForRecording };