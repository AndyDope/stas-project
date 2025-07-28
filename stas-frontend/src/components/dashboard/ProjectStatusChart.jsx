import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// This is a necessary step to register the components Chart.js needs
ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectStatusChart = ({ data }) => {
	const chartData = {
		labels: ["Total Projects", "Active", "Completed", "Overdue"],
		datasets: [
			{
				label: "# of Projects",
				data: [data.total, data.active, data.completed, data.overdue],
				backgroundColor: [
					"rgba(59, 130, 246, 0.7)", // Blue
					"rgba(245, 158, 11, 0.7)", // Amber
					"rgba(16, 185, 129, 0.7)", // Green
					"rgba(239, 68, 68, 0.7)", // Red
				],
				borderColor: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false, // Allows the chart to fill its container's height
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Projects Overview",
			},
		},
	};

	return <Doughnut data={chartData} options={options} />;
};

export default ProjectStatusChart;
