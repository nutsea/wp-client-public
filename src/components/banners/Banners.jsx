import React, { useEffect } from "react";
import "./Banners.scss";

import banner1 from "./images/banner1.jpg";
import banner2 from "./images/banner2.jpg";
import banner3 from "./images/banner3.jpg";
import banner4 from "./images/banner4.jpg";
import banner5 from "./images/banner5.jpg";
import banner_m1 from "./images/banner_m1.png";
import banner_m2 from "./images/banner_m2.png";
import banner_m3 from "./images/banner_m3.png";
import banner_m4 from "./images/banner_m4.png";
import banner_m5 from "./images/banner_m5.png";
import arr from "../../assets/arr3.svg";

export const Banners = () => {
    const [banner, setBanner] = React.useState(0)

    const bannerRight = () => {
        const banners = document.querySelectorAll(".BannerBox");
        if (banners.length > 1) {
            for (let i = 0; i < banners.length; i++) {
                if (!banners[i]?.classList.contains("BanNone")) {
                    if (banners[i + 1]) {
                        banners[i + 1]?.classList.remove("BanNone")
                        setBanner(i + 1)
                    } else {
                        banners[0]?.classList.remove("BanNone")
                        setBanner(0)
                    }
                    banners[i]?.classList.add("BanNone")
                    break
                }
            }
        }
    }

    const bannerLeft = () => {
        const banners = document.querySelectorAll(".BannerBox");
        for (let i = 0; i < banners.length; i++) {
            if (!banners[i].classList.contains("BanNone")) {
                if (banners[i - 1]) {
                    banners[i - 1]?.classList.remove("BanNone")
                    setBanner(i - 1)
                } else {
                    banners[banners.length - 1].classList.remove("BanNone")
                    setBanner(banners.length - 1)
                }
                banners[i].classList.add("BanNone")
                break
            }
        }
    }

    useEffect(() => {
        const bannerLoop = setInterval(bannerRight, 7000)
        return () => clearInterval(bannerLoop)
    }, [])

    return (
        <div className="BannersContainer">
            <div className="BannerPags">
                <span className={`${banner === 0 ? 'BannerSelect' : ''}`}></span>
                <span className={`${banner === 1 ? 'BannerSelect' : ''}`}></span>
                <span className={`${banner === 2 ? 'BannerSelect' : ''}`}></span>
                <span className={`${banner === 3 ? 'BannerSelect' : ''}`}></span>
                <span className={`${banner === 4 ? 'BannerSelect' : ''}`}></span>
            </div>
            <div className="BannerBox">
                <img className="Banner" src={banner1} alt="Баннер" />
                <img className="Banner2" src={banner_m1} alt="Баннер" />
                <div className="BannerBtns">
                    <div className="BanLeft" onClick={bannerLeft}><img src={arr} alt="Назад" /></div>
                    <div className="BanRight" onClick={bannerRight}><img src={arr} alt="Назад" /></div>
                </div>
            </div>
            <div className="BannerBox BanNone">
                <img className="Banner" src={banner2} alt="Баннер" />
                <img className="Banner2" src={banner_m2} alt="Баннер" />
                <div className="BannerBtns">
                    <div className="BanLeft" onClick={bannerLeft}><img src={arr} alt="Назад" /></div>
                    <div className="BanRight" onClick={bannerRight}><img src={arr} alt="Назад" /></div>
                </div>
            </div>
            <div className="BannerBox BanNone">
                <img className="Banner" src={banner3} alt="Баннер" />
                <img className="Banner2" src={banner_m3} alt="Баннер" />
                <div className="BannerBtns">
                    <div className="BanLeft" onClick={bannerLeft}><img src={arr} alt="Назад" /></div>
                    <div className="BanRight" onClick={bannerRight}><img src={arr} alt="Назад" /></div>
                </div>
            </div>
            <div className="BannerBox BanNone">
                <img className="Banner" src={banner4} alt="Баннер" />
                <img className="Banner2" src={banner_m4} alt="Баннер" />
                <div className="BannerBtns">
                    <div className="BanLeft" onClick={bannerLeft}><img src={arr} alt="Назад" /></div>
                    <div className="BanRight" onClick={bannerRight}><img src={arr} alt="Назад" /></div>
                </div>
            </div>
            <div className="BannerBox BanNone">
                <img className="Banner" src={banner5} alt="Баннер" />
                <img className="Banner2" src={banner_m5} alt="Баннер" />
                <div className="BannerBtns">
                    <div className="BanLeft" onClick={bannerLeft}><img src={arr} alt="Назад" /></div>
                    <div className="BanRight" onClick={bannerRight}><img src={arr} alt="Назад" /></div>
                </div>
            </div>
        </div>
    )
}