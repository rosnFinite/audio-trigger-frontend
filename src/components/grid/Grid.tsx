import {Stage, Layer, Rect} from 'react-konva';
import React, {useEffect, useRef, useState} from "react";
import {Container, ContainerProps} from "@mantine/core";
import {initializeGrid, updateElementColor} from "./gridDataSlice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";

interface GridProps extends ContainerProps{
  numCols: number,
  numRows: number,
}

interface GridElement {
  x: number,
  y: number,
  fill: string
}

const createGrid = (numCols: number= 10, numRows: number= 10) => {
  let grid: GridElement[][] = [];
  for (let col = 0; col < numCols; col++) {
    let row_elements = [];
    for (let row = 0; row < numRows; row++) {
      if (row === numRows - 1 && col === numCols - 1) {
        row_elements.push({
          x: col,
          y: row,
          fill: "#ff0000"
        });
      } else {
        if (row === 0 && col === 0) {
          row_elements.push({
            x: col,
            y: row,
            fill: "#003cff"
          });
        } else {
          row_elements.push({
            x: col,
            y: row,
            fill: "#fff"
          });
        }
      }
    }
    grid.push(row_elements);
  }
  return grid;
}

//TODO: Grid wird bei Resize aktuell neu erstellt -> feste Größe evtl. besser / einfacher

export default function Grid({numCols, numRows, ...containerProps}: GridProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const demoRef = useRef<HTMLDivElement | null>(null);

  const gridData = useAppSelector((state) => state.gridData.value)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (gridData.length <= 2) {
      let defaultGrid = createGrid(numCols, numRows);
      dispatch(initializeGrid(defaultGrid));
    }
  }, []);


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
              onMouseEnter={function(this:any) {
                this.fill("#00ff97");
                dispatch(updateElementColor({x: n.x, y:n.y, fill:"#00ff97"}));
              }}
            />
          ))}
        </Layer>
      </Stage>
    </Container>
  );
}