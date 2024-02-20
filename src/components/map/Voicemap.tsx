import { Container } from "@mantine/core";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Series } from "../../types/Voicemap.types";

const series: Series[] = [
  {
    name: "Monday",
    data: [31, 40, 28, 51, 42, 109, 100],
  },
  {
    name: "Tuesday",
    data: [11, 32, 45, 32, 34, 52, 41],
  },
  {
    name: "Wednesday",
    data: [55, 32, 20, 44, 55, 41, 60],
  },
  {
    name: "Thursday",
    data: [91, 56, 55, 40, 40, 79, 80],
  },
  {
    name: "Friday",
    data: [91, 56, 55, 40, 40, 79, 80],
  },
  {
    name: "Saturday",
    data: [91, 56, 55, 40, 40, 79, 80],
  },
  {
    name: "Sunday",
    data: [91, 56, 55, 40, 40, 79, 80],
  },
];

const options: ApexOptions = {
  chart: {
    height: 350,
    type: "heatmap",
  },
  dataLabels: {
    enabled: false
  },
  colors: ["#008FFB"],
  title: {
    text: "Stimmfeld"
  },
};

export default function Voicemap() {
  return (
    <Container>
      <Chart 
        options={options} series={series} type="heatmap" height={350} />
    </Container>
  );
}