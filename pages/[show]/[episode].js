import React, { useState ,useRef} from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/VideoStream.module.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import ShowCollection from "@/components/ShowCollection/ShowCollection";
import { GlobalVariables } from "../_app";
import { useContext } from "react";
// import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import crypto from 'crypto';
const VideoStream = () => {
  
  const [SuggestionsCollection, setSuggestionsCollection] = useState([]);
  // const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);
  useEffect(() => {
    console.log("SGG", SuggestionsCollection);
  }, [SuggestionsCollection]);
  const { ClientData, setClientData, AvatarCollection } =
    useContext(GlobalVariables);
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
                ...new Set([router.query.show, ...ClientData.RecentlyVisited]),
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
  }, []);

  const [PageNotFound, setPageNotFound] = useState(false);
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
  const [currentEpisode, setCurrentEpisode] = useState(-1);
  const [VideoUrl, setVideoUrl] = useState("");
  const [EpisodeList, setEpisodeList] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const episodeName = router.query.episode;
    const showId = router.query.show;

    try {
      if (showId !== undefined) {
        if (episodeName.substring(0, 3) === "ep-") {
          console.log({ showId, episodeName });
          const epNo = parseInt(episodeName.substring(3));
          setCurrentEpisode(epNo - 1);

          axios
            .post("/api/get-show", {
              showId: showId,
            })
            .then(function (response) {
              console.log(response.data.show[0]);
              if (response.data.show[0] === undefined) setPageNotFound(true);
              if (epNo > response.data.show[0].episodes.length || epNo < 1)
                setPageNotFound(true);
              setShowData(response.data.show[0]);
              setVideoUrl(response.data.show[0].episodes[epNo - 1]);
              setEpisodeList(response.data.show[0].episodes);
            })
            .catch(function (error) {
              setPageNotFound(true);
              console.log(error);
            })
            .finally(function () {});
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [router.query]);

  useEffect(() => {
    console.log({ VideoUrl });
  }, [VideoUrl]);
  // for local storage
  const handleVideoPause = () => {
    const currentTime = document.querySelector("video").currentTime;
    localStorage.setItem("videoTimestamp", currentTime);
  };
  const handleVideoPlay = () => {
    const videoElement = document.querySelector("video");
    const storedTimestamp = localStorage.getItem("videoTimestamp");

    if (videoElement && storedTimestamp) {
      videoElement.currentTime = parseFloat(storedTimestamp);
    }

    // Trigger play
    if (videoElement && videoElement.paused) {
      videoElement.play();
    }
  };
  useEffect(() => {
    const storedTimestamp = localStorage.getItem("videoTimestamp");
    const videoElement = document.querySelector("video");
  
    if (videoElement && storedTimestamp) {
      videoElement.currentTime = parseFloat(storedTimestamp);
    }
  }, []);

  
  return PageNotFound ? (
    <>PageNotFound</>
  ) : (
    <>
      <Head>
        <title>AnimixPlay</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          <div className={styles.EpisodeList}>
            <h2>List of Episodes:</h2>
            <div>
              {EpisodeList.map((item, index) => {
                return (
                  <Link
                    href={`/${ShowData.showId}/ep-${index + 1}`}
                    className={
                      styles.Episode +
                      " " +
                      (index === currentEpisode && styles.ActiveEpisode)
                    }
                  >
                    Episode {index + 1}
                    {index === currentEpisode && <span>&#9654;</span>}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className={styles.VideoBox}>
            {/* for localstorage */}
             {VideoUrl !== "" && (
              <video autoPlay muted loop controls onPause={handleVideoPause} onPlay = {handleVideoPlay}>
              <source src={VideoUrl} type="video/mp4" />
            </video>
            )}           
            <div style={{ textAlign: "center" }}>
              <div>You are watching</div>
              <b>Episode {currentEpisode + 1}</b>
            </div>
          </div>
          <div className={styles.DetailBox}>
            <img src={ShowData.poster} alt="" />
            <h1>{ShowData.title}</h1>
            <div>{ShowData.description}</div>
            <Link href={`/${router.query.show}`}>View Details</Link>
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
      <Footer />
    </>
  );
};

export default VideoStream;
