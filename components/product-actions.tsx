"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, CalendarDays, Maximize2, RotateCcw, X } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductActions({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <div className="detail-actions">
        <button onClick={() => setViewerOpen(true)}>
          <Camera size={18} />
          View in room
        </button>
        <button
          className="secondary-detail-button"
          onClick={() => {
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
          }}
        >
          <CalendarDays size={18} />
          Request details
        </button>
        <button className="secondary-detail-button">Book consultation</button>
      <AnimatePresence>
        {added && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            We will prepare consultation notes for {product.name}.
          </motion.p>
        )}
      </AnimatePresence>
      </div>

      <RoomPreviewModal
        product={product}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}

function RoomPreviewModal({
  product,
  open,
  onClose
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, x: 0, y: 0 });
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [placement, setPlacement] = useState({ x: 50, y: 58, scale: 1, rotate: 0, opacity: 92 });

  useEffect(() => {
    if (!open) {
      stopCamera();
      return;
    }

    let cancelled = false;

    async function startCamera() {
      setCameraError("");
      setCameraReady(false);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera preview is not supported in this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (error) {
        setCameraError(
          error instanceof Error
            ? error.message
            : "Camera permission was blocked. Please allow camera access to preview the furniture."
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [open]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }

  function updatePlacement(key: "scale" | "rotate" | "opacity", value: number) {
    setPlacement((current) => ({ ...current, [key]: value }));
  }

  function resetPlacement() {
    setPlacement({ x: 50, y: 58, scale: 1, rotate: 0, opacity: 92 });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      x: placement.x,
      y: placement.y
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag.active) {
      return;
    }

    const rect = event.currentTarget.parentElement?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const nextX = drag.x + ((event.clientX - drag.startX) / rect.width) * 100;
    const nextY = drag.y + ((event.clientY - drag.startY) / rect.height) * 100;

    setPlacement((current) => ({
      ...current,
      x: Math.max(12, Math.min(88, nextX)),
      y: Math.max(18, Math.min(88, nextY))
    }));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="room-preview-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="room-preview-modal"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
          >
            <div className="room-preview-head">
              <div>
                <p className="eyebrow">Live room preview</p>
                <h2>{product.name}</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close room preview">
                <X size={20} />
              </button>
            </div>

            <div className="room-preview-stage">
              <video ref={videoRef} muted playsInline />
              {!cameraReady && !cameraError && (
                <div className="camera-state">
                  <Camera size={28} />
                  <span>Starting camera...</span>
                </div>
              )}
              {cameraError && (
                <div className="camera-state">
                  <Camera size={28} />
                  <span>{cameraError}</span>
                  <small>Use localhost or HTTPS and allow camera access in the browser.</small>
                </div>
              )}
              <div className="placement-guide" />
              <div
                className="room-product"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  left: `${placement.x}%`,
                  top: `${placement.y}%`,
                  opacity: placement.opacity / 100,
                  transform: `translate(-50%, -50%) scale(${placement.scale}) rotate(${placement.rotate}deg)`
                }}
              >
                <img src={product.image} alt={`${product.name} preview`} draggable={false} />
                <span>Drag me</span>
              </div>
            </div>

            <div className="room-preview-controls">
              <label>
                <Maximize2 size={17} />
                Scale
                <input
                  type="range"
                  min="0.55"
                  max="1.8"
                  step="0.05"
                  value={placement.scale}
                  onChange={(event) => updatePlacement("scale", Number(event.target.value))}
                />
              </label>
              <label>
                <RotateCcw size={17} />
                Rotate
                <input
                  type="range"
                  min="-28"
                  max="28"
                  step="1"
                  value={placement.rotate}
                  onChange={(event) => updatePlacement("rotate", Number(event.target.value))}
                />
              </label>
              <label>
                <Camera size={17} />
                Opacity
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={placement.opacity}
                  onChange={(event) => updatePlacement("opacity", Number(event.target.value))}
                />
              </label>
              <button onClick={resetPlacement}>
                <RotateCcw size={17} />
                Reset
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
