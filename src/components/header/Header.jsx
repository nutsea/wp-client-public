import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import './Header.scss'
import './Menu.scss'

import logo from '../../assets/logo.png'
import loop1 from '../../assets/loop1.svg'
import wish from '../../assets/wish.svg'
import cart from '../../assets/cart.svg'
import arr1 from '../../assets/arr1.svg'
import burger from '../../assets/burger.svg'
import loop2 from '../../assets/loop2.svg'
import profile from '../../assets/profile.png'

import close from '../../assets/close.svg'
import arr from '../../assets/arr6.svg'
import signOut from '../../assets/signOut.svg'
import { checkAuth, checkAuthBrowser, createAuth } from "../../http/authAPI"
import { checkUser } from "../../http/userAPI"
import { fetchByIds, fetchCartItems } from "../../http/itemAPI";
import { findUserFav } from "../../http/favAPI";
import { findUserCart } from "../../http/cartAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

export const Header = observer(({ authcode }) => {
    const { user_fav, user_cart } = useContext(Context)
    const [isFocus, setIsFocus] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})

    const location = useLocation()
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        handleMenuClose()
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
        })
    }

    const handleBurger = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        document.querySelector('.App').classList.add('Lock')

        const menu = document.querySelector('.MenuContainer')
        const menuBox = document.querySelector('.MenuBox')
        menuBox.classList.toggle('None')
        setTimeout(() => {
            menu.classList.toggle('MenuHide')
            menuBox.classList.toggle('MenuBoxHide')
        }, 1);
    }

    const handleMenuClose = () => {
        document.querySelector('.App').classList.remove('Lock')

        const menu = document.querySelector('.MenuContainer')
        menu.classList.add('MenuHide')
        const menuBox = document.querySelector('.MenuBox')
        menuBox.classList.add('MenuBoxHide')
        menuBox.scrollTo(0, 0)
        setTimeout(() => {
            menuBox.classList.add('None')
        }, 200);
    }

    const clickMenuAway = (e) => {
        if (!e.target.closest('.MenuContainer') && !e.target.closest('.BurgerBtn')) {
            handleMenuClose()
        }
    }

    const formatePhone = (phone) => {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
    }

    const handleAuth = async () => {
        await createAuth().then(data => {
            // const telegramUrl = `https://t.me/nutsea_web_bot?start=${data.code}`
            const telegramUrl = `https://t.me/wp_auth_bot?start=${data.code}`

            setTimeout(() => {
                let newWindow = window.open(telegramUrl, '_blank')

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    window.location.href = telegramUrl
                }
            }, 10)

            const authenticate = setInterval(async () => {
                await checkAuthBrowser(data.code).then(data2 => {
                    if (data2) {
                        checkToken().then(() => {
                            clearInterval(authenticate)
                        })
                    }
                })
            }, 1000)
        })
    }

    const checkToken = async () => {
        try {
            await checkUser().then(data => {
                setUser(data.user)
            })
            setIsAuth(true)
        } catch (e) {

        }
    }

    const logOut = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuth(false)
        setUser({})
        if (location.pathname === '/profile') {
            navigate('/')
        }
        window.location.reload()
    }

    const authenticate = async (authcode) => {
        try {
            await checkAuth(authcode).then(data => {
                setUser(data.user)
            })
            setIsAuth(true)
        } catch (e) {

        }
    }

    const checkUserId = async () => {
        try {
            await findUserFav(user.id).then(async (data2) => {
                await fetchByIds(data2.map(item => item.item_uid)).then(data3 => {
                    user_fav.setFav(data3)
                })
            })
            await findUserCart(user.id).then(async data2 => {
                user_cart.setCart(data2)
            })
        } catch (e) {
            const wishArr = JSON.parse(localStorage.getItem('wish'))
            if (wishArr && Array.isArray(wishArr)) {
                await fetchByIds(wishArr).then(data => {
                    user_fav.setFav(data)
                })
            }
            await fetchCartItems(JSON.parse(localStorage.getItem('cart'))).then(data => {
                user_cart.setCart(data)
            })
        }
    }

    useEffect(() => {
        checkToken()
    }, [])

    useEffect(() => {
        if (authcode) authenticate(authcode)
    }, [authcode])

    useEffect(() => {
        checkUserId()
        // eslint-disable-next-line
    }, [user])

    return (
        <>
            <header className='Header'>
                <div className="HeaderPC">
                    <div className='HeaderTop'>
                        <img className='HeaderLogo' src={logo} alt="WearPoizon" id="/" onClick={handleNavigate} />
                        <div className='HeaderNav'>
                            <span id="/payment" onClick={handleNavigate}>Оплата и доставка</span>
                            <span id="/guarantee" onClick={handleNavigate}>Гарантия оригинальности</span>
                            <span id="/contacts" onClick={handleNavigate}>Контакты</span>
                        </div>
                        <div className={`HeaderSearch ${isFocus ? 'Focused' : ''}`}>
                            <img src={loop1} alt="Поиск" />
                            <input
                                type="text"
                                placeholder='Поиск по бренду, названию и т.д.'
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                            />
                        </div>
                        <div className='HeaderBtns'>
                            <div className="FavHeaderBox" id="/fav">
                                <img src={wish} alt="Избранное" id="/fav" onClick={handleNavigate} />
                                {user_fav && user_fav.fav && user_fav.fav.length > 0 && <span id="/fav">{user_fav.fav.length}</span>}
                            </div>
                            <div className="CartHeaderBox" id="/cart">
                                <img src={cart} alt="Корзина" id="/cart" onClick={handleNavigate} />
                                {user_cart && user_cart.cart && user_cart.cart.length > 0 && <span id="/cart">{user_cart.cart.length}</span>}
                            </div>
                        </div>
                        {!isAuth ?
                            <div className='HeaderAuth' onClick={handleAuth}>
                                <span>Вход</span>
                                <img src={arr1} alt="Вход" />
                            </div>
                            :
                            <div className="HProfileInitials" id="/profile" onClick={handleNavigate}>
                                {(!user || (!user.name && !user.surname)) &&
                                    <img src={profile} id="/profile" alt="" />
                                }
                                {user && user.name &&
                                    <span id="/profile">{user.name[0]}</span>
                                }
                                {user && user.surname &&
                                    <span id="/profile">{user.surname[0]}</span>
                                }
                            </div>
                        }
                    </div>
                    <div className='HeaderBottom'>
                        <div className='HeaderNav2'>
                            <span id="/catalogue/?category=shoes" onClick={handleNavigate}>Обувь</span>
                            {/* <span id="/catalogue/?category=clothes" onClick={handleNavigate}>Одежда</span>
                            <span id="/catalogue/?category=accessories" onClick={handleNavigate}>Аксессуары</span>
                            <span id="/catalogue/?category=cosmetics" onClick={handleNavigate}>Косметика</span>
                            <span id="/catalogue/?category=perfumery" onClick={handleNavigate}>Парфюмерия</span> */}
                            <span id="/oops" onClick={handleNavigate}>Одежда</span>
                            <span id="/oops" onClick={handleNavigate}>Аксессуары</span>
                            <span id="/oops" onClick={handleNavigate}>Косметика</span>
                            <span id="/oops" onClick={handleNavigate}>Парфюмерия</span>
                        </div>
                    </div>
                </div>
                <div className="HeaderMobile">
                    <div className="BurgerBtn" onClick={handleBurger}>
                        <img src={burger} alt="Меню" />
                    </div>
                    <img className='HeaderLogo' src={logo} alt="WearPoizon" id="/" onClick={handleNavigate} />
                    <div className="HeaderBtns">
                        <img src={loop2} alt="Поиск" />
                        {/* <img src={wish} alt="Избранное" id="/fav" onClick={handleNavigate} />
                        <img src={cart} alt="Корзина" id="/cart" onClick={handleNavigate} /> */}
                        <div className="FavHeaderBox" id="/fav">
                            <img src={wish} alt="Избранное" id="/fav" onClick={handleNavigate} />
                            {user_fav && user_fav.fav && user_fav.fav.length > 0 && <span id="/fav">{user_fav.fav.length}</span>}
                        </div>
                        <div className="CartHeaderBox" id="/cart">
                            <img src={cart} alt="Корзина" id="/cart" onClick={handleNavigate} />
                            {user_cart && user_cart.cart && user_cart.cart.length > 0 && <span id="/cart">{user_cart.cart.length}</span>}
                        </div>
                    </div>
                </div>
            </header>
            <div className="MenuBox MenuBoxHide None" onClick={clickMenuAway}>
                <div className="MenuContainer MenuHide">
                    <div className="MenuTop">
                        <span></span>
                        <span>Каталог</span>
                        <div className="MenuClose" onClick={handleMenuClose}>
                            <img src={close} alt="Закрыть" />
                        </div>
                    </div>
                    <div className="MenuCatalogue">
                        <div className="MenuItem" id="/catalogue/?category=shoes" onClick={handleNavigate}>
                            <span id="/catalogue/?category=shoes">Обувь</span>
                            <img src={arr} alt="Стрелка" id="/catalogue/?category=shoes" />
                        </div>
                        <div className="MenuLine" />
                        <div className="MenuItem" id="/oops" onClick={handleNavigate}>
                            <span id="/oops">Одежда</span>
                            <img src={arr} alt="Стрелка" id="/oops" />
                        </div>
                        {/* <div className="MenuItem" id="/catalogue/?category=clothes" onClick={handleNavigate}>
                            <span id="/catalogue/?category=clothes">Одежда</span>
                            <img src={arr} alt="Стрелка" id="/catalogue/?category=clothes" />
                        </div> */}
                        <div className="MenuLine" />
                        <div className="MenuItem" id="/oops" onClick={handleNavigate}>
                            <span id="/oops">Аксессуары</span>
                            <img src={arr} alt="Стрелка" id="/oops" />
                        </div>
                        {/* <div className="MenuItem" id="/catalogue/?category=accessories" onClick={handleNavigate}>
                            <span id="/catalogue/?category=accessories">Аксессуары</span>
                            <img src={arr} alt="Стрелка" id="/catalogue/?category=accessories" />
                        </div> */}
                        <div className="MenuLine" />
                        <div className="MenuItem" id="/oops" onClick={handleNavigate}>
                            <span id="/oops">Косметика</span>
                            <img src={arr} alt="Стрелка" id="/oops" />
                        </div>
                        {/* <div className="MenuItem" id="/catalogue/?category=cosmetics" onClick={handleNavigate}>
                            <span id="/catalogue/?category=cosmetics">Косметика</span>
                            <img src={arr} alt="Стрелка" id="/catalogue/?category=cosmetics" />
                        </div> */}
                        <div className="MenuLine" />
                        <div className="MenuItem" id="/oops" onClick={handleNavigate}>
                            <span id="/oops">Парфюмерия</span>
                            <img src={arr} alt="Стрелка" id="/oops" />
                        </div>
                        {/* <div className="MenuItem" id="/catalogue/?category=perfumery" onClick={handleNavigate}>
                            <span id="/catalogue/?category=perfumery">Парфюмерия</span>
                            <img src={arr} alt="Стрелка" id="/catalogue/?category=perfumery" />
                        </div> */}
                        <div className="MenuLine" />
                    </div>
                    <div className="MenuCatalogue">
                        <div className="MenuItem2" id="/payment" onClick={handleNavigate}>
                            <span id="/payment">Оплата и доставка</span>
                        </div>
                        <div className="MenuLine" />
                        <div className="MenuItem2" id="/guarantee" onClick={handleNavigate}>
                            <span id="/guarantee">Гарантия оригинальности</span>
                        </div>
                        <div className="MenuLine" />
                        <div className="MenuItem2" id="/contacts" onClick={handleNavigate}>
                            <span id="/contacts">Контакты</span>
                        </div>
                        <div className="MenuLine" />
                    </div>
                    {isAuth ?
                        <div className="MenuProfile">
                            <div className="MProfileData">
                                <div className="MProfileInitials" id="/profile" onClick={handleNavigate}>
                                    {(!user || (!user.name && !user.surname)) &&
                                        <img src={profile} id="/profile" alt="" />
                                    }
                                    {user && user.name &&
                                        <span id="/profile">{user.name[0]}</span>
                                    }
                                    {user && user.surname &&
                                        <span id="/profile">{user.surname[0]}</span>
                                    }
                                </div>
                                <div className="MProfileNP">
                                    {user && user.name &&
                                        <div className="MProfileName">{user.name}</div>
                                    }
                                    {user && user.phone &&
                                        <div className="MProfilePhone">{formatePhone(user.phone)}</div>
                                    }
                                </div>
                            </div>
                            <div className="MenuCatalogue">
                                <div className="MenuItem2" id="/profile" onClick={handleNavigate}>
                                    <span id="/profile">Личные данные</span>
                                </div>
                                <div className="MenuLine" />
                                <div className="MenuItem2" id="/profile/?tab=orders" onClick={handleNavigate}>
                                    <span id="/profile/?tab=orders">Мои заказы</span>
                                </div>
                                <div className="MenuLine" />
                                <div className="MenuItem2" id="/fav" onClick={handleNavigate}>
                                    <span id="/fav">Избранное</span>
                                </div>
                                <div className="MenuLine" />
                                <div className="MenuItem2" id="/profile/?tab=sync" onClick={handleNavigate}>
                                    <span id="/profile/?tab=sync">Синхронизация</span>
                                </div>
                                <div className="MenuLine" />
                            </div>
                            <div className="MenuAuth" onClick={logOut}>
                                <img src={signOut} alt="Выйти" />
                                <span>Выйти из аккаунта</span>
                            </div>
                        </div>
                        :
                        <div className="MenuAuth" onClick={handleAuth}>Авторизация через Telegram</div>
                    }
                </div>
            </div >
        </>
    )
})