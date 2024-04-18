import { Button, Group, Tooltip } from "@mantine/core";
import { TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useContext, useEffect } from "react";
import SocketContext from "../context/SocketContext";

export default function ControlButtonGroup() {
  const socket = useContext(SocketContext);

  const status = useAppSelector((state) => state.settings.values.status);
  const dispatch = useAppDispatch();

  // update status when audio client emits changes
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    socket.on("status_update_complete", (changedStatus) => {
      dispatch({ type: "settings/UPDATE_STATUS", payload: changedStatus });
      // when trigger status changes, reset annotation to be invisible (this will allows the correct annotation to be visible when the trigger starts again)
      dispatch({
        type: "voicemap/SET_ANNOTATION",
        payload: { id: "", text: "" },
      });
    });
  }, [dispatch, socket]);

  return (
    <Tooltip.Group>
      <Group justify="center" gap={"xs"}>
        <Tooltip label="Startet den Triggerprozess" withArrow>
          <Button
            variant={
              status === "ready" || status === "reset" ? "filled" : "outline"
            }
            color="green"
            leftSection={<TbPlayerRecord size={"20"} />}
            disabled={status === "running"}
            onClick={() => {
              socket?.emit("status_update_request", { trigger: "start" });
            }}
          >
            Start
          </Button>
        </Tooltip>
        <Tooltip label="Stoppt den Triggerprozess" withArrow>
          <Button
            variant={status === "running" ? "filled" : "outline"}
            color="red"
            leftSection={<TbPlayerStop size={"20"} />}
            disabled={status === "ready"}
            onClick={() => {
              socket?.emit("status_update_request", { trigger: "stop" });
            }}
          >
            Stop
          </Button>
        </Tooltip>
        <Tooltip label="Setzt das Stimmfeld zurück" withArrow>
          <Button
            variant={
              status === "ready" || status === "reset" ? "filled" : "outline"
            }
            color="red"
            leftSection={<TbProgressX size={"20"} />}
            disabled={status === "running"}
            onClick={() => {
              socket?.emit("status_update_request", { trigger: "reset" });
            }}
          >
            Reset
          </Button>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
}
