import { Group, Text } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { TbJson, TbX, TbCheck } from "react-icons/tb";
interface FileData {
  [key: string]: number[];
}

export default function JsonDropzone({
  setFileName,
  setFileContent,
  ...props
}: {
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setFileContent: React.Dispatch<React.SetStateAction<FileData | null>>;
} & Partial<DropzoneProps>) {
  const readFileContent = (file: File | null) => {
    console.log("Datei:", file);
    if (file === null) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("READER:", e.target?.result);
      if (e.target?.result) {
        let content = JSON.parse(e.target.result.toString());
        console.log("CONTENT:", content);
        setFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dropzone
      onDrop={(files) => {
        setFileName(files[0].name);
        readFileContent(files[0]);
      }}
      onReject={(files) => console.log("rejected files", files)}
      accept={["application/json"]}
      maxSize={5 * 1024 ** 2}
      acceptColor="var(--mantine-color-green-6)"
      style={{
        border: "1px dashed var(--mantine-color-dimmed)",
        borderRadius: 4,
        padding: 20,
      }}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={100}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <TbCheck
            size={50}
            style={{ color: "var(--mantine-color-green-6)" }}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <TbX size={50} style={{ color: "var(--mantine-color-red-6)" }} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <TbJson size={50} style={{ color: "var(--mantine-color-dimmed)" }} />
        </Dropzone.Idle>

        <div>
          <Text size="lg" inline>
            Kalbibrierungsdatei
          </Text>
          <Text size="xs" c="dimmed" inline mt={7}>
            JSON-Datei hineinziehen oder auswählen
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
