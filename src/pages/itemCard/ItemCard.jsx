import React, { useContext, useEffect, useState } from "react";
import './ItemCard.scss'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { fetchByIds, fetchOneItem } from "../../http/itemAPI";
import { MainPopular } from "../../components/mainPopular/MainPopular";
import { WatchedItems } from "../../components/watchedItems/WatchedItems";
import { checkUser } from "../../http/userAPI";
import { addToCart, deleteFromCart, findUserCart } from "../../http/cartAPI";
import { Slider } from "../../components/slider/Slider";
import { addToFav, deleteFromFav, findUserFav } from "../../http/favAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import FormatPrice from "../../utils/FormatPrice";
import { Error } from "../error/Error";

import wish from '../../assets/wish3.svg'
import wish2 from '../../assets/wish4.svg'
import cart from '../../assets/cart2.svg'
import close from '../../assets/close5.svg'
import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'


export const ItemCard = observer(() => {
    const { constants, user_cart, user_fav } = useContext(Context)
    const navigate = useNavigate()
    const { id } = useParams()
    const [item, setItem] = useState()
    const [price, setPrice] = useState(0)
    const [chosenShip, setChosenShip] = useState('slow')
    const [chosenSize, setChosenSize] = useState('')
    const [userId, setUserId] = useState()
    const [isWished, setIsWished] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userCart, setUserCart] = useState([])

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
        })
    }

    const navigateToOrder = () => {
        if (userId) {
            window.scrollTo({
                top: 0,
            })
            navigate(`/order/?item_uid=${item.item_uid}&size=${chosenSize}&ship=${chosenShip}`)
        } else {
            showLoginModal()
        }
    }

    const findItem = async () => {
        await fetchOneItem(id).then((data) => {
            setItem(data)
            const sizes = sortItemsBySize(data.sizes)
            const size = sizes.find(size => size.size_type === 'EU')
            setPrice(size.price)
            setChosenSize(size.size)
            setIsLoading(false)
        }).catch(() => {
            navigate('/outofstock')
        })
    }

    const handleSize = (size) => {
        setChosenSize(size.size)
        setPrice(size.price)
    }

    function isValidSize(size) {
        return /^(\d+(\.\d+)?(⅓|⅔|½)?)$/.test(size)
    }

    function convertSizeToNumeric(size) {
        size = size.replace('⅓', '.33').replace('⅔', '.67').replace('½', '.5')
        return parseFloat(size)
    }

    function sortItemsBySize(items) {
        const sizeOrder = ["xxxxs", "xxxs", "xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxxxxl"]

        function getNumericValue(size) {
            return convertSizeToNumeric(size)
        }

        function getSizeOrder(size) {
            return sizeOrder.indexOf(size.toLowerCase())
        }

        function isInSizeOrder(size) {
            return sizeOrder.includes(size.toLowerCase())
        }

        const numericItems = items.filter(item => isValidSize(item.size))
        const validLetterItems = items.filter(item => !isValidSize(item.size) && isInSizeOrder(item.size))
        const invalidLetterItems = items.filter(item => !isValidSize(item.size) && !isInSizeOrder(item.size))

        numericItems.sort((a, b) => getNumericValue(a.size) - getNumericValue(b.size))

        validLetterItems.sort((a, b) => getSizeOrder(a.size) - getSizeOrder(b.size))

        return numericItems.concat(validLetterItems).concat(invalidLetterItems)
    }

    const showTableModal = () => {
        document.querySelector('.App').classList.add('Lock')
        document.querySelector('.SizesTableModal').classList.add('ActiveTable')
    }

    const hideTableModal = (e) => {
        if (!e.target.closest('.SizesTableBox') || e.target.closest('.STBClose')) {
            document.querySelector('.App').classList.remove('Lock')
            document.querySelector('.SizesTableModal').classList.remove('ActiveTable')
        }
    }

    const checkInCart = async () => {
        if (userId) {
            await checkUser().then(async (data) => {
                await findUserCart(data.user.id).then((data2) => {
                    setUserCart(data2)
                    user_cart.setCart(data2)
                })
            })
        } else {
            const cart = JSON.parse(localStorage.getItem('cart'))
            if (cart && Array.isArray(cart)) {
                setUserCart(cart)
                user_cart.setCart(cart)
            }
        }
    }

    const toCart = async () => {
        const itemToCart = {
            item_uid: item.item_uid,
            size: chosenSize,
            ship: chosenShip,
        }
        if (userId) {
            await addToCart(itemToCart.item_uid, itemToCart.size, userId, itemToCart.ship).then(() => {
                checkInCart()
                checkUserId()
            })
        } else {
            const cart = JSON.parse(localStorage.getItem('cart'))
            if (cart && Array.isArray(cart)) {
                const cartArr = cart
                cartArr.push(itemToCart)
                localStorage.setItem('cart', JSON.stringify(cartArr))
            } else {
                localStorage.setItem('cart', JSON.stringify([itemToCart]))
            }
            checkInCart()
        }
    }

    const removeFromCart = async () => {
        if (userId) {
            try {
                await deleteFromCart(item.item_uid, chosenSize, userId, chosenShip).then(() => {
                    checkInCart()
                    checkUserId()
                })
            } catch (e) {
                checkInCart()
                checkUserId()
            }
        } else {
            const oldItems = JSON.parse(localStorage.getItem('cart'))
            if (Array.isArray(oldItems)) {
                const index = oldItems.findIndex(i => i.item_uid === item.item_uid && i.size === chosenSize && i.ship === chosenShip)
                oldItems.splice(index, 1)
            }
            localStorage.setItem('cart', JSON.stringify(oldItems))
            checkInCart()
        }
    }

    const countInCart = (id, size) => {
        return userCart.filter(item => item.item_uid === id && item.size === size && item.ship === chosenShip).length
    }

    const toWish = async () => {
        setIsWished(!isWished)
        if (userId) {
            await findUserFav(userId).then(async (data) => {
                const itemId = item.id
                if (data.find(item => item.item_uid === itemId)) {
                    await deleteFromFav(item.id, userId).then(async () => {
                        await findUserFav(userId).then(async (data2) => {
                            await fetchByIds(data2.map(item => item.item_uid)).then((data3) => {
                                user_fav.setFav(data3)
                            })
                        })
                    })
                } else {
                    await addToFav(item.id, userId).then(async () => {
                        await findUserFav(userId).then(async (data2) => {
                            await fetchByIds(data2.map(item => item.item_uid)).then((data3) => {
                                user_fav.setFav(data3)
                            })
                        })
                    })
                }
            })
        } else {
            const wishArr = JSON.parse(localStorage.getItem('wish'))
            if (wishArr && Array.isArray(wishArr)) {
                if (wishArr.includes(item.id)) {
                    wishArr.splice(wishArr.indexOf(item.id), 1)
                } else {
                    wishArr.push(item.id)
                }
                localStorage.setItem('wish', JSON.stringify(wishArr))
                await fetchByIds(wishArr).then((data) => {
                    user_fav.setFav(data)
                })
            } else {
                localStorage.setItem('wish', JSON.stringify([item.id]))
                user_fav.setFav([item.id])
            }
        }
    }

    const checkUserId = async () => {
        try {
            await checkUser().then(async (data) => {
                setUserId(data.user.id)
                await findUserFav(data.user.id).then((data2) => {
                    const itemId = item.id
                    if (data2.find(item => item.item_uid === itemId)) {
                        setIsWished(true)
                    }
                })
            })
        } catch (e) {
            const wishArr = JSON.parse(localStorage.getItem('wish'))
            const itemId = item.id
            if (wishArr && Array.isArray(wishArr) && wishArr.find(item => item === itemId)) {
                setIsWished(true)
            }
        }
    }

    function smoothScrollToTop(duration) {
        const start = window.pageYOffset;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeInOutQuad(progress);

            window.scrollTo(0, start * (1 - easeProgress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        requestAnimationFrame(animateScroll);
    }

    const showLoginModal = () => {
        smoothScrollToTop(300)
        setTimeout(() => {
            document.querySelector('.App').classList.add('Lock')
            document.querySelector('.LoginModalContainer').classList.add('ActiveModal')
        }, 300);
    }

    const hideLoginModal = (e) => {
        if (!e.target.closest('.LoginModal') || e.target.closest('.LMClose')) {
            document.querySelector('.App').classList.remove('Lock')
            document.querySelector('.LoginModalContainer').classList.remove('ActiveModal')
        }
    }

    const handleAuth = async () => {
        const telegramUrl = `https://t.me/wp_auth_bot`
        const newWindow = window.open(telegramUrl, '_blank')

        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = telegramUrl
        }

        document.querySelector('.App').classList.remove('Lock')
        document.querySelector('.LoginModalContainer').classList.remove('ActiveModal')
    }


    useEffect(() => {
        findItem()
        checkInCart()
        // eslint-disable-next-line
    }, [id])

    useEffect(() => {
        if (item) {
            checkUserId()
        }
        // eslint-disable-next-line
    }, [item])

    useEffect(() => {
        checkInCart()
        // eslint-disable-next-line
    }, [userId])

    useEffect(() => {
        if (item) {
            const watched = localStorage.getItem('watchedItems')
            if (watched) {
                const watchedArr = watched.split(',')
                if (watchedArr.length > 5) {
                    watchedArr.shift()
                }
                if (!watchedArr.includes(item.id)) {
                    watchedArr.push(item.id)
                }
                localStorage.setItem('watchedItems', watchedArr)
            } else {
                if (item.id) localStorage.setItem('watchedItems', [item.id])
            }
        }
        // eslint-disable-next-line
    }, [item])

    if (item && item.img) {
        return (
            <div className="ItemCard MBInfo">
                {item && item.img ?
                    <>
                        <div className="BreadCrumbs">
                            <span className="LastCrumb" id="/" onClick={handleNavigate}>Главная</span>
                            <span className="SlashCrumb">/</span>
                            <span className="LastCrumb" id="/catalogue" onClick={handleNavigate}>Каталог</span>
                            <span className="SlashCrumb">/</span>
                            <span className="NewCrumb">{item.name}</span>
                        </div>
                        <div className="ItemCardInfo">
                            <Slider item={item} />
                            <div className="ItemCardDetails">
                                <div className="ICDSub">
                                    <span>{item.name}</span>
                                    {/* {isWished ?
                                        <img src={wish2} alt="Добавлено в избранное" onClick={toWish} />
                                        :
                                        <img src={wish} alt="Добавить в избранное" onClick={toWish} />
                                    } */}
                                    <div className="WishIconBoxCard" id="wish">
                                        <img className={`WishIconCard ${!isWished ? 'Active' : ''}`} src={wish} alt="wish" id="wish" onClick={toWish} />
                                        <img className={`WishIconCard ${isWished ? 'Active' : ''}`} src={wish2} alt="wish" id="wish" onClick={toWish} />
                                    </div>
                                </div>
                                <div className="ICDModel">{item.model}</div>
                                <div className="ICDSizes">
                                    <div className="ICDSizesSub">Доступные размеры:</div>
                                    <div className="ICDSizesList">
                                        {item.sizes && sortItemsBySize(item.sizes).map((size, i) => {
                                            if (size.size_type === 'EU')
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`ICDSize ${chosenSize === size.size ? 'ChosenSize' : ''}`}
                                                        onClick={() => handleSize(size)}
                                                    >
                                                        {size.size} {item.category === 'shoes' ? 'EU' : ''}
                                                    </div>
                                                )
                                            else return null
                                        })}
                                    </div>
                                    <div className="SizesTable" onClick={showTableModal}>Таблица размеров</div>
                                    <div className="ItemCardLine" />
                                    <div className="ICDShipSub">Доставка:</div>
                                    <div className={`ICDShip ${chosenShip === 'slow' ? 'ChosenShip' : ''}`} onClick={() => setChosenShip('slow')}>
                                        <div className="ICDSSub">
                                            <span className="Time">20-25 дней</span>
                                            <span className="Price">{FormatPrice.formatPrice(FormatPrice.slowShipPrice(price, constants.course, constants.standartShip, constants.fee))} ₽</span>
                                        </div>
                                        <div className="ICDSVPar">
                                            Доставим в Россию за 20-25 дней и передадим в Москве, либо отправим через СДЭК.
                                        </div>
                                    </div>
                                    <div className={`ICDShip ${chosenShip === 'fast' ? 'ChosenShip' : ''}`} onClick={() => setChosenShip('fast')}>
                                        <div className="ICDSSub">
                                            <span className="Time">~10 дней</span>
                                            <span className="Price">{FormatPrice.formatPrice(FormatPrice.fastShipPrice(price, constants.course, constants.expressShip, constants.fee))} ₽</span>
                                        </div>
                                        <div className="ICDSVPar">
                                            Экспресс-доставка в Россию займет ~10 дней. Вы можете получить заказ в Москве или же мы отправим его вам через СДЭК
                                        </div>
                                    </div>
                                    <div className="ICDPrice">{chosenShip === 'slow' ? FormatPrice.formatPrice(FormatPrice.slowShipPrice(price, constants.course, constants.standartShip, constants.fee)) : FormatPrice.formatPrice(FormatPrice.fastShipPrice(price, constants.course, constants.expressShip, constants.fee))} ₽</div>
                                    {countInCart(item.item_uid, chosenSize) > 0 ?
                                        <div className="ICDBuyInCart">
                                            <div className="ICDBBtnInCart White">
                                                <img src={minus} alt="Убрать из корзины" />
                                                <span>{countInCart(item.item_uid, chosenSize)} в корзине</span>
                                                <img src={plus} alt="Добавить в корзину" />
                                                <span className="RemoveCartAbsolute" onClick={removeFromCart}></span>
                                                <span className="AddCartAbsolute" onClick={toCart}></span>
                                            </div>
                                            <div className="ICDBBtnInCart" onClick={navigateToOrder}>
                                                <span className="Sub">Оформить заказ</span>
                                                <span className="Size">{chosenSize} {item.category === 'shoes' ? 'EU' : ''}</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="ICDBuy">
                                            <div className="ICDBBtn" onClick={navigateToOrder}>
                                                <span className="Sub">Заказать</span>
                                                <span className="Size">{chosenSize} {item.category === 'shoes' ? 'EU' : ''}</span>
                                            </div>
                                            <div className="ICSBCart" onClick={toCart}>
                                                <img src={cart} alt="В корзину" />
                                            </div>
                                        </div>
                                    }
                                    <div className="ICDSplit"><span>по {chosenShip === 'slow' ? FormatPrice.formatPrice(FormatPrice.slowSplitPrice(price, constants.course, constants.standartShip, constants.fee)) : FormatPrice.formatPrice(FormatPrice.fastSplitPrice(price, constants.course, constants.expressShip, constants.fee))} ₽ x 2 платежа</span><div className="BackGradient"></div></div>
                                    <div className="ItemCardLine" />
                                    <div className="ICDHelpSub">Помощь:</div>
                                    <div className="ICDHelpPar">
                                        Если у вас есть какие-либо вопросы или вам нужна помощь в выборе размера или модели,
                                        напишите нам в Telegram. Мы будем рады помочь вам!
                                    </div>
                                    <div className="ICDTgBtn">Написать в телеграм</div>
                                    <div className="ItemCardLine" />
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <div className="LoaderBox">
                        <span className="Loader"></span>
                    </div>
                }
                <MainPopular sub="Похожие товары" maxElements={5} mobileElements={6} />
                <WatchedItems />
                {item && item.sizes &&
                    <div className="SizesTableModal" onClick={hideTableModal}>
                        <div className="SizesTableBox">
                            <div className="STBTop">
                                <div className="STBSub">Таблица размеров</div>
                                <div className="STBClose">
                                    <img src={close} alt="Закрыть" />
                                </div>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>EU</th>
                                        <th>US</th>
                                        <th>UK</th>
                                        <th>RU</th>
                                        <th>СМ</th>
                                    </tr>
                                    {item.sizes && sortItemsBySize(item.sizes).map((size, i) => {
                                        if (size.size_type === 'EU')
                                            return (
                                                <tr key={i}>
                                                    <td>{size.size}</td>
                                                    <td>{item.sizes.find(item => item.size_default === size.size && item.size_type === 'US') ? item.sizes.find(item => item.size_default === size.size && item.size_type === 'US').size : '/'}</td>
                                                    <td>{item.sizes.find(item => item.size_default === size.size && item.size_type === 'UK') ? item.sizes.find(item => item.size_default === size.size && item.size_type === 'UK').size : '/'}</td>
                                                    <td>{item.sizes.find(item => item.size_default === size.size && item.size_type === 'RU') ? item.sizes.find(item => item.size_default === size.size && item.size_type === 'RU').size : '/'}</td>
                                                    {/* <td>{item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP') ? item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size : '/'}</td> */}
                                                    <td>
                                                        {item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP') ?
                                                            ((item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size > 80) ?
                                                                (item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size / 10) :
                                                                item.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size) :
                                                            '/'}
                                                    </td>
                                                </tr>
                                            )
                                        else return null
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                <div className="LoginModalContainer" onClick={hideLoginModal}>
                    <div className="LoginModal">
                        <div className="LMTop">
                            <div className="LMSub">Авторизация</div>
                            <div className="LMClose">
                                <img src={close} alt="Закрыть" />
                            </div>
                        </div>
                        <p>Для оформления заказа необходимо авторизоваться. Если у вас нет аккаунта, вы можете зарегистрироваться с помощью Telegram.</p>
                        <div className="LoginModalBtn" onClick={handleAuth}>Войти</div>
                    </div>
                </div>
            </div>
        )
    } else {
        if (!isLoading)
            return (
                <Error />
            )
        if (isLoading) {
            return (
                <div className="LoaderBox">
                    <div className="Loader"></div>
                </div>
            )
        }
    }
})