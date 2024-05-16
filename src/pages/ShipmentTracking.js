import React, { useState } from "react";
import ShipmentStatusStepper from "../components/shipment-details/ShipmentStatusStepper";
import ShipmentStatusTable from "../components/shipment-details/ShipmentStatusTable";
import TextData from "../data/TextData.json";
import problem from "../assets/problem.png";
import { useLanguage } from "../context/LanguageContext";
import { useApi } from "../context/ApiContext";

const ShipmentTracking = () => {
  const { lang } = useLanguage();
  const { deliveryAddress } = TextData.subheader[lang];
  const { issue, reportIssue, address } = TextData.misc[lang];
  const { trackingNumber } = TextData.misc[lang];
  const { trackShipment } = TextData.navbar[lang];

  const { shipmentData, fetchData } = useApi();

  const [shipmentNumber, setShipmentNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(shipmentNumber);
  };

  return (
    <div
      className="shipment-tracking-details-section"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {(!shipmentData ||
        Object.keys(shipmentData).length === 0 ||
        !shipmentData.CurrentStatus) && (
        <div className="search">
          <div className="search-label">{trackShipment}</div>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder={trackingNumber}
              className="dropdown-search"
              value={shipmentNumber}
              onChange={(e) => setShipmentNumber(e.target.value)}
            />
            <div
              className="search-icon"
              style={{ width: 80 }}
              onClick={handleSubmit}
            />
          </div>
        </div>
      )}
      {shipmentData && shipmentData.CurrentStatus && (
        <>
          <div className="shipment-stepper">
            <ShipmentStatusStepper lang={lang} />
          </div>
          <div className="shipment-details-section">
            <div className="shipment-details-container">
              <div className="shipment-table">
                <ShipmentStatusTable lang={lang} />
              </div>
              <div className="shipment-details">
                <h3>{deliveryAddress}</h3>
                <div className="shipment-container">
                  <div className="shipment-address">
                    <p className="address">{address}</p>
                  </div>
                  <div className="shipment-problem">
                    <div>
                      <img src={problem} alt="issue" />
                    </div>
                    <div className="problem">
                      <h3>{issue}</h3>
                      <button>{reportIssue}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentTracking;
