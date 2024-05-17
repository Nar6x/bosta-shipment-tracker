import React, { useState, useEffect } from "react";
import TextData from "../../data/TextData.json";
import { useApi } from "../../context/ApiContext";
import useDateFormatter from "../../hooks/useDateFormatter";

const ShipmentStatusStepper = ({ lang }) => {
  const { shipmentData } = useApi();

  const { formatDateShort, formatDateLong, formatDateWithMonthName } =
    useDateFormatter();

  const shipmentHeaders = TextData.shipmentHeader[lang];

  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (shipmentData) {
      const currentStepIndex = getCurrentStepIndex(
        shipmentData.CurrentStatus.state
      );
      markStepCompleted(currentStepIndex);
    }
  }, [shipmentData]);

  const getCurrentStepIndex = (currentState) => {
    switch (currentState) {
      case "TICKET_CREATED":
        return 0;
      case "PACKAGE_RECEIVED":
        return 1;
      case "OUT_FOR_DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return -1;
    }
  };

  const markStepCompleted = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      const newCompletedSteps = [...completedSteps];
      for (let i = 0; i <= stepIndex; i++) {
        if (!newCompletedSteps.includes(i)) {
          newCompletedSteps.push(i);
        }
      }
      setCompletedSteps(newCompletedSteps);
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

  // API DATA MISSING -CAN'T ACCOUNT FOR OTHER CASES-

  return (
    <div
      className="shipment-details-stepper"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="shipment-tracking-header">
        {Object.keys(shipmentHeaders).map((header, index) => (
          <div className="shipment-tracking" key={index}>
            <div className="tracking-subheader">
              {header === "shipmentNumber" ? (
                <>
                  {shipmentHeaders[header]}{" "}
                  {shipmentData && shipmentData.TrackingNumber}
                </>
              ) : (
                shipmentHeaders[header]
              )}
            </div>
            {/* Current Status */}
            {header === "shipmentNumber" && (
              <span
                className={`tracking-header ${
                  shipmentData &&
                  shipmentData.CurrentStatus.state === "DELIVERED"
                    ? "complete"
                    : ""
                }`}
              >
                {shipmentData &&
                  getTextForState(shipmentData.CurrentStatus.state)}
              </span>
            )}
            {/* Last Update */}
            {header === "lastUpdate" && (
              <span className="tracking-header">
                {shipmentData &&
                  formatDateLong(shipmentData.CurrentStatus.timestamp, lang)}
              </span>
            )}
            {/* Merchant Name */}
            {header === "merchant" && (
              <span className="tracking-header">SOUQ.COM</span>
            )}
            {/* Promised Date */}
            {header === "promisedDate" && shipmentData && (
              <span className="tracking-header">
                {shipmentData.CurrentStatus.state === "DELIVERED"
                  ? formatDateWithMonthName(
                      shipmentData.CurrentStatus.timestamp,
                      lang
                    )
                  : shipmentData.PromisedDate !== null
                  ? shipmentData.PromisedDate
                  : formatDateWithMonthName(
                      shipmentData.CurrentStatus.timestamp,
                      lang
                    )}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="line"></div>
      <div className="shipment-tracking-timeline">
        <div className="timeline-wrapper">
          {steps.map((step, index) => (
            <div
              className={`step-item ${
                completedSteps.includes(index) ? "completed" : ""
              }`}
              key={index}
            >
              <div
                className={`step ${
                  completedSteps.includes(index) ? "completed" : ""
                }`}
              />

              <p className="step-name">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentStatusStepper;
