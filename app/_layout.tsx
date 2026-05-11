import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>Riff Records</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=riff-records" />
        <style>{`
          html,
          body,
          #root {
            max-width: 100%;
            overflow-x: hidden;
            width: 100%;
          }

          #auth-shell,
          #auth-hero,
          #auth-form-pane,
          #auth-form-content {
            box-sizing: border-box !important;
            max-width: 100%;
          }

          #auth-hero-subtitle,
          #auth-subtitle {
            overflow-wrap: break-word;
          }

          @media (min-width: 900px) {
            #auth-shell {
              flex-direction: row !important;
              min-height: 100% !important;
              padding-bottom: 0 !important;
            }

            #auth-hero {
              align-self: stretch !important;
              height: auto !important;
              min-height: 760px !important;
              width: 58% !important;
            }

            #auth-hero-image {
              width: 100% !important;
            }

            #auth-hero-copy {
              padding: 42px 44px !important;
            }

            #auth-hero-title {
              font-size: 48px !important;
              line-height: 54px !important;
            }

            #auth-hero-subtitle {
              font-size: 18px !important;
              line-height: 28px !important;
              margin-top: 18px !important;
            }

            #auth-form-pane {
              align-self: stretch !important;
              flex: 1 1 0% !important;
              padding: 44px 24px !important;
              width: 100% !important;
            }

            #auth-form-content {
              max-width: 470px !important;
              width: 100% !important;
            }

            #auth-brand-mark {
              height: 84px !important;
              width: 84px !important;
            }

            #auth-title {
              font-size: 42px !important;
              line-height: 48px !important;
            }
          }

          @media (max-width: 899px) {
            #auth-shell {
              flex-direction: column !important;
              max-width: 100vw !important;
              min-height: auto !important;
              overflow-x: hidden !important;
              padding-bottom: 28px !important;
              width: 100vw !important;
            }

            #auth-hero {
              height: 320px !important;
              min-height: 0 !important;
              max-width: 100vw !important;
              width: 100% !important;
            }

            #auth-hero-image {
              width: 100% !important;
            }

            #auth-hero-copy {
              padding: 30px 24px !important;
            }

            #auth-hero-title {
              font-size: 34px !important;
              line-height: 40px !important;
            }

            #auth-form-pane {
              align-self: center !important;
              flex: 0 1 auto !important;
              max-width: 100vw !important;
              padding: 44px 24px !important;
              width: 100% !important;
            }

            #auth-form-content {
              max-width: min(470px, calc(100vw - 48px)) !important;
              width: 100% !important;
            }
          }

          @media (max-width: 559px) {
            #auth-hero {
              height: 280px !important;
            }

            #auth-hero-copy {
              padding: 24px 20px !important;
            }

            #auth-hero-title {
              font-size: 28px !important;
              line-height: 34px !important;
            }

            #auth-hero-subtitle {
              font-size: 14px !important;
              line-height: 21px !important;
              margin-top: 12px !important;
            }

            #auth-form-pane {
              padding: 30px 20px !important;
            }

            #auth-form-content {
              max-width: calc(100vw - 40px) !important;
            }

            #auth-brand-mark {
              height: 70px !important;
              width: 70px !important;
            }

            #auth-title {
              font-size: 32px !important;
              line-height: 38px !important;
            }
          }

          @media (max-width: 429px) {
            #auth-hero {
              height: 260px !important;
            }

            #auth-hero-copy {
              max-width: 188px !important;
              padding: 22px 18px !important;
              width: 188px !important;
            }

            #auth-hero-title {
              font-size: 24px !important;
              line-height: 30px !important;
              max-width: 176px !important;
            }

            #auth-hero-subtitle {
              font-size: 13px !important;
              line-height: 20px !important;
              max-width: 176px !important;
            }

            #auth-form-pane {
              padding: 28px 18px !important;
            }

            #auth-form-content {
              max-width: calc(100vw - 36px) !important;
            }

            #auth-title {
              font-size: 30px !important;
              line-height: 36px !important;
            }
          }
        `}</style>
      </Head>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F6EFE3" },
        }}
      />
    </>
  );
}
