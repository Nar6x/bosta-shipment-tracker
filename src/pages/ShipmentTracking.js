import React from "react";
import Navbar from "../components/Navbar";
import ShipmentStatusStepper from "../components/shipment-details/ShipmentStatusStepper";
import ShipmentStatusTable from "../components/shipment-details/ShipmentStatusTable";
import TextData from "../data/TextData.json";
import problem from "../assets/problem.png";
import { useLanguage } from "../context/LanguageContext";

const ShipmentTracking = () => {
  const { lang } = useLanguage();
  const { deliveryAddress } = TextData.subheader[lang];
  const { issue, reportIssue, address } = TextData.misc[lang];

  return (
    <>
      <Navbar />
      <div className="shipment-tracking-details-section">
        <div className="shipment-stepper">
          <ShipmentStatusStepper lang={lang} />
        </div>

        <div
          className="shipment-details-section"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
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
      </div>
    </>
  );
};

export default ShipmentTracking;
