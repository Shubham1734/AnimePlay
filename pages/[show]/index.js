import React from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Show.module.scss";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { GlobalVariables } from "../_app";
import { useContext } from "react";
import ShowCollection from "@/components/ShowCollection/ShowCollection";

const removeValue = (arr, value) => {
  const filteredArray = arr.filter((item) => {
    return item !== value;
  });
  return filteredArray;
};

const show = () => {
  const [SuggestionsCollection, setSuggestionsCollection] = useState([]);

  const [PageNotFound, setPageNotFound] = useState(false);
  const { ClientData, setClientData, AvatarCollection } =
    useContext(GlobalVariables);

  const [ShowData, setShowData] = useState({
    showId: "",
    poster: "",
    title: "",
    description: "",
    Languages: [],
    aired: "",
    avgDuration: "",
    MAL_score: "",
    Tags: [],
    studios: [],
    Producers: [],
    episodes: [],
  });
  const router = useRouter();

  useEffect(() => {
    const showId = router.query.show;

    try {
      console.log({ showId });

      if (showId !== undefined) {
        axios
          .post("/api/get-show", {
            showId: showId,
          })
          .then(function (response) {
            console.log(response.data.show[0]);
            if (response.data.show[0] === undefined) setPageNotFound(true);
            setShowData(response.data.show[0]);

            // Getting Updated user data
            axios
              .post("/api/get-user", {
                username: ClientData.username,
                password: ClientData.password,
              })
              .then(function (response) {
                setClientData(response.data[0]);
                console.log(ClientData);

                // Getting Updated user data
                axios
                  .post("/api/update-user", {
                    username: ClientData.username,
                    password: ClientData.password,
                    update: {
                      RecentlyVisited: [
                        ...new Set([
                          router.query.show,
                          ...ClientData.RecentlyVisited,
                        ]),
                      ],
                    },
                  })
                  .then(function (response) {
                    setClientData({ ...ClientData, ...response.data.New[0] });
                  })
                  .catch(function (error) {
                    setClientData({});
                    console.log(error);
                    alert("Error Authentication, Please Login Again");
                  })
                  .finally(function () {});
              })
              .catch(function (error) {
                setClientData({});
                console.log(error);
                alert("Error Authentication, Please Login Again");
              })
              .finally(function () {});
          })
          .catch(function (error) {
            setPageNotFound(true);
            console.log(error);
          })
          .finally(function () {});
      }
    } catch (error) {
      setPageNotFound(true);
      console.log({ error });
    }
  }, [router.query]);

  const AddToList = (showId) => {
    // Getting Updated user data
    axios
      .post("/api/get-user", {
        username: ClientData.username,
        password: ClientData.password,
      })
      .then(function (response) {
        setClientData(response.data[0]);
        console.log(ClientData);

        // Getting Updated user data
        axios
          .post("/api/update-user", {
            username: ClientData.username,
            password: ClientData.password,
            update: {
              WatchList: !ClientData.WatchList.includes(router.query.show)
                ? [...new Set([router.query.show, ...ClientData.WatchList])]
                : removeValue(ClientData.WatchList, router.query.show),
            },
          })
          .then(function (response) {
            if (!ClientData.WatchList.includes(router.query.show)) {
              setClientData({ ...ClientData, ...response.data.New[0] });
            } else {
              setClientData({
                ...ClientData,
                WatchList: removeValue(ClientData.WatchList, router.query.show),
              });
            }
          })
          .catch(function (error) {
            setClientData({});
            console.log(error);
            alert("Error Authentication, Please Login Again");
          })
          .finally(function () {});
      })
      .catch(function (error) {
        setClientData({});
        console.log(error);
        alert("Error Authentication, Please Login Again");
      })
      .finally(function () {});
  };

  useEffect(() => {
    axios
      .get("/api/get-shows")
      .then(function (response) {
        console.log(response.data.show);
        setSuggestionsCollection(response.data.show);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, []);

  return PageNotFound ? (
    <>PageNotFound</>
  ) : (
    <>
      <Navbar
        style={{
          position: "static",
          backgroundColor: "#2a2c31",
          background: "url(/FooterBg.jpg)",
        }}
      />
      <main
        className={styles.main}
        style={{ backgroundImage: `url(${ShowData.poster})` }}
      >
        <div>
          <div className={styles.col1}>
            <div className={styles.Poster}>
              <img src={ShowData && ShowData.poster} alt="" />
            </div>
            <div className={styles.Details}>
              <h1>{ShowData && ShowData.title}</h1>
              <div className={styles.DetailsButton}>
                <Link
                  href={`${ShowData && ShowData.showId}/ep-1`}
                  className={styles.WatchNowButton}
                >
                  &#9654; Watch Now
                </Link>
                <button className={styles.AddListButton} onClick={AddToList}>
                  {ClientData.WatchList.includes(router.query.show) ? (
                    <>
                      <b>-</b> Remove from List
                    </>
                  ) : (
                    <>
                      <b>+</b> Add to List
                    </>
                  )}
                </button>
              </div>
              <div className={styles.Description}>
                {ShowData && ShowData.description}
              </div>
            </div>
          </div>
          <div className={styles.col2}>
            <div>
              <div className={styles.title}>Language Type:</div>{" "}
              <div>
                {ShowData &&
                  ShowData.Languages.map((item, index) => {
                    return <>{item}, </>;
                  })}
              </div>
            </div>
            <div>
              <div className={styles.title}>Aired:</div> <div>Apr 6, 2023</div>
            </div>
            <div>
              <div className={styles.title}>Score:</div> <div>8.72</div>
            </div>
            <hr />
            <div>
              <div className={styles.title}>Genres:</div>{" "}
              <div className={styles.GenresCollection}>
                {ShowData &&
                  ShowData.Tags.map((item) =>
                    item !== "" ? <div>{item}</div> : ""
                  )}
              </div>
            </div>
            <hr />
            <div>
              <div className={styles.title}>Studios:</div>{" "}
              <div>
                {ShowData && ShowData.studios.map((item) => <>{item}, </>)}
              </div>
            </div>
            <div>
              <div className={styles.title}>Producers:</div>{" "}
              <div>
                {ShowData && ShowData.Producers.map((item) => <>{item}, </>)}
              </div>
            </div>
          </div>
        </div>
      </main>
      <br />
      <h2
        style={{
          width: "95vw",
          margin: "1rem auto",
          color: "#cae962",
        }}
      >
        Suggestions
      </h2>
      <ShowCollection
        ShowList={SuggestionsCollection}
        CrossButtonStatus={false}
        CrossButtonFunction={() => {}}
        maxWidth={"92vw"}
      />
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default show;
