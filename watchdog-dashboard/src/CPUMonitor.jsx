import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import "chart.js/auto";

const MAX_DATA_POINTS = 60;

function CPUMonitor({ data, isActive }) {
    const [cpuUsage, setCpuUsage] = useState(new Array(MAX_DATA_POINTS).fill(0));

    useEffect(() => {
        if (isActive) setCpuUsage([...cpuUsage.slice(1), data]);
        else setCpuUsage(new Array(60).fill(0));
    }, [data, isActive]);

    const chartData = {
        // Labels to be used along the X-axis
        labels: new Array(MAX_DATA_POINTS).fill().map((e, i) => i),

        // An array containing data to be plotted with the desired display configs.
        datasets: [
            {
                label: "CPU Usage", // Must be unique
                data: cpuUsage,
                fill: true,
                backgroundColor: "#E0FFFF",
                borderColor: "#0FFFFF",
                pointRadius: 0
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            x: {
                type: "linear",
                min: 0,
                max: MAX_DATA_POINTS - 1,
                ticks: {
                    stepSize: 10,
                    callback: (value) => `${MAX_DATA_POINTS - value}s`
                },
                grid: {
                    display: false
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    callback: (value) => `${value}%`,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    }

    return (
        <Line
            data={chartData}
            options={chartOptions}
        />
    );
}

export default CPUMonitor;
