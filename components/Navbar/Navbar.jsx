import styles from "./Navbar.module.scss";
import Link from "next/link";
import { GlobalVariables } from "@/pages/_app";
import { useContext, useEffect, useRef, useState } from "react";

const Navbar = (props) => {
  const { ClientData, setClientData, AvatarCollection } =
    useContext(GlobalVariables);
  const ProfileDropDown = useRef();
  const ProfileImg = useRef();
  const DropDownRef = useRef(null);
  const [SearchText, setSearchText] = useState("");

  useEffect(() => {
    window.addEventListener("mousedown", (e) => {
      if (DropDownRef.current) {
        if (!ProfileDropDown.current.contains(e.target)) {
          DropDownRef.current.classList.remove(styles.DropDownActive);
        }
      }
    });

    window.addEventListener("scroll", () => {
      if (Object.keys(props.style).length === 0) {
        if (document.querySelector("." + styles.Navbar)) {
          if (window.scrollY > 50) {
            document.querySelector("." + styles.Navbar).style.backgroundColor =
              "#2a2c31";
          } else {
            document.querySelector("." + styles.Navbar).style.backgroundColor =
              "transparent";
          }
        }
      }
    });
  }, []);

  useEffect(() => {}, []);

  return (
    <div className={styles.Navbar} style={props.style}>
      <Link href={"/"} className={styles.Logo}>
        AnimixPlay
      </Link>

      <div className={styles.ProfileDropDown} ref={ProfileDropDown}>
        <img
          src={AvatarCollection[ClientData.profile_image_index]}
          alt=""
          onClick={() => {
            DropDownRef.current.classList.toggle(styles.DropDownActive);
          }}
          ref={ProfileImg}
        />

        <div className={styles.DropDown} ref={DropDownRef}>
          <div>{`${ClientData.first_name} ${ClientData.last_name}`}</div>
          <Link
            href={"/"}
            onClick={() => {
              DropDownRef.current.classList.remove(styles.DropDownActive);
            }}
          >
            Home
          </Link>
          <Link
            href={"/my-profile"}
            onClick={() => {
              DropDownRef.current.classList.remove(styles.DropDownActive);
            }}
          >
            My Profile
          </Link>
          <Link
            href={"/watch-list"}
            onClick={() => {
              DropDownRef.current.classList.remove(styles.DropDownActive);
            }}
          >
            Watch List
          </Link>
          <Link
            href={"/recently-visited"}
            onClick={() => {
              DropDownRef.current.classList.remove(styles.DropDownActive);
            }}
          >
            Recenty Visited
          </Link>

          <button onClick={() => setClientData({})}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
