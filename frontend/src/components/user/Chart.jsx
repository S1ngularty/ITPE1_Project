import react from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Chart({data, title}) {
  return (
    <>
      <div style={{ width: "100%", height: 300 }}>
        <h4>{title || "No title"}</h4>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis></YAxis>
            <Tooltip />
            <Legend></Legend>
            <Line type="moontone" dataKey="classification" stroke="#1f77b4"></Line>
            <Line type="moontone" dataKey="count" stroke="#ff7f0e"></Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}


export default Chart