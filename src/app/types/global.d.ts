declare module '*.sass' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.module.sass' {
  const classNames: Record<string, string>;
  export default classNames;
}
declare module '*.module.css';

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.webp';

declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare const __IS_DEV__: boolean;
declare const __API__: string;
declare const __PROJECT__: 'storybook' | 'frontend' | 'jest';
declare const __APP_VERSION__: string;

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T;
}