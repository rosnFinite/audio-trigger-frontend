import { Button, Group, Tooltip } from "@mantine/core";
import { TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { SocketProp } from "../types/SocketProp.types";
import { useEffect } from "react";

export default function ControlButtonGroup({socket}: SocketProp) {
  const status = useAppSelector((state) => state.settings.values.status);
  const dispatch = useAppDispatch();

  // update status when audio client emits changes
  useEffect(() => {
    socket.on("statusChanged", (changedStatus) => {
      dispatch({type: "settings/UPDATE_STATUS", payload: changedStatus});
    });
  }, [dispatch, socket]);

  return (
    <Tooltip.Group>
      <Group justify="center" gap={"xs"}>
        <Tooltip label="Startet den Triggerprozess" withArrow>
          <Button 
            variant={status.trigger==="ready" ? "filled" : "outline"} 
            color="green" 
            leftSection={<TbPlayerRecord size={"20"} />}
            disabled={status.trigger==="running"}
            onClick={() => {socket.emit("changeStatus", {"trigger": "start"})}}
          >
            Start
          </Button>
        </Tooltip>
        <Tooltip label="Stoppt den Triggerprozess" withArrow>
          <Button 
            variant={status.trigger==="running" ? "filled" : "outline"} 
            color="red" 
            leftSection={<TbPlayerStop size={"20"} />}
            disabled={status.trigger==="ready"}
            onClick={() => {socket.emit("changeStatus", {"trigger": "stop"})}}
          >
            Stop
          </Button>
        </Tooltip>
        <Tooltip label="Setzt das Stimmfeld zurück" withArrow>
          <Button 
            variant={status.trigger==="ready" ? "filled" : "outline"}
            color="red" 
            leftSection={<TbProgressX size={"20"}/>}
            disabled={status.trigger==="running"}
            onClick={() => {socket.emit("changeStatus", {"trigger": "reset"})}}
          >
            Reset
          </Button>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
};
