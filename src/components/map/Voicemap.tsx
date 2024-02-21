import { Container } from "@mantine/core";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Series } from "../../types/Voicemap.types";

function generateMockData(numYLabels: number, numXLabels: number) {
  let i = 0;
  const series = [];
  while (i < numYLabels) {
    series.push({
      name: (35+i*5).toString(),
      data: Array.from({ length: numXLabels }, () => 0)
    });
    i++;
  }
  return series;
}

const series: Series[] = generateMockData(17, 33);

const options: ApexOptions = {
  chart: {
    height: 350,
    type: "heatmap",
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: true,
    borderColor: '#90A4AE',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  colors: ["#008FFB"],
  title: {
    text: "Stimmfeld"
  },
  plotOptions: {
    heatmap: {
      radius:5
    }
  },
  xaxis:{
    title: {
      text: "Frequenz [Hz]"
    },
  },
  yaxis: {
    title: {
      text: "dB(A)"
    }
  }
};


export default function Voicemap() {
  return (
    <Container ml={0} mr={30} h={"80vh"} fluid>
      <Chart 
        options={options} series={series} type="heatmap" height={"100%"} width={"100%"} />
    </Container>
  );
}