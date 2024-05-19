import React, { useState, useEffect } from "react";
import TextData from "../../data/TextData.json";
import { useApi } from "../../context/ApiContext";
import useDateFormatter from "../../hooks/useDateFormatter";

const ShipmentStatusStepper = ({ lang }) => {
  const { shipmentData } = useApi();
  const { formatDateLong, formatDateWithMonthName } = useDateFormatter();
  const shipmentHeaders = TextData.shipmentHeader[lang];

  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (shipmentData) {
      const currentStepIndex = getCurrentStepIndex(
        shipmentData.CurrentStatus.state
      );
      setCompletedSteps(
        Array.from({ length: currentStepIndex + 1 }, (_, i) => i)
      );
    }
  }, [shipmentData]);

  const getCurrentStepIndex = (currentState) => {
    switch (currentState) {
      case "TICKET_CREATED":
        return 0;
      case "PACKAGE_RECEIVED":
        return 1;
      case "OUT_FOR_DELIVERY":
      case "DELIVERED_TO_SENDER":
      case "WAITING_FOR_CUSTOMER_ACTION":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return -1;
    }
  };

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
      case "WAITING_FOR_CUSTOMER_ACTION":
        return TextData.timeline[lang].notDelivered;
      case "DELIVERED_TO_SENDER":
        return TextData.timeline[lang].cancelled;
      default:
        return null;
    }
  };

  const steps = [
    getTextForState("TICKET_CREATED"),
    getTextForState("PACKAGE_RECEIVED"),
    getTextForState("OUT_FOR_DELIVERY"),
    getTextForState("DELIVERED"),
  ];

  const getStepClassNames = (index) => {
    const isCompleted = completedSteps.includes(index);
    const currentState = shipmentData?.CurrentStatus.state;

    if (
      isCompleted &&
      !["WAITING_FOR_CUSTOMER_ACTION", "DELIVERED_TO_SENDER"].includes(
        currentState
      )
    ) {
      return "completed";
    } else if (
      index <= 2 &&
      ["WAITING_FOR_CUSTOMER_ACTION", "DELIVERED_TO_SENDER"].includes(
        currentState
      )
    ) {
      return currentState === "WAITING_FOR_CUSTOMER_ACTION"
        ? "action-needed"
        : "error";
    }
    return "";
  };

  const renderShipmentNumber = () => {
    const currentState = shipmentData?.CurrentStatus.state;
    const classNames = getStepClassNames(0);

    return (
      <span className={`tracking-header ${classNames}`}>
        {shipmentData && getTextForState(currentState)}
      </span>
    );
  };

  const renderLastUpdate = () => (
    <span className="tracking-header">
      {shipmentData &&
        formatDateLong(shipmentData.CurrentStatus.timestamp, lang)}
    </span>
  );

  const renderMerchant = () => (
    <span className="tracking-header">SOUQ.COM</span>
  );

  const renderPromisedDate = () => (
    <span className="tracking-header">
      {shipmentData?.CurrentStatus.state === "DELIVERED"
        ? formatDateWithMonthName(shipmentData.CurrentStatus.timestamp, lang)
        : shipmentData?.PromisedDate
        ? formatDateWithMonthName(shipmentData.PromisedDate, lang)
        : ""}
    </span>
  );

  const renderHeaderContent = (header) => {
    switch (header) {
      case "shipmentNumber":
        return renderShipmentNumber();
      case "lastUpdate":
        return renderLastUpdate();
      case "merchant":
        return renderMerchant();
      case "promisedDate":
        return renderPromisedDate();
      default:
        return (
          <span className="tracking-header">{shipmentHeaders[header]}</span>
        );
    }
  };

  const renderStepItem = (step, index) => {
    const currentState = shipmentData?.CurrentStatus.state;
    const classNames = getStepClassNames(0);

    const reasonText =
      currentState === "WAITING_FOR_CUSTOMER_ACTION"
        ? getTextForState("WAITING_FOR_CUSTOMER_ACTION")
        : currentState === "DELIVERED_TO_SENDER"
        ? getTextForState("DELIVERED_TO_SENDER")
        : "";

    return (
      <div className={`step-item ${getStepClassNames(index)}`} key={index}>
        <div className={`step ${getStepClassNames(index)}`} />
        <div className="step-container">
          <p className="step-name">{step}</p>
          {index === 2 && shipmentData && (
            <p className={`reason ${classNames}`}>{reasonText}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="shipment-details-stepper"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="shipment-tracking-header">
        {Object.keys(shipmentHeaders).map((header, index) => (
          <div className="shipment-tracking" key={index}>
            <div className="tracking-subheader">
              {" "}
              {header === "shipmentNumber" ? (
                <>
                  {shipmentHeaders[header]}{" "}
                  {shipmentData && shipmentData.TrackingNumber}
                </>
              ) : (
                shipmentHeaders[header]
              )}
            </div>
            {renderHeaderContent(header)}
          </div>
        ))}
      </div>
      <div className="line"></div>
      <div className="shipment-tracking-timeline">
        <div className="timeline-wrapper">
          {steps.map((step, index) => renderStepItem(step, index))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentStatusStepper;
