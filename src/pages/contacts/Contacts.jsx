import React from "react";
import { useNavigate } from 'react-router-dom';
import './Contacts.scss'

import mainContactVK from '../../assets/mainContactVK.svg'
import mainContactTG from '../../assets/mainContactTG.svg'
import contactTG from '../../assets/contactTG.svg'

export const Contacts = () => {
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
        })
    }

    return (
        <div className="MainContainer MBInfo">
            <div className="BreadCrumbs">
                <span className="LastCrumb" id="/" onClick={handleNavigate}>Главная</span>
                <span className="SlashCrumb">/</span>
                <span className="NewCrumb">Контакты</span>
            </div>
            <div className="ContactsInfo">
                <h2>Контакты</h2>
                <div className="ContactsTable">
                    <div className="MainContacts">
                        <div className="ContactItem">
                            <img src={mainContactVK} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname">@aaaaaavk</span>
                                <span className="ContactRes">VK</span>
                            </span>
                        </div>
                        <div className="ContactItem">
                            <img src={mainContactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname">333.33</span>
                                <span className="ContactRes">Telegram</span>
                            </span>
                        </div>
                    </div>
                    <div className="AllContacts">
                        <div className="ContactItem2">
                            <img src={contactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname2">333.33</span>
                                <span className="ContactRes2">Telegram-Бот</span>
                            </span>
                        </div>
                        <div className="ContactItem2">
                            <img src={contactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname2">333.33</span>
                                <span className="ContactRes2">Telegram (Отзывы)</span>
                            </span>
                        </div>
                        <div className="ContactItem2">
                            <img src={contactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname2">333.33</span>
                                <span className="ContactRes2">Telegram (Выкупы)</span>
                            </span>
                        </div>
                        <div className="ContactItem2">
                            <img src={contactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname2">333.33</span>
                                <span className="ContactRes2">Telegram (Фото-отчеты)</span>
                            </span>
                        </div>
                        <div className="ContactItem2">
                            <img src={contactTG} alt="" />
                            <span className="ContactInfo">
                                <span className="ContactNickname2">333.33</span>
                                <span className="ContactRes2">Telegram Менеджера</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}