import {
  Container,
  ContainerProps,
  MantineSize,
  Progress,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import "./QualityIndicator.css";
import { useAppSelector } from "../redux/hooks";

interface QualityIndicatorProps {
  value: number;
  triggerThreshold: number;
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
  const status = useAppSelector((state) => state.settings.values.status);
  const [progressBarHeight, setProgressBarHeight] = useState(0);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (progressBarRef.current) {
      setProgressBarHeight(
        (progressBarRef.current as HTMLElement).offsetHeight
      );
    }
  }, [props.size]);

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
        transitionDuration={200}
        value={props.value * 100}
        color={
          status === "waiting"
            ? "grey"
            : props.value < props.triggerThreshold
            ? "red"
            : "green"
        }
        ref={progressBarRef}
      />
      <div
        className="progress-marker"
        style={{
          left: `${props.triggerThreshold * 100}%`,
          height: progressBarHeight,
        }}
      />
    </Container>
  );
}
