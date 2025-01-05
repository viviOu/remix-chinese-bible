import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { StyleProvider, createCache } from '@ant-design/cssinjs';

const cache = createCache();

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider(props: Readonly<ClientCacheProviderProps>) {
  const { children } = props;
  return (
    <StyleProvider cache={cache} hashPriority="high">
      {children}
    </StyleProvider>
  );
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
);
