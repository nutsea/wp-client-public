import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './Footer.scss'

import logo from '../../assets/logo.png'
// import appTg from '../../assets/appTg.png'
import arr4 from '../../assets/arr4.svg'
import vk from '../../assets/vkFooter.svg'
import tg from '../../assets/tgFooter.svg'
import tt from '../../assets/ttFooter.svg'
import { Context } from "../..";
import { observer } from "mobx-react-lite";

export const Footer = observer(() => {
    const { brand_check } = useContext(Context)
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
        })
    }

    const handleNavigateToBrand = (brands) => {
        brand_check.setBrand(brands)
        navigate('/catalogue/?brandset=true')
        window.scrollTo({
            top: 0,
        })
    }

    return (
        <footer className="Footer">
            <div className="FooterTop">
                <div className="FooterCol">
                    <img className="FooterLogo" src={logo} alt="WearPoizon" id="/" onClick={handleNavigate} />
                </div>
                <div className="FooterCol" />
                <div className="FooterCol" />
                <div className="FooterCol FooterAppCol">
                    {/* <div className="FooterApp">
                        <img src={appTg} alt="Приложение" />
                        <div className="AppText">
                            <span className="AppSub">Приложение WearPoizon</span>
                            <span className="AppInfo">Telegram Web App</span>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="FooterMid">
                <div className="FooterCol MidFooterCol">
                    <h3>Каталог</h3>
                    <span className="FooterLink" id="/catalogue/?category=shoes" onClick={handleNavigate}>Обувь</span>
                    {/* <span className="FooterLink" id="/catalogue/?category=clothes" onClick={handleNavigate}>Одежда</span>
                    <span className="FooterLink" id="/catalogue/?category=accessories" onClick={handleNavigate}>Аксессуары</span>
                    <span className="FooterLink" id="/catalogue/?category=cosmetics" onClick={handleNavigate}>Косметика</span>
                    <span className="FooterLink" id="/catalogue/?category=perfumery" onClick={handleNavigate}>Парфюмерия</span> */}
                    <span className="FooterLink" id="/oops" onClick={handleNavigate}>Одежда</span>
                    <span className="FooterLink" id="/oops" onClick={handleNavigate}>Аксессуары</span>
                    <span className="FooterLink" id="/oops" onClick={handleNavigate}>Косметика</span>
                    <span className="FooterLink" id="/oops" onClick={handleNavigate}>Парфюмерия</span>
                </div>
                <div className="FooterCol MidFooterCol">
                    <h3>Сервис</h3>
                    <span className="FooterLink" id="/payment" onClick={handleNavigate}>Оплата и доставка</span>
                    <a className="FooterLink" href="https://t.me/wear_poizon" target="_blank" rel="noreferrer">Помощь</a>
                    <span className="FooterLink" id="/guarantee" onClick={handleNavigate}>Гарантия оригинальности</span>
                    <span className="FooterLink">Как выбрать размер</span>
                </div>
                <div className="FooterCol MidFooterCol">
                    <h3>Бренды</h3>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Nike')}>Nike</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Air Jordan')}>Air Jordan</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('New Balance')}>New Balance</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Asics')}>Asics</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Puma')}>Puma</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Adidas')}>Adidas</span>
                    <span className="FooterLink" onClick={() => handleNavigateToBrand('Converse')}>Converse</span>
                    <span className="FooterLink AllBrands" id="/catalogue" onClick={handleNavigate}>
                        <span id="/catalogue">Все бренды</span>
                        <img id="/catalogue" src={arr4} alt="Все бренды" />
                    </span>
                </div>
                <div className="FooterCol MidFooterCol">
                    <h3>О нас</h3>
                    {/* <span className="FooterLink">Приложение</span> */}
                    <span className="FooterLink">Отзывы</span>
                    <span className="FooterLink" id="/contacts" onClick={handleNavigate}>Контакты</span>
                    <span className="FooterAppsLinks">
                        <span>
                            <img src={vk} alt="" />
                        </span>
                        <span>
                            <img src={tg} alt="" />
                        </span>
                        <span>
                            <img src={tt} alt="" />
                        </span>
                    </span>
                </div>
            </div>
            <div className="FooterBottom">
                <div className="FooterLeft">© Kicksie. Все права защищены.</div>
                <div className="FooterRight">
                    <div className="FooterLink">Карта сайта</div>
                    <div className="FooterLink">Политика конфиденциальности</div>
                    <div className="FooterLink">Оферта</div>
                </div>
            </div>
        </footer>
    )
})