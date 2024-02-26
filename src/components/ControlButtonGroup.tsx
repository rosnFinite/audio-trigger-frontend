import { Button, Group, Tooltip } from "@mantine/core";
import { TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function ControlButtonGroup() {
  const status = useAppSelector((state) => state.settings.values.status);
  const dispatch = useAppDispatch();

  return (
    <Tooltip.Group>
      <Group justify="center" gap={"xs"}>
        <Tooltip label="Startet den Triggerprozess" withArrow>
          <Button 
            variant={status.recorder==="ready" ? "filled" : "outline"} 
            color="green" 
            leftSection={<TbPlayerRecord size={"20"} />}
            disabled={status.recorder==="online"}
            onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "online", "trigger": "online"}})}}
          >
            Start
          </Button>
        </Tooltip>
        <Tooltip label="Stoppt den Triggerprozess" withArrow>
          <Button 
            variant={status.trigger==="online" ? "filled" : "outline"} 
            color="red" 
            leftSection={<TbPlayerStop size={"20"} />}
            disabled={status.trigger==="ready"}
            onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "ready", "trigger": "ready"}})}}
          >
            Stop
          </Button>
        </Tooltip>
        <Tooltip label="Stoppt den Triggerprozess und setzt das gesamte Stimmfeld zurück" withArrow>
          <Button 
            variant={status.trigger==="online" ? "filled" : "outline"}
            color="red" 
            leftSection={<TbProgressX size={"20"}/>}
            disabled={status.trigger==="ready"}
            onClick={() => {dispatch({type: "settings/updateStatus", payload: {"recorder": "ready", "trigger": "ready"}})}}
          >
            Reset
          </Button>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
};
