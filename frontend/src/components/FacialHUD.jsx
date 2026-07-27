import React, { useEffect, useRef } from 'react';

export default function FacialHUD({ imageSrc, meshPoints, showMesh = true }) {
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

      if (!showMesh) return;

      // 1. Draw facial symmetry center vertical axis line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
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

        ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
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

          ctx.fillStyle = '#C4B5FD';
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      });
    };

    if (img.complete) {
      renderOverlay();
    } else {
      img.onload = renderOverlay;
    }

    window.addEventListener('resize', renderOverlay);
    return () => window.removeEventListener('resize', renderOverlay);
  }, [imageSrc, meshPoints, showMesh]);

  return (
    <div className="hud-canvas-wrapper">
      <img ref={imageRef} src={imageSrc} alt="Portrait face analysis" />
      <canvas ref={canvasRef} />
    </div>
  );
}
