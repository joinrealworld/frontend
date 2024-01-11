import './globals.css';
import { StoreProvider, PersistGateProvider } from '@/redux/providers';

import { appName } from "@/constant/global";

export const metadata = {
  title: appName
}

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" /> */}

        </head>
        <body>
          <PersistGateProvider>
            <main>{children}</main>
          </PersistGateProvider>
        </body>
      </html>
    </StoreProvider>
  )
}
