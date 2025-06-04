import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartComponent({ id, type, dados, data, options, dataSelecionada }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

        new Chart(ctx, {
            type,
            data,
            options,
        });

        return () => {
            if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();
        };
    }, [dados, dataSelecionada]);

    return <canvas id={id} ref={chartRef}></canvas>;
}