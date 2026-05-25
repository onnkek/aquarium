import { useEffect } from "react";

export const useBodyScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      // Сохраняем текущий стиль, чтобы вернуть его потом
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Блокируем скролл
      document.body.style.overflow = "hidden";
      
      return () => {
        // Возвращаем исходный стиль при размонтировании или отключении блокировки
        document.body.style.overflow = originalStyle;
      };
    }
  }, [lock]);
};