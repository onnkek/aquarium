import { ArchivePage } from "pages/ArchivePage";
import { DashboardPage } from "pages/DashboardPage";
import { LogsPage } from "pages/LogsPage";
import { RouteProps } from 'react-router-dom';

export type AppRoutesProps = RouteProps & {
  // authOnly?: boolean;
  // roles?: UserRole[];
}

export enum AppRoutes {
  DASHBOARD = 'dashboard',
  LOGS = 'logs',
  ARCHIVE = 'archive',
  NOT_FOUND = 'not_found'
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.DASHBOARD]: '/',
  [AppRoutes.LOGS]: '/logs',
  [AppRoutes.ARCHIVE]: '/archive',
  [AppRoutes.NOT_FOUND]: '*'
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.DASHBOARD]: {
    path: RoutePath.dashboard,
    element: <DashboardPage />
  },
  [AppRoutes.LOGS]: {
    path: RoutePath.logs,
    element: <LogsPage />
  },
  [AppRoutes.ARCHIVE]: {
    path: RoutePath.archive,
    element: <ArchivePage />
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <h1 style={{ color: "white", margin: 0 }}>Not found</h1>
  },
};