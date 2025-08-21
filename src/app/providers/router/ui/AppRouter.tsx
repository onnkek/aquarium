import { AppRoutesProps, routeConfig } from "shared/config/routeConfig/routeConfig";
import { memo, Suspense, useCallback } from "react";
import { Route, Routes } from 'react-router-dom';



const AppRouter = () => {

  const renderWithWrapper = useCallback((route: AppRoutesProps) => {
    const element = (
      <Suspense fallback={<h1 style={{ color: "white", margin: 0 }}>LOADING</h1>}>
        {route.element}
      </Suspense>
    );

    return (< Route
      key={route.path}
      path={route.path}
      element={element}
    />);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {Object.values(routeConfig).map(renderWithWrapper)}
      </Routes>
    </Suspense>
  );
};

export default memo(AppRouter);