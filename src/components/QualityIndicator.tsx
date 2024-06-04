import {
  Container,
  ContainerProps,
  MantineSize,
  Progress,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import "./QualityIndicator.css";
import { useWebSocketCtx } from "../context";

interface QualityIndicatorProps {
  threshold: number;
  size?: MantineSize;
  fluid?: boolean;
  pl?: ContainerProps["pl"];
  pr?: ContainerProps["pr"];
  pt?: ContainerProps["pt"];
  pb?: ContainerProps["pb"];
  mt?: ContainerProps["mt"];
  mb?: ContainerProps["mb"];
  mr?: ContainerProps["mr"];
  ml?: ContainerProps["ml"];
  showValue?: boolean;
}

export default function QualityIndicator(props: QualityIndicatorProps) {
  const { socket } = useWebSocketCtx();
  const [status, setStatus] = useState("ready");
  const prevStatus = useRef(status);
  const [progressBarHeight, setProgressBarHeight] = useState(0);
  const [score, setScore] = useState(0);
  const [color, setColor] = useState("red");
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (progressBarRef.current) {
      setProgressBarHeight(
        (progressBarRef.current as HTMLElement).offsetHeight
      );
    }
  }, [props.size]);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    const voiceHandler = (data: any) => {
      setScore(data.score);
    };
    const statusHandler = (data: any) => {
      setStatus(data.status);
    };

    socket.on("voice", voiceHandler);
    socket.on("status_update_complete", statusHandler);

    return () => {
      socket.off("voice", voiceHandler);
      socket.off("status_update_complete", statusHandler);
    };
  }, []);

  useEffect(() => {
    if (status === "waiting") {
      setColor("grey");
    } else if (
      status === "ready" ||
      (prevStatus.current === "waiting" && status === "running")
    ) {
      console.log("resetting score");
      setColor("red");
      setScore(0);
    } else if (score < props.threshold) {
      setColor("red");
    } else {
      setColor("green");
    }
    prevStatus.current = status;
  }, [score, status]);

  return (
    <Container
      pos={"relative"}
      fluid={props.fluid}
      pt={props.pt}
      pb={props.pb}
      pr={props.pr}
      pl={props.pl}
      mt={props.mt}
      mb={props.mb}
      mr={props.mr}
      ml={props.ml}
    >
      <Progress
        size={props.size ? props.size : "sm"}
        animated={status === "waiting"}
        transitionDuration={50}
        value={score * 100}
        color={color}
        ref={progressBarRef}
      />
      <div
        className="progress-marker"
        style={{
          left: `${props.threshold * 100}%`,
          height: progressBarHeight,
        }}
      />
    </Container>
  );
}
