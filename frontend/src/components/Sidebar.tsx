import React, { useEffect, useState } from "react";
import { home, logout, settings, wallet } from "../assets";
import { Link, useLocation } from "react-router-dom";
import { activeBgColor } from "../utils";
import Logo from "./Logo";
import { useAccount, useReadContract } from "wagmi";
import { useWasteWiseContext } from "../context";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../../constants";
import { MdEventNote, MdAdminPanelSettings } from "react-icons/md";
import {
  FaBuildingCircleArrowRight,
  FaCartArrowDown,
  FaCartPlus,
  FaChartArea,
  FaHouseLaptop,
  FaLayerGroup,
  FaPeopleGroup,
  FaRecycle,
  FaUserShield,
  FaWallet,
} from "react-icons/fa6";
import { Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { LucideCandlestickChart } from "lucide-react";

type Props = {};

interface datap {
  id: bigint;
  userAddr: string;
  name: string;
  role: number;
  timeJoined: bigint;
}

const Sidebar = (props: Props) => {
  const [isActive, setIsActive] = useState("");
  const location = useLocation();
  const [company, setCompany] = useState<any>();
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const { data, isLoading, isSuccess } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getCompany",
    account: address,
  });
  console.log("Current user", currentUser);

  useEffect(() => {
    if (isSuccess) {
      setCompany(data as any);
    }
  }, [isSuccess, isLoading]);

  // update activeItem based on current locati
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setIsActive("dashboard");
    } else if (location.pathname === "/dashboard/wallet") {
      setIsActive("wallet");
    } else if (location.pathname === "/dashboard/leaderboard") {
      setIsActive("leaderboard");
    } else if (location.pathname === "/dashboard/settings") {
      setIsActive("settings");
    } else if (location.pathname === "/dashboard/recycle") {
      setIsActive("recycle");
    } else if (location.pathname === "/dashboard/campaign") {
      setIsActive("campaign");
    } else if (location.pathname === "/dashboard/marketplace") {
      setIsActive("marketplace");
    } else if (location.pathname === "/dashboard/createEvent") {
      setIsActive("createEvent");
    } else if (location.pathname === "/dashboard/purchases") {
      setIsActive("purchases");
    } else if (location.pathname === "/dashboard/createAdmin") {
      setIsActive("createAdmin");
    } else if (location.pathname === "/dashboard/disbursement") {
      setIsActive("disbursement");
    } else if (location.pathname === "/dashboard/createCarbon") {
      setIsActive("createCarbon");
    } else if (location.pathname === "/dashboard/carbonmarket") {
      setIsActive("carbonmarket");
    } else if (location.pathname === "/dashboard/carbonpurchases") {
      setIsActive("carbonpurchases");
    }
  }, [location]);

  // set style for active link
  const activeLinkStyle = {
    backgroundColor: activeBgColor,
    textDecoration: "none",
    color: "#FFF",
    transition: ".5s ease",
    borderRadius: "12px",
  };

  return (
    <div className="h-screen bg-background p-4">
      <div className="flex flex-col h-full w-full bg-default-50/50 lg:bg-default-50 backdrop-blur-md rounded-2xl">
        <h1 className="block text-2xl font-bold h-32 px-3 py-12 rounded-lg mr-auto">
          <Logo />
        </h1>

        <article className="flex-1 h-full py-4">
          <ul className="menu menu-lg bg-transparent w-72 rounded-box space-y-8">
            {currentUser?.role === 1 && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className=""
                    style={isActive === "dashboard" ? activeLinkStyle : {}}
                  >
                    {" "}
                    <LucideCandlestickChart />
                    Dashboard
                    {/* </h2> */}
                  </Link>
                  {/* <a className="active">Home</a> */}
                </li>
                <li>
                  <Link
                    to="/dashboard/createEvent"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "createEvent" ? activeLinkStyle : {}}
                  >
                    <FaCartPlus />
                    <h2 className="text-lg">Create Event</h2>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/createAdmin"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "createAdmin" ? activeLinkStyle : {}}
                  >
                    <FaUserShield />
                    <h2 className="text-lg">Create Admin</h2>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/createCarbon"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "createCarbon" ? activeLinkStyle : {}}
                  >
                    <FaWallet />
                    <h2 className="text-lg">Sell Credits</h2>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/dashboard/disbursement"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "disbursement" ? activeLinkStyle : {}}
                  >
                    <FaWallet />
                    <h2 className="text-lg">Disbursement</h2>
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/dashboard/carbonmarket"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "carbonmarket" ? activeLinkStyle : {}}
                  >
                    <FaCartArrowDown />
                    <h2 className="text-lg">Carbon Market</h2>
                  </Link>
                </li>
              </>
            )}
            {((currentUser?.role === 0 && currentUser?.name !== "") ||
              currentUser?.role === 1 ||
              currentUser?.role === 2) && (
                <>
                  <li>
                    <Link
                      to="/dashboard/leaderboard"
                      className="items-center"
                      style={isActive === "leaderboard" ? activeLinkStyle : {}}
                    >
                      {/* <img src={wallet} alt="wallet-Icon" /> */}
                      <FaPeopleGroup />
                      <h2 className="text-lg">Leaderboard</h2>
                    </Link>
                  </li>
                </>
              )}
            {((currentUser?.role === 0 && currentUser?.name !== "") ||
              currentUser?.role === 1) && (
                <>
                  <li>
                    <Link
                      to="/dashboard/marketplace"
                      className="flex flex-row gap-2 items-center"
                      style={isActive === "marketplace" ? activeLinkStyle : {}}
                    >
                      <FaCartArrowDown />
                      <h2 className="text-lg">Marketplace</h2>
                    </Link>
                  </li>
                </>
              )}
            {currentUser?.role === 0 && currentUser?.name !== "" && (
              <>
                <li>
                  <Link
                    to="/dashboard/wallet"
                    className="items-center"
                    style={isActive === "wallet" ? activeLinkStyle : {}}
                  >
                    {/* <img src={wallet} alt="wallet-Icon" /> */}
                    <FaWallet />
                    <h2 className="text-lg">Wallet</h2>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/purchases"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "purchases" ? activeLinkStyle : {}}
                  >
                    <FaLayerGroup />
                    <h2 className="text-lg">My Purchase</h2>
                  </Link>
                </li>
              </>
            )}
            {currentUser?.role == 2 && (
              <li>
                <Link
                  to="/dashboard/recycle"
                  className="flex flex-row gap-2 items-center"
                  style={isActive === "recycle" ? activeLinkStyle : {}}
                >
                  {/* <img src={settings} alt="recycle-Icon" /> */}
                  <FaRecycle />
                  <h2 className="text-lg">Recycle</h2>
                </Link>
              </li>
            )}
            {(company as datap)?.role === 3 && (
              <>
                <li>
                  <Link
                    to="/dashboard/carbonmarket"
                    className="flex flex-row gap-2 items-center"
                    style={isActive === "carbonmarket" ? activeLinkStyle : {}}
                  >
                    <FaCartArrowDown />
                    <h2 className="text-lg">RecycLink Market</h2>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/carbonpurchases"
                    className="flex flex-row gap-2 items-center"
                    style={
                      isActive === "carbonpurchases" ? activeLinkStyle : {}
                    }
                  >
                    <FaLayerGroup />
                    <h2 className="text-lg">My Purchase</h2>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </article>
        <div className="relative w-full px-8 my-8 flex flex-row gap-2 text-sm items-center rounded-lg transition-all delay-400">
          <div className="grid flex-grow place-items-center">v1.0.0</div>
          {/* <div className="divider divider-horizontal"></div> */}
          <Divider orientation="vertical"></Divider>
          <div className="grid flex-grow place-items-center">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
