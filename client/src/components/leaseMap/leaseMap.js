import React, { useState, useEffect } from "react";
import "./leaseMap.css";
import L from "leaflet";
import markerImage from "../../assets/marker-icon.png";


const LeaseMap = ({ address }) => {
  const [leaseCoordinates, setLeaseCoordinates] = useState([]);
  function initializeMap(){
    const map = L.map("map-container", {
      center: [leaseCoordinates[1],leaseCoordinates[0]],
      zoom:13,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ],
      scrollWheelZoom: false
    });
    const aptIcon = new L.Icon({
      iconUrl: markerImage,
      iconSize: [38, 38],
    });
    const marker = L.marker([leaseCoordinates[1],leaseCoordinates[0]], {icon: aptIcon});
    // marker.bindPopup(`<b>Coordinates: ${leaseCoordinates[0]}</b>`).openPopup();
    marker.addTo(map);
  
  }
  useEffect(() => {
    async function fetchCoordinate() {
      try {
        let response = await fetch(`/coordinate/${address}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leases");
        }
        const data = await response.json();
        setLeaseCoordinates(data.coordinates);
        
      } catch (error) {
        console.error("Error fetching leases:", error);
      }
    }
    fetchCoordinate();
  }, [address]);

  useEffect(() => {
    if (leaseCoordinates.length > 0) {
      initializeMap();
    }
  }, [leaseCoordinates]);

  return (
    <div id="map-container">
    </div>
  );
};
export default LeaseMap;
