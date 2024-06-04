import { Button, Group, Paper, Tooltip } from "@mantine/core";
import { TbPlayerRecord, TbPlayerStop, TbProgressX } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { useWebSocketCtx } from "../../context";

export default function ControlButtonGroup() {
  const { socket } = useWebSocketCtx();

  const status = useAppSelector((state) => state.settings.values.status);
  const dispatch = useAppDispatch();

  // update status when audio client emits changes
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    const statusUpdateHandler = (changedStatus: any) => {
      dispatch({ type: "settings/UPDATE_STATUS", payload: changedStatus });
      // when trigger status changes, reset annotation to be invisible (this will allows the correct annotation to be visible when the trigger starts again)
      dispatch({
        type: "voicemap/SET_ANNOTATION",
        payload: { id: "", text: "" },
      });
    };

    socket.on("status_update_complete", statusUpdateHandler);

    return () => {
      socket.off("status_update_complete", statusUpdateHandler);
    };
  }, []);

  return (
    <Tooltip.Group>
      <Group justify="center" gap={"xs"}>
        <Paper shadow="lg" withBorder pt={5} pr={5} pb={5} pl={5}>
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
              disabled={status === "ready" || status === "reset"}
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
        </Paper>
      </Group>
    </Tooltip.Group>
  );
}
