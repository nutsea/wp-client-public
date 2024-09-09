import React, { useEffect, useState } from "react"
import './Profile.scss'
import { checkUser, updateUser } from "../../http/userAPI"

import { useLocation, useNavigate } from "react-router-dom"
import { ProfileInfo } from "../../components/profileInfo/ProfileInfo"
import { ProfileOrders } from "../../components/profileOrders/ProfileOrders"
import queryString from "query-string";
import { ProfileSettings } from "../../components/profileSettings/ProfileSettings"
import { ProfileSync } from "../../components/profileSync/ProfileSync"

export const Profile = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { tab } = queryString.parse(location.search)
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})
    const [profileTab, setProfileTab] = useState('data')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
    }

    const checkToken = async () => {
        try {
            await checkUser().then(data => {
                setUser(data.user)
                setName(data.user.name)
                setSurname(data.user.surname)
                setPhone(data.user.phone)
            })
            setIsAuth(true)
        } catch (e) {
            localStorage.removeItem('token')
        }
    }

    const sendUpdate = async (name, surname, phone) => {
        try {
            if (phone.length !== 11 && phone.length !== 0 && phone !== '7') {
                document.querySelector('.PhoneInput').classList.add('Error')
            } else {
                await updateUser(name, surname, phone).then(data => {
                    document.querySelector('.PhoneInput').classList.remove('Error')
                    setUser(data)
                    setName(data.name)
                    setSurname(data.surname)
                    setPhone(data.phone)
                })
            }
        } catch (e) {

        }
    }

    const logOut = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuth(false)
        setUser({})
        navigate('/')
        window.location.reload()
    }

    useEffect(() => {
        checkToken()
    }, [])

    useEffect(() => {
        setProfileTab(tab ? tab : 'data')
    }, [tab])

    return (
        <div className="MainContainer MBInfo">
            <div className="BreadCrumbs">
                <span className="LastCrumb" id="/" onClick={handleNavigate}>Главная</span>
                <span className="SlashCrumb">/</span>
                <span className="NewCrumb">Личные данные</span>
            </div>
            {isAuth && user ?
                <>
                    {profileTab === 'data' ?
                        <h2 className="ProfileSub">Личные данные</h2>
                        : (profileTab === 'orders') ?
                            <h2 className="ProfileSub MyOrdersSub">Мои заказы</h2>
                            : (profileTab === 'settings') ?
                                <h2 className="ProfileSub MyOrdersSub">Настройки</h2>
                                : (profileTab === 'sync') &&
                                <h2 className="ProfileSub MyOrdersSub">Синхронизация</h2>
                    }
                    <div className="ProfileRow">
                        <div className="ProfileMenu">
                            <div className={`PMenuBtn ${profileTab === 'data' ? 'Active' : ''}`} onClick={() => setProfileTab('data')}>Профиль</div>
                            <div className={`PMenuBtn ${profileTab === 'orders' ? 'Active' : ''}`} onClick={() => setProfileTab('orders')}>Мои заказы</div>
                            <div className={`PMenuBtn`} onClick={() => navigate('/fav')}>Избранное</div>
                            <div className={`PMenuBtn ${profileTab === 'sync' ? 'Active' : ''}`} onClick={() => setProfileTab('sync')}>Синхронизация</div>
                            <div className={`PMenuBtn`} onClick={logOut}>Выйти</div>
                        </div>
                        {profileTab === 'data' ?
                            <ProfileInfo user={user} nameProp={name} surnameProp={surname} phoneProp={phone} onSendUpdate={sendUpdate} />
                            : (profileTab === 'orders') ?
                                <ProfileOrders />
                                : (profileTab === 'settings') ?
                                    <ProfileSettings user={user} onSetPassword={checkToken} />
                                    : (profileTab === 'sync') &&
                                    <ProfileSync />
                        }
                    </div>
                </>
                :
                <></>
            }
        </div>
    )
}