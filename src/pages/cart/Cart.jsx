import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Cart.scss'
import { fetchByIds, fetchCartItems } from "../../http/itemAPI";
import { checkUser } from "../../http/userAPI";
import { deleteFromCart, findUserCart } from "../../http/cartAPI";
import { addToFav, deleteFromFav, findUserFav } from "../../http/favAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

import wish from '../../assets/wish6.svg'
import wish2 from '../../assets/wish7.svg'
import trash from '../../assets/trash.svg'
import fastShip from '../../assets/fastShip.svg'
import slowShip from '../../assets/slowShip.svg'
import close from '../../assets/close5.svg'
import FormatPrice from "../../utils/FormatPrice";


export const Cart = observer(() => {
    const { constants, user_cart, user_fav } = useContext(Context)
    const [cart, setCart] = useState()
    const [wishList, setWishList] = useState([])
    const [userId, setUserId] = useState()

    const navigate = useNavigate()

    const navigateToCatalogue = () => {
        navigate('/catalogue')
        window.scrollTo({
            top: 0,
        })
    }

    const handleNavigateItem = (e, id) => {
        if (e.target.id === 'notnav' || e.target.id === 'wish') return
        window.open(`/item/${id}`, '_blank')
    }

    const navigateToOrder = () => {
        if (userId) {
            navigate('/order')
            window.scrollTo({
                top: 0,
            })
        } else {
            showLoginModal()
        }
    }

    const findItems = async () => {
        await fetchCartItems(JSON.parse(localStorage.getItem('cart'))).then(data => {
            setCart(data)
            user_cart.setCart(data)
            const items = document.getElementsByClassName('CartItem')
            const lines = document.getElementsByClassName('CartLine')
            const lines2 = document.getElementsByClassName('CartLine2')
            for (let i of items) {
                i.classList.remove('CartRemove')
            }
            for (let i of lines) {
                i.classList.remove('LineRemove')
                i.classList.remove('LineRemove2')
            }
            for (let i of lines2) {
                i.classList.remove('LineRemove')
                i.classList.remove('LineRemove2')
            }
        })
    }

    const toWish = async (item) => {
        if (userId) {
            if (!wishList.includes(item.id)) {
                await addToFav(item.id, userId).then(async () => {
                    await findUserFav(userId).then(async data => {
                        setWishList(data.map(item => item.item_uid))
                        await fetchByIds(data.map(item => item.item_uid)).then((data2) => {
                            user_fav.setFav(data2)
                        })
                    })
                })
            } else {
                await deleteFromFav(item.id, userId).then(async () => {
                    await findUserFav(userId).then(async data => {
                        setWishList(data.map(item => item.item_uid))
                        await fetchByIds(data.map(item => item.item_uid)).then((data2) => {
                            user_fav.setFav(data2)
                        })
                    })
                })
            }
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
            setWishList(JSON.parse(localStorage.getItem('wish')))
        }
    }

    const removeFromCart = (i, item) => {
        document.getElementById(`itemBox${i}`)?.classList.add('CartRemove')
        document.getElementById(`line${i}`)?.classList.add('LineRemove')
        document.getElementById(`line${i + 1}`)?.classList.add('LineRemove2')
        if (!document.getElementById(`line${i + 1}`)) {
            document.querySelector('.CartLine2')?.classList.add('LineRemove2')
        }
        setTimeout(async () => {
            if (userId) {
                await deleteFromCart(item.item_uid, item.size, userId, item.ship).then(() => {
                    setCart(null)
                    user_cart.setCart(null)
                    checkUserId()
                })
            } else {
                const index = cart.indexOf(item)
                const oldItems = JSON.parse(localStorage.getItem('cart'))
                if (Array.isArray(oldItems)) {
                    oldItems.splice(index, 1)
                }
                localStorage.setItem('cart', JSON.stringify(oldItems))
                findItems()
            }
        }, 500);
    }

    const cartCount = () => {
        const count = cart.length
        let word

        if (count % 100 >= 11 && count % 100 <= 19) {
            word = 'товаров'
        } else {
            switch (count % 10) {
                case 1:
                    word = 'товар'
                    break
                case 2:
                case 3:
                case 4:
                    word = 'товара'
                    break
                default:
                    word = 'товаров'
                    break
            }
        }

        return `${count} ${word} на сумму`
    }

    const checkUserId = async () => {
        try {
            await checkUser().then(async (data) => {
                setUserId(data.user.id)
                await findUserCart(data.user.id).then(async data2 => {
                    setCart(data2)
                    user_cart.setCart(data2)
                })
                await findUserFav(data.user.id).then(async (data2) => {
                    setWishList(data2.map(item => item.item_uid))
                })
            })
        } catch (e) {
            findItems()
            const wishArr = JSON.parse(localStorage.getItem('wish'))
            if (wishArr && Array.isArray(wishArr)) {
                setWishList(wishArr)
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
        checkUserId()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="Cart MBInfo">
            <div className="BreadCrumbs">
                <span className="LastCrumb">Главная</span>
                <span className="SlashCrumb">/</span>
                <span className="NewCrumb">Корзина</span>
            </div>
            <h2 className="CartSub">Корзина</h2>
            {cart && cart.length === 0 ?
                <div className="EmptyCart">
                    <h2>Ваша корзина пуста</h2>
                    <p>Кажется, вы еще не добавили товары в корзину. Откройте наш каталог и найдите что-то интересное для себя.</p>
                    <div className="ToMain" onClick={navigateToCatalogue}>Перейти в каталог</div>
                </div>
                : (cart && cart.length > 0) ?
                    <div className="CartRow">
                        <div className="CartItems">
                            {cart.map((item, i) => {
                                return (
                                    <div key={i} style={{ width: '100%' }}>
                                        <div className={`CartLine ${i === 0 ? 'LineFirst' : ''}`} id={`line${i}`} />
                                        <div className="CartItem" id={`itemBox${i}`}>
                                            <div className="CartItemImg" id={`item${i}`} onClick={(e) => handleNavigateItem(e, item.id)}>
                                                <img className="CartItemImgStyle" src={item.img} alt={item.name} />
                                            </div>
                                            <div className="CartItemInfo">
                                                <div className="CartItemIntoTop">
                                                    <div className="CartItemName" id={`item${i}`} onClick={(e) => handleNavigateItem(e, item.id)}>
                                                        {item.name}
                                                        <div className="CartItemWish">
                                                            {/* {!wishList.includes(item.id) ?
                                                                <img src={wish} alt="Добавить в избранное" id="wish" onClick={() => toWish(item)} />
                                                                :
                                                                <img src={wish2} alt="Добавлено в избранное" id="wish" onClick={() => toWish(item)} />
                                                            } */}
                                                            <div className="WishIconBoxCart" id="wish">
                                                                <img className={`WishIconCart ${!wishList.includes(item.id) ? 'Active' : ''}`} src={wish} alt="wish" id="wish" onClick={() => toWish(item)} />
                                                                <img className={`WishIconCart ${wishList.includes(item.id) ? 'Active' : ''}`} src={wish2} alt="wish" id="wish" onClick={() => toWish(item)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="CartItemModel">{item.model}</div>
                                                    <div className="CartItemSize">Размер: {item.size} {item.category === 'shoes' ? 'EU' : ''}</div>
                                                    <div className="CartItemShip">
                                                        {item.ship === 'slow' ?
                                                            <>
                                                                <img src={slowShip} alt="" />
                                                                <span>Стандартная доставка 20-25 дней</span>
                                                            </>
                                                            :
                                                            <>
                                                                <img src={fastShip} alt="" />
                                                                <span>Экспресс доставка ~10 дней</span>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="CartItemInfoBottom">
                                                    <div className="CartItemPrice">{FormatPrice.formatPrice(FormatPrice.shipPrice(item.price, constants.course, item.ship, constants.standartShip, constants.expressShip, constants.fee))} ₽</div>
                                                </div>
                                            </div>
                                            <div className="CartItemDrop">
                                                {/* {!wishList.includes(item.id) ?
                                                    <img className="CartItemWish2" src={wish} alt="Добавить в избранное" id="wish" onClick={() => toWish(item)} />
                                                    :
                                                    <img className="CartItemWish2" src={wish2} alt="Добавлено в избранное" id="wish" onClick={() => toWish(item)} />
                                                } */}
                                                <div className="WishIconBoxCart CartItemWish2" id="wish">
                                                    <img className={`WishIconCart ${!wishList.includes(item.id) ? 'Active' : ''}`} src={wish} alt="wish" id="wish" onClick={() => toWish(item)} />
                                                    <img className={`WishIconCart ${wishList.includes(item.id) ? 'Active' : ''}`} src={wish2} alt="wish" id="wish" onClick={() => toWish(item)} />
                                                </div>
                                                <img src={trash} alt="Удалить из корзины" id="notnav" onClick={() => removeFromCart(i, item)} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="CartLine2" />
                        </div>
                        <div className="CartOrder">
                            <div className="CartOrderSub">Сумма заказа</div>
                            <div className="CartOrderCount">
                                <div className="CartCountText">{cartCount()}</div>
                                <div className="CartCountSum">{FormatPrice.formatPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum)} ₽</div>
                            </div>
                            <div className="CartTotal">
                                <div className="CartTotalText">Итого</div>
                                <div className="CartTotalSum">{FormatPrice.formatPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum)} ₽</div>
                            </div>
                            <div className="CartOrderBtn" onClick={navigateToOrder}>Перейти к оформлению</div>
                        </div>
                    </div>
                    :
                    <div className="LoaderBox2">
                        <div className="Loader"></div>
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
})