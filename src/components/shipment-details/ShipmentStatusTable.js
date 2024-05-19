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
      case "NOT_YET_SHIPPED":
        return TextData.timeline[lang].notYetShipped;
      case "DELIVERED":
        return TextData.timeline[lang].delivered;
      case "WAITING_FOR_CUSTOMER_ACTION":
        return TextData.timeline[lang].notDelivered;
      case "DELIVERED_TO_SENDER":
        return TextData.timeline[lang].cancelled;
      default:
        return null;
    }
  };

  const renderTransitEvents = () => {
    if (!shipmentData) return null;

    const events = shipmentData.TransitEvents.filter((event) =>
      getTextForState(event.state)
    );

    const currentState = shipmentData.CurrentStatus.state;
    const isSpecialState =
      currentState === "WAITING_FOR_CUSTOMER_ACTION" ||
      currentState === "DELIVERED_TO_SENDER";

    return events.map((event, index) => {
      const isLastEvent = index === events.length - 1;
      const displayState =
        isSpecialState && isLastEvent
          ? getTextForState("WAITING_FOR_CUSTOMER_ACTION")
          : getTextForState(event.state);

      const reasonText =
        isSpecialState && isLastEvent
          ? currentState === "WAITING_FOR_CUSTOMER_ACTION"
            ? getTextForState("WAITING_FOR_CUSTOMER_ACTION")
            : getTextForState("DELIVERED_TO_SENDER")
          : null;

      const reasonClass =
        isSpecialState && isLastEvent
          ? currentState === "WAITING_FOR_CUSTOMER_ACTION"
            ? "action-needed"
            : "error"
          : "";

      return (
        <tr key={index}>
          <td>{event.hub || "--"}</td>
          <td>{formatDateShort(event.timestamp, lang)}</td>
          <td>{formatTime(event.timestamp, lang)}</td>
          <td>
            <div className="td-reason">
              {displayState}
              {reasonText && (
                <span className={`reason ${reasonClass}`}>{reasonText}</span>
              )}
            </div>
          </td>
        </tr>
      );
    });
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
