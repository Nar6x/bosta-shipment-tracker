import React from "react";
import TextData from "../../data/TextData.json";
import { useApi } from "../../context/ApiContext";
import useDateFormatter from "../../hooks/useDateFormatter";

const ShipmentStatusTable = ({ lang }) => {
  const { shipmentData } = useApi();

  const { formatDateShort, formatTime } = useDateFormatter();

  const { shipmentDetails } = TextData.subheader[lang];
  const { hub, date, time, details } = TextData.tableHeader[lang];

  const getTextForState = (state) => {
    switch (state) {
      case "TICKET_CREATED":
        return TextData.timeline[lang].shipmentCreated;
      case "PACKAGE_RECEIVED":
        return TextData.timeline[lang].packageReceived;
      case "OUT_FOR_DELIVERY":
        return TextData.timeline[lang].outForDelivery;
      case "DELIVERED":
        return TextData.timeline[lang].delivered;
      default:
        return null;
    }
  };

  const renderTransitEvents = () => {
    if (!shipmentData) return null;
    return shipmentData.TransitEvents.filter((event) =>
      getTextForState(event.state)
    ).map((event, index) => (
      <tr key={index}>
        <td>{event.hub || "--"}</td>
        <td>{formatDateShort(event.timestamp, lang)}</td>
        <td>{formatTime(event.timestamp, lang)}</td>
        <td>{getTextForState(event.state)}</td>
      </tr>
    ));
  };

  return (
    <div className="shipment-details-table" dir={lang === "ar" ? "rtl" : "ltr"}>
      <h3>{shipmentDetails}</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th>{hub}</th>
            <th>{date}</th>
            <th>{time}</th>
            <th>{details}</th>
          </tr>
        </thead>
        <tbody>{renderTransitEvents()}</tbody>
      </table>
    </div>
  );
};

export default ShipmentStatusTable;
