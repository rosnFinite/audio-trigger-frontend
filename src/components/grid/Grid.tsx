import {Stage, Layer, Rect} from 'react-konva';
import React, {useEffect, useRef, useState} from "react";
import {Container} from "@mantine/core";
import {initializeGrid, updateElement} from "./gridDataSlice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {GridElement, GridProps} from "./Grid.types";


const createGrid = (numCols: number= 10, numRows: number= 10) => {
  let grid: GridElement[][] = [];
  for (let row = 0; row < numRows; row++) {
    let row_elements = [];
    for (let col = 0; col < numCols; col++) {
      row_elements.push({
        x: col,
        y: row,
        fill: "#fff"
      });
    }
    grid.push(row_elements);
  }
  return grid;
}

//TODO: Grid wird bei Resize aktuell neu erstellt -> feste Größe evtl. besser / einfacher

export default function Grid({numCols, numRows, socket, ...containerProps}: GridProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const demoRef = useRef<HTMLDivElement | null>(null);

  const gridData = useAppSelector((state) => state.gridData.value)
  const dispatch = useAppDispatch()
  
  // only reset grid on change in number of cols and rows
  useEffect(() => {
    if (gridData.length !== numCols){
      let defaultGrid = createGrid(numCols, numRows);
      dispatch(initializeGrid(defaultGrid));
    }
  }, [numCols, numRows]);

  useEffect(() => {
    socket.on("trigger", (data) => {
      dispatch(updateElement({x: data.x, y: numRows-1-data.y, fill: "#000"}));
    });

    socket.on("voice", (data) => {
    });
  } , []);

  // updates width and height of grid inside parent container
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
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
    <Container {...containerProps} ref={demoRef}>
      <Stage width={width} height={height}>
        <Layer>
          {Object.values(gridData.flat(1)).map((n, i) => (
            <Rect
              key={i}
              x={n.x * (width / numCols)}
              y={n.y * (height / numRows)}
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