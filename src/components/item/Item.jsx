import React, { useContext, useEffect, useState } from "react";
import './Item.scss'

import wish from '../../assets/wish2.svg'
import wish2 from '../../assets/wish5.svg'
import { checkUser } from "../../http/userAPI";
import { addToFav, deleteFromFav, findUserFav } from "../../http/favAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import FormatPrice from "../../utils/FormatPrice";
import { fetchByIds } from "../../http/itemAPI";

export const Item = observer(({ item, globalCatalogue }) => {
    const { constants, user_fav } = useContext(Context)
    // const [wishList, setWishList] = useState([])
    const [isWished, setIsWished] = useState(false)
    const [userId, setUserId] = useState()

    const handleNavigate = (e) => {
        if (e.target.id !== 'wish') {
            window.open(`/item/${item.id}`, '_blank')
        }
    }

    const checkUserId = async () => {
        try {
            await checkUser().then(async (data) => {
                setUserId(data.user.id)
                await findUserFav(data.user.id).then(async (data2) => {
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

    useEffect(() => {
        checkUserId()
        // eslint-disable-next-line
    }, [])

    return (
        <div className={`ItemContainer ${globalCatalogue ? 'Global' : ''}`}>
            <div className="ItemTop">
                <div className={`ItemImg ${globalCatalogue ? 'Global' : ''}`} onClick={handleNavigate}>
                    <div className="ItemImgBox">
                        <img className="ItemImgStyle" src={item.img} alt="Фото товара" />
                    </div>
                    <div className="WishIconBox" id="wish" onClick={toWish}>
                        {/* <img className={`WishIcon ${!isWished ? 'Active' : ''}`} src={wish} alt="wish" id="wish" onClick={toWish} />
                        <img className={`WishIcon ${isWished ? 'Active' : ''}`} src={wish2} alt="wish" id="wish" onClick={toWish} /> */}
                        <img className={`WishIcon ${!isWished ? 'Active' : ''}`} src={wish} alt="wish" />
                        <img className={`WishIcon ${isWished ? 'Active' : ''}`} src={wish2} alt="wish"/>
                    </div>
                </div>
                <div className="ItemSub" onClick={handleNavigate}>{item.name}</div>
            </div>
            <div className={`ItemInfo ${globalCatalogue ? 'Global' : ''}`}>
                <div className="IIBottom">
                    <div className="ItemSplit"><span>по {FormatPrice.slowSplitPrice(item.minPrice, constants.course, constants.standartShip, constants.fee)} ₽ x 2 платежа</span></div>
                    <div className="ItemPrice">{FormatPrice.formatPrice(FormatPrice.slowShipPrice(item.minPrice, constants.course, constants.standartShip, constants.fee))} ₽</div>
                    <div className="ItemShip">Доставка: 20 дней</div>
                </div>
            </div>
        </div>
    )
})