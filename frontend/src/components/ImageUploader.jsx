import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Camera, Sparkles, AlertCircle, RefreshCw, X, Circle } from 'lucide-react';

export default function ImageUploader({ onImageSelected, onRunDemo, isLoading }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // Stop camera tracks on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stream]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setStream(mediaStream);
      setIsCameraActive(true);

      // Connect stream to video element when mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Camera access denied or unavailable. Please check permissions or upload an image file.');
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // Mirror horizontal display for natural selfie camera capture
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      handleStopCamera();
      onImageSelected(file, dataUrl);
    }, 'image/jpeg', 0.92);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSelect(file);
  };

  const validateAndSelect = (file) => {
    setErrorMsg(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      onImageSelected(file, evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Upload or Capture Portrait Photo</h3>
        {!isCameraActive ? (
          <button
            className="btn-secondary"
            onClick={startCamera}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Camera size={15} color="var(--accent-purple)" /> Take Photo via Camera
          </button>
        ) : (
          <button
            className="btn-secondary"
            onClick={handleStopCamera}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#F87171' }}
          >
            <X size={15} /> Cancel Camera
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
        Select a clear front-facing portrait or use your camera to run 3D landmark mesh extraction.
      </p>

      {/* Hidden Offscreen Canvas for Snapshot Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {isCameraActive ? (
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#000',
          border: '2px solid var(--accent-purple)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Mirrored Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              maxHeight: '420px',
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }}
          />

          {/* Alignment Crosshair Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '240px',
            border: '2px dashed rgba(6, 182, 212, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          {/* Camera Controls Bar */}
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <button
              className="btn-primary"
              onClick={capturePhoto}
              style={{
                padding: '0.75rem 1.75rem',
                fontSize: '1rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
              }}
            >
              <Circle size={18} fill="#FFF" /> Capture Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`dropzone-container ${isDragActive ? 'drag-active' : ''}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <UploadCloud className="dropzone-icon" />
          <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
            Drag & drop your photo here, or <span style={{ color: 'var(--accent-purple)' }}>browse</span>
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Supports JPG, PNG, WebP (Max 15MB) — 100% processed locally
          </p>
        </div>
      )}

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#F87171',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginTop: '1rem',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Don't have an image ready?</span>
        <button
          className="btn-secondary"
          onClick={onRunDemo}
          disabled={isLoading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Sparkles size={14} color="var(--accent-cyan)" />
          Run Synthetic Demo
        </button>
      </div>
    </div>
  );
}
