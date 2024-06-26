//ScheduleCard.js
import React, { useEffect, useState } from "react";
import busImg from "../../logo/image 1.png";
import { Card, CardContent } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ScheduleCard.css";

function ScheduleCard({
  busID,
  busRegNo,
  routeNo,
  fromStop,
  toStop,
  direction,
}) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/bus/${busID}/stops`
        ); //Schedules of the current bus
        console.log("fwtched scheduled for the selected bus ", response.data);
        setSchedules(response.data);
      } catch (error) {
        setError("Error fetching bus schedules.");
        console.error("Error fetching bus schedules:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [busID]);

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} Hours and ${minutes} Minutes`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredSchedules = schedules.filter(
    (schedule) => schedule.direction === direction
  );

  const fromSchedule = filteredSchedules.find(
    (schedule) => schedule.busStop.name === fromStop
  );
  const toSchedule = filteredSchedules.find(
    (schedule) => schedule.busStop.name === toStop
  );

  if (!fromSchedule || !toSchedule) {
    return <p>No schedule available for the selected route.</p>;
  }

  const fromTime = fromSchedule.departureTime;
  const toTime = toSchedule.arrivalTime;

  return (
    <Card className="schedule-card">
      <CardContent className="schedule-card-content">
        <div className="header-bar" style={headbarStyle}>
          <div style={{ fontSize: "15px", paddingLeft: 15 }}>
            <p>Bus: {busRegNo}</p>
          </div>
          <div style={{ fontSize: "15px", paddingRight: 15 }}>
            <p>Route No: {routeNo}</p>
          </div>
        </div>
        <div className="middle-bar" style={middlePartStyle}>
          <div>
            <img src={busImg} style={{ position: "relative" }} alt="Bus" />
          </div>
          <div>
            <p style={{ marginBottom: -10, fontSize: 15 }}>From:</p>
            <p>{fromStop}</p>
            <p>{fromTime}</p>
          </div>
          <p className="duration" style={{ textAlign: "center", margin: 20 }}>
            {calculateDuration(fromTime, toTime)}
          </p>
          <div>
            <p style={{ marginBottom: -10, fontSize: 15 }}>To:</p>
            <p>{toStop}</p>
            <p>{toTime}</p>
          </div>
          <Link to="/reviews">Review & Rating</Link>
        </div>
        <div className="footer-bar" style={footerbarStyle}>
          <div className="cringe" style={{ padding: 5, fontWeight: "bold" }}>
            <p
              style={{
                backgroundColor: "#90EE90",
                padding: 2,
                borderRadius: 6,
              }}
            >
              Left "last bus stop" at "time"
            </p>
          </div>
          <div>
            <select
              className="select-option"
              defaultValue=""
              displayEmpty
              style={{
                width: "250px",
                height: "40px",
                backgroundColor: "white",
              }}
            >
              {filteredSchedules.map((schedule, index) => (
                <option key={index}>
                  Arrival at {schedule.busStop.name} {schedule.arrivalTime}
                </option>
              ))}
            </select>
          </div>
          <div className="cringe" style={{ padding: 5, fontWeight: "bold" }}>
            <p style={{ backgroundColor: "red", padding: 6, borderRadius: 15 }}>
              Delay: 10 min
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const headbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#071E60",
  height: "32px",
  color: "white",
  borderRadius: 6,
};
const middlePartStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const footerbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#071E60",
  borderRadius: 6,
};

export default ScheduleCard;
