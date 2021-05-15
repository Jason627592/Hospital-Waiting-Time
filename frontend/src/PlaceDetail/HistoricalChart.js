
import React from "react";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

const HistoricalChart = (props) => {
	console.log("chart props = ", props);
	let initialState = {
		chartData: props.hospitalPast7DaysWaitingTime,
		title: props.title,
		chooseTenHours: false,
	};

	const [state, setstate] = useState(initialState);
	function showLastTenHours() {
		if (state.chooseTenHours) {
			return;
		}
		setstate({
			...state,
			chartData: props.hospitalPastTenHoursWaitingTime,
			chooseTenHours: true,
		});
	}
	function showLast7Days() {
		if (!state.chooseTenHours) {
			return;
		}
		setstate({
			...state,
			chartData: props.hospitalPast7DaysWaitingTime,
			chooseTenHours: false,
		});
	}
	return (
		<div>
			<button
				type="button"
				className={`m-2 btn ${
					state.chooseTenHours ? "btn-primary" : "btn-secondary"
				}`}
				onClick={showLastTenHours}
			>
				Last 10 hours
			</button>
			<button
				type="button"
				className={`m-2 btn ${
					state.chooseTenHours ? "btn-secondary" : "btn-primary"
				}`}
				onClick={showLast7Days}
			>
				Last 7 Days in this hour
			</button>
			<div>
				<Bar
					className="waiting-time-chart"
					data={{
						labels: state.chartData.map((arr) => arr[0]),
						datasets: [
							{
								label: state.title,
								data: state.chartData.map((arr) =>
									parseInt(arr[1].split(" ")[1])
								),
								hoverBackgroundColor: "lightblue",
							},
						],
					}}
					height={400}
					width={600}
					options={{ maintainAspectRatio: false, responsive: true , scales :{
                        yAxes : [{
                            ticks : {
                                display : true,
                                stepSize : 1,
                            },
                        }]
                    }}}
				/>
			</div>
		</div>
	);
};

export default HistoricalChart;
