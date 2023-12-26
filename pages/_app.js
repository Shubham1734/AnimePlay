import "@/styles/globals.scss";
import Head from "next/head";
import { useEffect, useState, createContext } from "react";
import LoginSignUp from "@/components/LoginSignUp/LoginSignUp";

export const GlobalVariables = createContext();

export default function App({ Component, pageProps }) {
  const [ClientData, setClientData] = useState({});
  const [AvatarCollection, setAvatarCollection] = useState([
    "/profile-pic2.gif",
    "/profile-pic3.gif",
    "/profile-pic4.gif",
    "/profile-pic5.gif",
    "/profile-pic6.gif",
    "/profile-pic7.gif",
  ]);

  useEffect(() => {
    if (localStorage.ClientData === undefined || localStorage.ClientData === "")
      localStorage.setItem("ClientData", "{}");
    else console.log(localStorage.ClientData);

    setClientData(JSON.parse(localStorage.ClientData));
  }, []);

  useEffect(() => {
    console.log(ClientData);
    localStorage.setItem("ClientData", JSON.stringify(ClientData));
  }, [ClientData]);

  return (
    <GlobalVariables.Provider
      value={{
        ClientData: ClientData,
        setClientData: setClientData,
        AvatarCollection,
      }}
    >
      {Object.keys(ClientData).length !== 0 ? (
        <Component {...pageProps} />
      ) : (
        <>
          <Head>
            <title>AnimixPlay</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <LoginSignUp
            ClientData={ClientData}
            setClientData={setClientData}
            AvatarCollection={AvatarCollection}
          />
        </>
      )}
    </GlobalVariables.Provider>
  );
}
