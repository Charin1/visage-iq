import React, { useEffect, useRef } from 'react';

export default function FacialHUD({ imageSrc, meshPoints, showMesh = true, activeOverlay }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!meshPoints || meshPoints.length === 0 || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    const renderOverlay = () => {
      const w = img.clientWidth;
      const h = img.clientHeight;
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw facial symmetry center vertical axis line
      if (showMesh) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Draw 3D MediaPipe Mesh Points with cyan glow
        meshPoints.forEach((pt) => {
          const x = pt.x * w;
          const y = pt.y * h;

          ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });

        // 3. Highlight key landmark nodes (Eyes, Nose, Chin) in neon purple
        const keyLandmarkIds = [33, 263, 1, 61, 291, 152, 234, 454];
        meshPoints.forEach((pt) => {
          if (keyLandmarkIds.includes(pt.id)) {
            const x = pt.x * w;
            const y = pt.y * h;

            ctx.fillStyle = '#FF7E5F';
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // 4. Render Virtual AI Try-On Canvas Accessories
      if (activeOverlay) {
        const ptMap = {};
        meshPoints.forEach((pt) => {
          ptMap[pt.id] = { x: pt.x * w, y: pt.y * h };
        });

        const eyeL = ptMap[33] || { x: w * 0.35, y: h * 0.44 };
        const eyeR = ptMap[263] || { x: w * 0.65, y: h * 0.44 };
        const nose = ptMap[1] || { x: w * 0.5, y: h * 0.55 };
        const chin = ptMap[152] || { x: w * 0.5, y: h * 0.78 };
        const jawL = ptMap[234] || { x: w * 0.28, y: h * 0.50 };
        const jawR = ptMap[454] || { x: w * 0.72, y: h * 0.50 };
        const topHead = ptMap[10] || { x: w * 0.5, y: h * 0.28 };

        // --- Render Glasses Frame ---
        if (activeOverlay.show_glasses) {
          const eyeDist = Math.hypot(eyeR.x - eyeL.x, eyeR.y - eyeL.y);
          const glassRadius = eyeDist * 0.32;

          ctx.strokeStyle = '#F59E0B';
          ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
          ctx.lineWidth = 3;

          // Left Lens
          ctx.beginPath();
          if (activeOverlay.glasses_style === 'aviator') {
            ctx.ellipse(eyeL.x, eyeL.y + 4, glassRadius, glassRadius * 1.15, 0, 0, 2 * Math.PI);
          } else {
            ctx.arc(eyeL.x, eyeL.y, glassRadius, 0, 2 * Math.PI);
          }
          ctx.fill();
          ctx.stroke();

          // Right Lens
          ctx.beginPath();
          if (activeOverlay.glasses_style === 'aviator') {
            ctx.ellipse(eyeR.x, eyeR.y + 4, glassRadius, glassRadius * 1.15, 0, 0, 2 * Math.PI);
          } else {
            ctx.arc(eyeR.x, eyeR.y, glassRadius, 0, 2 * Math.PI);
          }
          ctx.fill();
          ctx.stroke();

          // Bridge Line
          ctx.beginPath();
          ctx.moveTo(eyeL.x + glassRadius, eyeL.y);
          ctx.lineTo(eyeR.x - glassRadius, eyeR.y);
          ctx.stroke();
        }

        // --- Render Haircut Volume Contour ---
        if (activeOverlay.show_haircut) {
          ctx.strokeStyle = '#F43F5E';
          ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
          ctx.lineWidth = 3.5;

          ctx.beginPath();
          ctx.moveTo(jawL.x - 10, jawL.y - 30);
          ctx.quadraticCurveTo(topHead.x, topHead.y - 50, jawR.x + 10, jawR.y - 30);
          ctx.quadraticCurveTo(topHead.x, topHead.y + 10, jawL.x - 10, jawL.y - 30);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // --- Render Beard Trim Contour ---
        if (activeOverlay.show_beard) {
          ctx.strokeStyle = '#06B6D4';
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.moveTo(jawL.x, jawL.y);
          ctx.quadraticCurveTo(chin.x, chin.y + 20, jawR.x, jawR.y);
          ctx.quadraticCurveTo(nose.x, nose.y + 35, jawL.x, jawL.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    };

    if (img.complete) {
      renderOverlay();
    } else {
      img.onload = renderOverlay;
    }

    window.addEventListener('resize', renderOverlay);
    return () => window.removeEventListener('resize', renderOverlay);
  }, [imageSrc, meshPoints, showMesh, activeOverlay]);

  return (
    <div className="hud-canvas-wrapper">
      <img ref={imageRef} src={imageSrc} alt="Portrait face analysis" />
      <canvas ref={canvasRef} />
    </div>
  );
}
