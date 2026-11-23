"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  accountGetBalance,
  getAccountInfo,
} from "@/services/client-side/account-info/account-info.api";
import appSlice from "@/app/appSlice";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/configure-store";
import { useDispatch } from "react-redux";
import Image from "app/image";

const Header = () => {
  const { loadingLoginAPI, setLogin, setLogout } = appSlice.actions;
  const { refresh, loadingLogin } = useAppSelector(
    (state: RootState) => state.app,
  );
  const dispatch = useDispatch();
  const [hrefJS, setHrefJS] = useState(0);
  const [accountname, setAccountName] = useState<any>("");
  const [currentToken, setCurrentToken] = useState<any>("");
  const [crrBalance, setBalance] = useState<number>(0);

  const loginAction = () => {
    setHrefJS(1);
    // @ts-ignore
    return calPopLogin();
  };
  const logoutAction = () => {
    setAccountName("");
    dispatch(setLogout());
    // @ts-ignore
    return Logout();
  };
  // useEffect(() => {
  //   getAccountInfo()
  //     .then((res) => {
  //       if (res.data.code > 0) {
  //         setAccountName(res.data.data);
  //         dispatch(setLogin());
  //         loadingLoginAPI(false);
  //       }
  //     })
  // }, [currentToken]);
  // useEffect(() => {
  //   accountGetBalance().then((res) => {
  //     if (res && res.data.code > 0) {
  //       setBalance(res.data.data);
  //     }
  //   });
  // }, [refresh]);

  useEffect(() => {
    setTimeout(() => {
      const targets = document.querySelectorAll(`[href="javascript:;"]`);
      for (let i = 0; i < targets.length; i++) {
        targets[i].removeAttribute("href");
      }
      setHrefJS(0);
    }, 300);
  }, [hrefJS]);
  return (
    <>
      <header>
        {/* Tạo header tại đây */}
        <div className="text-black flex flex-row m-5 gap-5">
          <Link className="border border-black p-2" href="/">
            Trang chủ
          </Link>
          <Link className="border border-black p-2" href="/demo-page">
            Demo Page
          </Link>
          <Link className="border border-black p-2" href="/about">
            About
          </Link>
        </div>
        {/* header */}
        {/* {loadingLogin && <SpinLoading color="#59e6ff" width={25} height={25} />} */}
        {!loadingLogin && (accountname ? <>Đã đăng nhập</> : <></>)}
      </header>
      <div
        id="header"
        style={{ zIndex: 999, height: "31px", display: "none" }}
      ></div>
      <div id="LogAndReg"></div>
    </>
  );
};
export default Header;
