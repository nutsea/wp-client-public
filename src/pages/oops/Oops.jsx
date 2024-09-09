import React from "react";
import { useNavigate } from 'react-router-dom';
import './Oops.scss'

import star from '../../assets/star.svg'
import oops from '../../assets/oops.png'
import vk from '../../assets/vk.svg'
import tg from '../../assets/tg.svg'
import tiktok from '../../assets/tiktok.svg'

export const Oops = () => {
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
    }

    return (
        <div className="OopsBox">
            <div className="OopsContainer">
                <img className="OopsText" src={oops} alt="УПС" />
                <div className="OopsSub">Раздел в разработке!</div>
                <p className="OopsPar">Мы постоянно совершенствуемся, подпишитесь на наши соц.сети и мы уведомим вас, как данный раздел появится!</p>
                <div className="OopsSM">
                    <img src={vk} alt="Вконтакте" />
                    <img src={tg} alt="Telegram" />
                    <img src={tiktok} alt="TikTok" />
                </div>
                <div className="BackToMain" id="/" onClick={handleNavigate}>Вернуться на главную</div>
            </div>
            <img className="StarImg Star1" src={star} alt="" />
            <img className="StarImg Star2" src={star} alt="" />
            <img className="StarImg Star3" src={star} alt="" />
            <img className="StarImg Star4" src={star} alt="" />
            <img className="StarImg Star5" src={star} alt="" />
            <img className="StarImg Star6" src={star} alt="" />
            <img className="StarImg Star7" src={star} alt="" />
            <img className="StarImg Star8" src={star} alt="" />
            <img className="StarImg Star9" src={star} alt="" />
            <img className="StarImg Star10" src={star} alt="" />
            <img className="StarImg Star11" src={star} alt="" />
            <img className="StarImg Star12" src={star} alt="" />
            <img className="StarImg Star13" src={star} alt="" />
            <img className="StarImg Star14" src={star} alt="" />
            <img className="StarImg Star15" src={star} alt="" />
            <img className="StarImg Star16" src={star} alt="" />
        </div>
    )
}