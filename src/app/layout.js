import { StoreProvider, PersistGateProvider, NextUIProviderWrap } from '@/redux/providers';

import { appName } from "@/constant/global";
import "@/app/styles.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import "./globals.css";
import ThemeContext from "@/themes/ThemeContext";
import StoreColor from "@/themes/StoreColor";
import { SoundProvider } from '@/components/SoundContext';

export const metadata = {
  title: appName
}

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>

          <meta charSet="UTF-8" />
          <title>Real World Portal</title>

          <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="robots" content="noindex, nofollow" />

          <link rel="manifest" href="/assets/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/assets/logo-256.png" />
          <link rel="favicon" href="/assets/logo-256.png" />

          {/* <script type="text/javascript" async="" src="https://widget.intercom.io/widget/z3s8zv7r"></script> */}
          <style data-styled="active" data-styled-version="5.3.11"></style>
        </head>
        <body>
          <PersistGateProvider>
            <NextUIProviderWrap>
              <ThemeContext>
                <SoundProvider>
                  <main>{children}</main>
                </SoundProvider>
                <StoreColor />
              </ThemeContext>
            </NextUIProviderWrap>
          </PersistGateProvider>

          <ToastContainer
            position="top-center"
            autoClose={1200}
            hideProgressBar
            newestOnTop={true}
            closeOnClick
            closeButton={<X color='white' size={17} />}
            rtl={false}
            pauseOnFocusLoss
            toastStyle={{
              backgroundColor: '#b78727',
              color: 'white',
            }}
            draggable
            pauseOnHover
          />

          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" async integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" async integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" async integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossOrigin="anonymous"></script>

          <script src="https://player.vimeo.com/api/player.js" async></script>
        </body>
      </html>
    </StoreProvider>
  );
}
