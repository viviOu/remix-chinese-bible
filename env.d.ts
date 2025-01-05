/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />
/// <reference types="react" />

declare module '*.json' {
  const value: any;
  export default value;
}