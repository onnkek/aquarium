declare module '*.svg' {
  import React from 'react';
  const SVG: string | undefined
  export default SVG;
}

declare module "*.png" {
  const value: any;
  export default value;
}
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}