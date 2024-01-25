import {Stage, Layer, Rect} from 'react-konva';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Container} from "@mantine/core";

interface GridProps {
  numCols: number,
  numRows: number,
  nodeSize: number
}

interface GridElement {
  x: number,
  y: number,
  fill: string
}

const createGrid = (numCols: number= 10, numRows: number= 10, height: number= 1000, width: number = 1000) => {
  let grid: GridElement[] = [];
  let rectHeight = height / numRows;
  let rectWidth = width / numCols;
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      if (row === numRows-1 && col === numCols-1) {
        grid.push({
          x: col * rectWidth,
          y: row * rectHeight,
          fill: "#ff0000"
        });} else {
          if (row === 0 && col === 0) {
            grid.push({
              x: col * rectWidth,
              y: row * rectHeight,
              fill: "#003cff"
            });
          } else {
            grid.push({
              x: col * rectWidth,
              y: row * rectHeight,
              fill: "#fff"
            });
          }
        }
      }
    }
  console.log("done")
  return grid;
}

//TODO: Grid wird bei Resize aktuell neu erstellt -> feste Größe evtl. besser / einfacher

export default function Grid({numCols, numRows}: GridProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const demoRef = useRef<HTMLDivElement | null>(null);

  const defaultGrid = useMemo(() => createGrid(numCols, numRows, height, width), [numRows, numCols, height, width])

  const [grid, setGrid] = useState<GridElement[]>([]);
  useEffect(() => {
    setGrid(defaultGrid);
  }, [defaultGrid]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      if (event && event[0]) {
        const { blockSize, inlineSize } = event[0].contentBoxSize[0];
        setWidth(inlineSize || blockSize);
        setHeight(blockSize || inlineSize);
      }
    });

    if (demoRef?.current) {
      resizeObserver.observe(demoRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [demoRef]);

  return (
    <Container size={"95%"} h={"100vh"} ref={demoRef} bg="var(--mantine-color-blue-light)">
      <Stage width={width} height={height}>
        <Layer>
          {Object.values(grid).map((n, i) => (
            <Rect
              key={i}
              x={n.x}
              y={n.y}
              width={width / numCols}
              height={height / numRows}
              fill={n.fill}
              stroke="#EEEEF4"
            />
          ))}
        </Layer>
      </Stage>
    </Container>
  );
}