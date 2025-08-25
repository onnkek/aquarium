import { useEffect, useRef, useState } from "react";

export function useChartZoom({
  min = 200,
  max = 5000,
  step = 20,
  defaultWidth = 0
} = {}) {
  const [size, setSize] = useState(defaultWidth);
  const lastDistance = useRef<number | null>(null);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      setSize(prev => {
        const base = prev || window.innerWidth;
        let next = base + (e.deltaY < 0 ? step : -step);
        if (next < min) next = min;
        if (next > max) next = max;
        return next;
      });
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;

      const [t1, t2] = e.touches;
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (lastDistance.current != null) {
        setSize(prev => {
          const base = prev || window.innerWidth;
          let next = base + (distance - lastDistance.current!);
          if (next < min) next = min;
          if (next > max) next = max;
          return next;
        });
      }
      lastDistance.current = distance;
    }
    const touchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) lastDistance.current = null;
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("touchcancel", touchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
    }
  }, [min, max, step]);
  return size;
}