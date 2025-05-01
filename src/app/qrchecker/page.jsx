'use client';

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';
import Link from 'next/link';

export default function QrScanner() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const scanningRef = useRef(true);

  // Start camera on component mount
  useEffect(() => {
    startCamera();
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize camera
  const startCamera = async () => {
    try {
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          scanQRCode();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access error: ' + err.message);
    }
  };

  // Scan for QR codes from video feed
  const scanQRCode = async () => {
    if (!scanningRef.current) return;

    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      requestRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      console.log("QR code detected:", code.data);
      setUrl(code.data);
      scanningRef.current = false; // Stop scanning
      submitUrl(code.data);
    } else {
      requestRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  // Extract QR from uploaded image
  const extractLinkFromImagePath = async (imagePath) => {
    const img = new Image();
    img.src = imagePath;
    await img.decode();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    return jsQR(imageData.data, img.width, img.height)?.data || null;
  };

  // Handle file upload and extract QR
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const qrData = await extractLinkFromImagePath(e.target.result);
        if (qrData) {
          console.log("QR code detected from image:", qrData);
          setUrl(qrData);
          await submitUrl(qrData);
        } else {
          setError("No QR code found in image.");
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error processing image: " + err.message);
      setIsLoading(false);
    }
  };

  // Send URL to backend
  const submitUrl = async (urlToSubmit) => {
    if (!urlToSubmit) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('https://major-project-production-a554.up.railway.app/predict', {
        email: 'newujjwalpatel@gmail.com',
        api_key: 'd4a6251e4c9c435152b105a611b4751a32f078e3df1695b74630f6df438ab69e',
        url: urlToSubmit,
      });
      
      // Store the full result object instead of just the classification
      setResult(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('API error: ' + (err.response?.data?.error || err.message));
      setIsLoading(false);
    }
  };

  // Reset the scanner
  const resetScanner = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setIsLoading(false);
    scanningRef.current = true;
    scanQRCode();
  };

  // Loading Spinner component
  const LoadingSpinner = () => (
    <div className="w-full max-w-md p-4 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-blue-600 font-medium">Analyzing URL...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <section className="text-center py-12 px-6">
        <h1 className="text-4xl font-bold text-blue-600">PhishShield Scanner</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Scan QR codes in real-time or upload images to detect phishing attempts.
        </p>
      </section>
      
      {/* Scanner Section */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">QR Code Scanner</h2>
          
          {/* Video Scanner */}
          <div className="relative w-full max-w-md mx-auto mb-6">
            <video 
              ref={videoRef} 
              className="w-full border-2 border-gray-300 rounded-lg shadow-sm" 
              autoPlay 
              playsInline 
              muted
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-blue-500 w-48 h-48 rounded opacity-60"></div>
            </div>
          </div>
          
          {/* File Upload */}
          <div className="w-full max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-sm mb-6">
            <label className="block text-lg font-semibold text-blue-600 mb-2">Upload QR Code Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="block w-full text-sm border border-gray-300 rounded p-2 bg-white"
              disabled={isLoading}
            />
          </div>

          {/* Results Section */}
          <div className="max-w-md mx-auto space-y-4">
            {/* URL Display */}
            {url && (
              <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-blue-600">URL Detected:</p>
                <p className="text-gray-700 break-words mt-1">{url}</p>
              </div>
            )}
            
            {/* Loading Spinner */}
            {isLoading && <LoadingSpinner />}
            
            {/* Analysis Results */}
            {result && !isLoading && (
              <div className={`p-5 ${result.is_phishing ? 'bg-red-50' : 'bg-green-50'} rounded-lg shadow-sm`}>
                <p className="text-xl font-bold mb-3 text-center">
                  {result.is_phishing ? '⚠️ PHISHING DETECTED' : '✅ LEGITIMATE URL'}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                    <p className="text-lg font-medium">Classification:</p>
                    <p className={`font-bold ${result.is_phishing ? 'text-red-600' : 'text-green-600'}`}>
                      {result.classification}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                    <p className="text-lg font-medium">Confidence:</p>
                    <p className="font-bold">{(result.confidence * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Display */}
            {error && !isLoading && (
              <div className="p-4 bg-red-50 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-red-600">Error:</p>
                <p className="text-gray-700 mt-1">{error}</p>
              </div>
            )}
            
            {/* Reset Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={resetScanner}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Reset Scanner'}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Navigation Links */}
      <section className="py-8 px-6 flex justify-center space-x-6">
        <Link href="/">
          <div className="p-4 w-64 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-600">🏠 Back to Home</h3>
            <p className="text-gray-700 mt-2">
              Return to the PhishShield homepage.
            </p>
          </div>
        </Link>
        
        <Link href="/documentation">
          <div className="p-4 w-64 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-green-600">📖 Documentation</h3>
            <p className="text-gray-700 mt-2">
              Learn how to integrate this QR scanner in your app.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}