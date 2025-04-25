import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartComponent({ id, type, data, options }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        // Destroi o gráfico anterior, se existir
        if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

        // Cria o novo gráfico
        new Chart(ctx, {
            type,
            data,
            options,
        });

        // Cleanup para evitar vazamentos de memória
        return () => {
            if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();
        };
    }, [type, data, options]);

    return <canvas id={id} ref={chartRef}></canvas>;
}