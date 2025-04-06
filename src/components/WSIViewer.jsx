import React, { useEffect, useRef, useState } from "react";

export default function WSIViewer() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [detectionResults, setDetectionResults] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  // Fetch detection results from output.json
  useEffect(() => {
    fetch("/output.json")
      .then((res) => res.json())
      .then((data) => setDetectionResults(data.detection_results));
  }, []);

  // Draw bounding boxes
  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      detectionResults.forEach((box) => {
        const { x, y, width, height } = box;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      });
    }
  }, [imageLoaded, detectionResults, zoom]);

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-auto border-r">
        <h2 className="text-xl font-semibold mb-4">Finding Details</h2>
        <p className="text-sm text-gray-700">Diagnosis: Sickle Cell Anemia</p>
        <p className="text-sm text-gray-700">Slide ID: #12345</p>
        <p className="text-sm text-gray-700">Stain: H&amp;E</p>
      </div>

      {/* Center Panel */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-auto">
        <div
          className="relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
        >
          <img
            ref={imageRef}
            src="/wsi_image.png"
            alt="WSI"
            onLoad={() => setImageLoaded(true)}
            className="block max-w-none"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
          />
        </div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow z-20">
          <button
            onClick={() => setZoom(zoom * 1.2)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Zoom In
          </button>
          <button
            onClick={() => setZoom(zoom / 1.2)}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Zoom Out
          </button>
        </div>
      </div>

      {/* Top-Right Hub View */}
      <div className="w-1/4 bg-gray-200 p-4 border-l">
        <h2 className="text-lg font-semibold mb-2">Hub View</h2>
        <div className="relative">
          <img src="/wsi_image.png" alt="Hub View" className="w-full border" />
          {/* Optional: overlay a rectangle showing zoomed area */}
          <div className="absolute border-2 border-blue-500 top-10 left-10 w-12 h-12"></div>
        </div>
      </div>
    </div>
  );
}
