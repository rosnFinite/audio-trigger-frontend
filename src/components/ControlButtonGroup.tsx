import { Button, Group, Tooltip } from "@mantine/core";
import { TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function ControlButtonGroup() {
  const status = useAppSelector((state) => state.settings.values.status);
  const dispatch = useAppDispatch();

  return (
    <Group justify="center" gap={"xs"}>
      <Tooltip label="Startet den Triggerprozess">
        <Button 
          variant={status.recorder==="ready" ? "filled" : "outline"} 
          color="green" 
          leftSection={<TbPlayerRecord size={"25"} />}
          onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "online", "trigger": "online"}})}}
        >
          Start
        </Button>
      </Tooltip>
      <Tooltip label="Stoppt den Triggerprozess">
        <Button 
          variant={status.trigger==="online" ? "filled" : "outline"} 
          color="red" 
          leftSection={<TbPlayerStop size={"25"} />}
          onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "ready", "trigger": "ready"}})}}
        >
          Stop
        </Button>
      </Tooltip>
      <Tooltip label="Stoppt den Triggerprozess und setzt das gesamte Stimmfeld zurück">
        <Button 
          variant={status.trigger==="online" ? "filled" : "outline"}
          color="red" 
          leftSection={<TbProgressX size={"25"}/>}
          onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "ready", "trigger": "ready"}})}}
        >
          Reset
        </Button>
      </Tooltip>
    </Group>
  );
};
