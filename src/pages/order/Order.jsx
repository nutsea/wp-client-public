import React, { useContext, useEffect, useState } from "react";
import "./Order.scss";
import { checkOrderCost, fetchCartItems } from "../../http/itemAPI";
import { checkUser } from "../../http/userAPI";
import { findUserCart, deleteFromCart, clearUserCart } from "../../http/cartAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPoints } from "../../http/cdekAPI";

import close from '../../assets/close2.svg'
import trash from '../../assets/trash.svg'
import fastShip from '../../assets/fastShip.svg'
import slowShip from '../../assets/slowShip.svg'
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import queryString from "query-string";
import { sendOrder } from "../../http/orderAPI";
import { checkPromo } from "../../http/promoAPI";
import FormatPrice from "../../utils/FormatPrice";

export const Order = observer(() => {
    const { constants } = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    const { item_uid, size, ship } = queryString.parse(location.search)
    const [cart, setCart] = useState()
    // eslint-disable-next-line
    const [userId, setUserId] = useState()
    const [user, setUser] = useState()
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [delivery, setDelivery] = useState('point')
    const [address, setAddress] = useState('')
    const [points, setPoints] = useState([])
    const [autocomplete, setAutocomplete] = useState([])
    const [payment, setPayment] = useState('full')
    const [costCheck, setCostCheck] = useState(false)
    const [actualCost, setActualCost] = useState(false)
    const [promo, setPromo] = useState('')
    const [isPromo, setIsPromo] = useState(true)
    const [discount, setDiscount] = useState(0)
    const [isOrdering, setIsOrdering] = useState(false)

    const navigateToCatalogue = () => {
        navigate('/catalogue')
        window.scrollTo({
            top: 0,
        })
    }

    const handlePhone = (e) => {
        const formattedNumber = formatPhoneNumber(e)
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setPhoneNumber(formattedNumber)
        setSendNumber(cleaned)
    }

    const formatPhoneNumber = (e) => {
        let cleaned
        cleaned = ('' + e.target.value).replace(/\D/g, '')
        if (e.target.value[0] === '+' && e.target.value[1] === '7') {
            cleaned = ('' + e.target.value.slice(2)).replace(/\D/g, '')
        } else if ((e.target.value[0] === '8' || e.target.value[0] === '7') && e.target.value.length > 1) {
            cleaned = ('' + e.target.value.splice(1)).replace(/\D/g, '')
        } else {
            cleaned = ('' + e.target.value).replace(/\D/g, '')
        }
        setSendNumber('7' + cleaned)
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
        let formattedNumber
        switch (cleaned.length) {
            case 10:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 9:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 8:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-`
                break
            case 7:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}`
                break
            case 6:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-`
                break
            case 5:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 4:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 3:
                formattedNumber = !match ? '' : `(${match[1]}) `
                break
            case 2:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 1:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 0:
                formattedNumber = !match ? '' : ``
                break

            default:
                break
        }

        return '+7 ' + formattedNumber
    }

    const handleBackspace = (e) => {
        if (e.keyCode === 8 || e.key === 'Backspace') {
            e.preventDefault()
            const cleaned = ('' + e.target.value.slice(3)).replace(/\D/g, '')
            const match = cleaned.split('')
            let formattedNumber
            let isEmpty = false
            switch (cleaned.length) {
                case 10:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-${match[8]}`
                    break
                case 9:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-`
                    break
                case 8:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}`
                    break
                case 7:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-`
                    break
                case 6:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}`
                    break
                case 5:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}`
                    break
                case 4:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) `
                    break
                case 3:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}`
                    break
                case 2:
                    formattedNumber = !match ? '' :
                        `(${match[0]}`
                    break
                case 1:
                    formattedNumber = !match ? '' : ``
                    isEmpty = true
                    break
                case 0:
                    formattedNumber = !match ? '' : ``
                    isEmpty = true
                    break

                default:
                    break
            }
            const newCleaned = ('7' + formattedNumber).replace(/\D/g, '')
            if (!isEmpty) setPhoneNumber('+7 ' + formattedNumber)
            else setPhoneNumber(formattedNumber)
            setSendNumber(newCleaned)
        }
    }

    const phoneFormat = (phone) => {
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.length === 11) {
            const country = cleaned[0] === '8' ? '+7' : `+${cleaned[0]}`;
            const rest = cleaned.slice(1);
            return `${country} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
        } else if (cleaned.length === 12 && cleaned.startsWith('7')) {
            return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
        } else {
            return 'Invalid phone number';
        }
    }

    const chooseDelivery = (type) => {
        setDelivery(type)
    }

    const choosePayment = (type) => {
        setPayment(type)
    }

    const handleAddress = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete([])
        } else {
            setAutocomplete(points.filter(point => {
                const cityAddress = point.city + ', ' + point.address
                let allCompare = true
                for (let i of valueArr) {
                    if (!cityAddress.toLowerCase().includes(i.toLowerCase())) allCompare = false
                }
                return allCompare
            }))
        }
        setAddress(value)
    }

    const findItems = async () => {
        if (item_uid && size && ship) {
            await fetchCartItems([{ item_uid, size, ship }]).then(data => {
                setCart(data)
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
        } else {
            await fetchCartItems(JSON.parse(localStorage.getItem('cart'))).then(data => {
                setCart(data)
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
    }

    const cartCount = (length) => {
        const count = length
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

    const fastItems = () => {
        return cart.filter((item) => item.ship === 'fast')
    }

    const slowItems = () => {
        return cart.filter((item) => item.ship === 'slow')
    }

    const checkUserId = async () => {
        try {
            await checkUser().then(async (data) => {
                setUserId(data.user.id)
                setUser(data.user)
                // data.user.name && setName(data.user.name)
                // data.user.surname && setSurname(data.user.surname)
                // data.user.phone && setPhoneNumber(phoneFormat(data.user.phone))
                // data.user.phone && setSendNumber(data.user.phone)
                if (item_uid && size && ship) {
                    await fetchCartItems([{ item_uid, size, ship }]).then(data => {
                        setCart(data)
                    })
                } else {
                    await findUserCart(data.user.id).then(data => {
                        setCart(data)
                    })
                }
            })
        } catch (e) {
            findItems()
        }
    }

    const setUserData = async () => {
        try {
            await checkUser().then(async (data) => {
                setUserId(data.user.id)
                setUser(data.user)
                data.user.name && setName(data.user.name)
                data.user.surname && setSurname(data.user.surname)
                data.user.phone && setPhoneNumber(phoneFormat(data.user.phone))
                data.user.phone && setSendNumber(data.user.phone)
                if (item_uid && size && ship) {
                    await fetchCartItems([{ item_uid, size, ship }]).then(data => {
                        setCart(data)
                    })
                } else {
                    await findUserCart(data.user.id).then(data => {
                        setCart(data)
                    })
                }
            })
        } catch (e) {
            findItems()
        }
    }

    const findPoints = async () => {
        await fetchPoints().then(data => {
            setPoints(data)
        })
    }

    const checkCost = async () => {
        document.querySelector('.OrderCostChecker').classList.add('Active')
        const timeoutPromise = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))

        try {
            let idArr = [...new Set(cart.map(cartItem => cartItem.item_uid))]
            await Promise.race([
                checkOrderCost(idArr).then(async data => {
                    await checkUserId()
                    setCostCheck(true)
                    setActualCost(true)
                    document.querySelector('.OrderCheckError').classList.remove('Active')
                    document.querySelector('.OrderCostChecker').classList.remove('Active')
                }),
                timeoutPromise(20000)
            ])
        } catch (e) {
            setCostCheck(true)
            setActualCost(false)
            document.querySelector('.OrderCheckError').classList.add('Active')
            document.querySelector('.OrderCostChecker').classList.remove('Active')
        }
    }

    const removeFromCart = async (i, item) => {
        if (userId) {
            await deleteFromCart(item.item_uid, item.size, userId).then(() => {
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
    }

    const checkInputs = () => {
        let correct = true
        if (address.length === 0) {
            document.querySelector('.AddressCheck').classList.add('InputError')
            document.querySelector('.AddressCheck').focus()
            correct = false
        }
        if (sendNumber.length !== 11) {
            document.querySelector('.PhoneCheck').classList.add('InputError')
            document.querySelector('.PhoneCheck').focus()
            correct = false
        }
        if (patronymic.length === 0) {
            document.querySelector('.PatronymicCheck').classList.add('InputError')
            document.querySelector('.PatronymicCheck').focus()
            correct = false
        }
        if (surname.length === 0) {
            document.querySelector('.SurnameCheck').classList.add('InputError')
            document.querySelector('.SurnameCheck').focus()
            correct = false
        }
        if (name.length === 0) {
            document.querySelector('.NameCheck').classList.add('InputError')
            document.querySelector('.NameCheck').focus()
            correct = false
        }
        return correct
    }

    const checkInputsNoError = () => {
        if (address.length === 0) return false
        if (sendNumber.length !== 11) return false
        if (patronymic.length === 0) return false
        if (surname.length === 0) return false
        if (name.length === 0) return false
        return true
    }

    const sendPromo = async () => {
        await checkPromo(promo).then(data => {
            if (data) {
                setDiscount(data.discount)
                setIsPromo(true)
            } else {
                setIsPromo(false)
            }
        })
    }

    const removePromo = () => {
        setPromo('')
        setDiscount(0)
        setIsPromo(true)
    }

    const createOrder = async () => {
        setIsOrdering(true)
        document.querySelector('.OrderOrdererError').classList.remove('Active')
        if (!checkInputs()) return
        const slowItems = cart.filter(item => item.ship === 'slow')
        const fastItems = cart.filter(item => item.ship === 'fast')
        let newSlowItems = []
        let newFastItems = []
        for (let i of slowItems) {
            newSlowItems.push({
                item_uid: i.item_uid,
                name: i.name,
                size: i.size,
                ship: i.ship,
                cny_cost: i.price / 100,
                // rub_cost: FormatPrice.slowShipPrice(i.price, constants.course, constants.standartShip, constants.fee),
                rub_cost: i.price / 100 * constants.course,
                fee: constants.fee,
                delivery_cost: constants.standartShip
            })
        }
        for (let i of fastItems) {
            newFastItems.push({
                item_uid: i.item_uid,
                name: i.name,
                size: i.size,
                ship: i.ship,
                cny_cost: i.price / 100,
                // rub_cost: FormatPrice.fastShipPrice(i.price, constants.course, constants.expressShip, constants.fee),
                rub_cost: i.price / 100 * constants.course,
                fee: constants.fee,
                delivery_cost: constants.expressShip
            })
        }
        try {
            if (newSlowItems.length > 0) {
                await sendOrder(
                    user.name, // имя
                    user.link, // никнейм
                    actualCost, // проверена ли цена
                    `${surname} ${name} ${patronymic}`, // фио
                    sendNumber, // телефон
                    address, // адрес
                    delivery, // курьер или пвз
                    constants.standartShip, // стоимость доставки
                    payment === 'split', // сплит или нет
                    constants.course, // курс
                    constants.fee, // комиссия
                    FormatPrice.formatSlowArray(cart, constants.course, constants.standartShip, constants.fee).shipSum, // сумма заказа
                    // newFastItems.length > 0 ?
                    discount ?
                        (newFastItems.length > 0 ?
                            Math.ceil(FormatPrice.formatSlowArray(cart, constants.course, constants.standartShip, constants.fee).shipSum - (discount / 2)) :
                            Math.ceil(FormatPrice.formatSlowArray(cart, constants.course, constants.standartShip, constants.fee).shipSum - discount)
                        ) :
                        FormatPrice.formatSlowArray(cart, constants.course, constants.standartShip, constants.fee).shipSum, // сумма заказа со скидкой
                    newFastItems.length > 0 ? Math.ceil(discount / 2) : discount, // скидка
                    promo, // промокод
                    newSlowItems // товары
                )
            }
            if (newFastItems.length > 0) {
                await sendOrder(
                    user.name, // имя
                    user.link, // никнейм
                    actualCost, // проверена ли цена
                    `${surname} ${name} ${patronymic}`, // фио
                    sendNumber, // телефон
                    address, // адрес
                    delivery, // курьер или пвз
                    constants.expressShip, // стоимость доставки
                    payment === 'split', // сплит или нет
                    constants.course, // курс
                    constants.fee, // комиссия
                    FormatPrice.formatFastArray(cart, constants.course, constants.expressShip, constants.fee).shipSum, // сумма заказа
                    discount ?
                        (newSlowItems.length > 0 ?
                            Math.ceil(FormatPrice.formatFastArray(cart, constants.course, constants.expressShip, constants.fee).shipSum - (discount / 2)) :
                            Math.ceil(FormatPrice.formatFastArray(cart, constants.course, constants.expressShip, constants.fee).shipSum - discount)
                        ) :
                        FormatPrice.formatFastArray(cart, constants.course, constants.expressShip, constants.fee).shipSum, // сумма заказа со скидкой
                    newSlowItems.length > 0 ? Math.ceil(discount / 2) : discount, // скидка
                    promo, // промокод
                    newFastItems // товары
                )
            }
            await clearUserCart()
            // navigate(`/profile/?tab=orders`)
            navigate(`/thanks`)
            window.scrollTo({
                top: 0
            })
        } catch (e) {
            console.log(e)
            document.querySelector('.OrderOrdererError').classList.add('Active')
            setIsOrdering(false)
        }
    }

    useEffect(() => {
        setUserData()
        findPoints()
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.AddressInputBox')) {
                setAutocomplete([])
            } else {
                const value = document.querySelector('.AddressInput').value
                if (value.length > 0) {
                    const valueArr = value.split(' ')
                    setAutocomplete(points.filter(point => {
                        const cityAddress = point.city + ', ' + point.address
                        let allCompare = true
                        for (let i of valueArr) {
                            if (!cityAddress.toLowerCase().includes(i.toLowerCase())) allCompare = false
                        }
                        return allCompare
                    }))
                }
            }
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (checkInputsNoError() && !costCheck) {
            checkCost()
        }
        // eslint-disable-next-line
    }, [name, surname, patronymic, sendNumber, address])

    return (
        <div className="Order MBInfo">
            <div className="BreadCrumbs">
                <span className="LastCrumb">Главная</span>
                <span className="SlashCrumb">/</span>
                <span className="LastCrumb">Корзина</span>
                <span className="SlashCrumb">/</span>
                <span className="NewCrumb">Оформление заказа</span>
            </div>
            <h2 className="OrderSub">Оформление заказа</h2>
            {cart && cart.length === 0 ?
                <div className="EmptyCart">
                    <h2>Ваша корзина пуста</h2>
                    <p>Кажется, вы еще не добавили товары в корзину. Откройте наш каталог и найдите что-то интересное для себя.</p>
                    <div className="ToMain" onClick={navigateToCatalogue}>Перейти в каталог</div>
                </div>
                : (cart && cart.length > 0) ?
                    <div className="OrderRow">
                        <div className="OrderInputs">
                            <div className="OrderInputsGroup SpaceBetween">
                                <div className="OIGSub">1. Получатель</div>
                                <div className="OrderInputBox InlineInput">
                                    <label>Имя*</label>
                                    <div className="InputRelative">
                                        <input className="NameInput NameCheck" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите Ваше имя" />
                                        {name.length > 0 &&
                                            <div className="InputClose" onClick={() => setName('')}><img src={close} alt="Стереть" /></div>
                                        }
                                    </div>
                                </div>
                                <div className="OrderInputBox InlineInput">
                                    <label>Фамилия*</label>
                                    <div className="InputRelative">
                                        <input className="NameInput SurnameCheck" type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Введите Вашу фамилию" />
                                        {surname.length > 0 &&
                                            <div className="InputClose" onClick={() => setSurname('')}><img src={close} alt="Стереть" /></div>
                                        }
                                    </div>
                                </div>
                                <div className="OrderInputBox InlineInput">
                                    <label>Отчество*</label>
                                    <div className="InputRelative">
                                        <input className="NameInput PatronymicCheck" type="text" value={patronymic} onChange={(e) => setPatronymic(e.target.value)} placeholder="Введите Ваше отчество" />
                                        {patronymic.length > 0 &&
                                            <div className="InputClose" onClick={() => setPatronymic('')}><img src={close} alt="Стереть" /></div>
                                        }
                                    </div>
                                </div>
                                <div className="OrderInputBox BlockInput">
                                    <label>Номер телефона*</label>
                                    <div className="InputRelative">
                                        <input className="NameInput PhoneCheck" type="text" value={phoneNumber} maxLength={18} onChange={handlePhone} onKeyDown={handleBackspace} placeholder="Ваш номер телефона" />
                                        {phoneNumber.length > 0 &&
                                            <div
                                                className="InputClose"
                                                onClick={() => {
                                                    setPhoneNumber('')
                                                    setSendNumber('')
                                                }}
                                            >
                                                <img src={close} alt="Стереть" />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="OrderInputsGroup">
                                <div className="OIGSub MB8">2. Способ доставки</div>
                                <div className={`OrderCheckBox SameBox ${delivery === 'point' ? 'ChosenOrderCheck' : ''}`} onClick={() => chooseDelivery('point')}>
                                    <div className="CheckBoxRow">
                                        <div className="CheckBoxPoint"></div>
                                        <div className="CheckBoxText">
                                            <div className="CheckBoxSub">Пункт выдачи</div>
                                            <div className="CheckBoxSub2">СДЭК</div>
                                        </div>
                                    </div>
                                    <div className="CheckBoxTip">
                                        Вы можете выбрать пункт самовывоза СДЭК. Если пункт
                                        самовывоза не выбран или недоступен, доставка будет
                                        производиться по вашему выбранному адресу. Срок
                                        хранения посылки в ПВЗ составляет 7 календарных дней.
                                    </div>
                                </div>
                                <div className={`OrderCheckBox SameBox ${delivery === 'home' ? 'ChosenOrderCheck' : ''}`} onClick={() => chooseDelivery('home')}>
                                    <div className="CheckBoxRow">
                                        <div className="CheckBoxPoint"></div>
                                        <div className="CheckBoxText">
                                            <div className="CheckBoxSub">Курьер</div>
                                            <div className="CheckBoxSub2">СДЭК</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="OrderInputsGroup">
                                <div className="OIGSub">3. Адреса</div>
                                <div className="OrderInputBox BlockInput AddressInputBox">
                                    {delivery === 'home' ?
                                        <label>Город, улица, дом, корпус, квартира</label>
                                        :
                                        <label>Адрес пункта выдачи СДЭК</label>
                                    }
                                    <div className="InputRelative">
                                        <input className="NameInput AddressInput AddressCheck" type="text" value={address} onChange={handleAddress} placeholder="Введите адрес" />
                                        {address.length > 0 &&
                                            <div
                                                className="InputClose"
                                                onClick={() => {
                                                    setAddress('')
                                                    setAutocomplete([])
                                                }}
                                            >
                                                <img src={close} alt="Стереть" />
                                            </div>
                                        }
                                    </div>
                                    {delivery === 'point' && autocomplete.length > 0 &&
                                        <div className="AutocompleteAddress">
                                            {autocomplete.map((point, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="AutocompleteItem"
                                                        onClick={() => {
                                                            setAddress(point.city + ', ' + point.address)
                                                            setAutocomplete([])
                                                        }}
                                                    >
                                                        {point.city + ', ' + point.address}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="OrderInputsGroup SpaceBetween">
                                <div className="OIGSub MB8">4. Способ оплаты</div>
                                <div className={`OrderCheckBox FitBox1 ${payment === 'full' ? 'ChosenOrderCheck' : ''}`} onClick={() => choosePayment('full')}>
                                    <div className="CheckBoxRow">
                                        <div className="CheckBoxPoint"></div>
                                        <div className="CheckBoxText">
                                            <div className="CheckBoxSub">Оплатить полностью</div>
                                            <div className="CheckBoxSub2">Оплачиваете полную сумму заказа</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`OrderCheckBox FitBox2 ${payment === 'split' ? 'ChosenOrderCheck' : ''} ${FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum > 20000 ? 'Unavailable' : ''}`} onClick={() => choosePayment('split')}>
                                    <div className="CheckBoxRow">
                                        <div className="CheckBoxPoint"></div>
                                        <div className="CheckBoxText">
                                            <div className="CheckBoxSub">Сплит</div>
                                            <div className="CheckBoxSub2">Половину оплачиваете сейчас, а вторую половину после того, как мы пришлём Вам фото отчёт заказа со склада в Китае</div>
                                            <div className="CheckBoxSub2 Bright"><b>Максимальная сумма для сплита - 20 000₽</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="MobileTotal">
                                <div className="OIGSub">Сумма заказа</div>
                                <div className="OrderCount">
                                    <div className="OrderCountText">{cartCount(fastItems().length + slowItems().length)}</div>
                                    <div className="OrderCountSum">{FormatPrice.formatPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum)} ₽</div>
                                </div>
                                <div className="OrderTotal">
                                    <div className="OrderTotalText">Итого</div>
                                    <div className="OrderTotalSum">
                                        <span className={`MainSum ${discount > 0 ? 'SumSmall' : ''}`}>{FormatPrice.formatPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum)} ₽</span>
                                        {discount > 0 &&
                                            <span className="DiscountSum">{FormatPrice.formatPrice(FormatPrice.discountPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum, discount))} ₽</span>
                                        }
                                    </div>
                                </div>
                                {payment === 'split' &&
                                    <>
                                        <div className="OrderSplitInfo">
                                            <div className="OrderSplitText">Предоплата</div>
                                            <div className="OrderSplitSum">{FormatPrice.formatPrice(FormatPrice.discountSplitPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee, constants.standartShip, constants.expressShip, constants.fee).splitShipSum, discount))} ₽</div>
                                        </div>
                                        <div className="OrderSplitInfo">
                                            <div className="OrderSplitText">Постоплата</div>
                                            <div className="OrderSplitSum">{FormatPrice.formatPrice(FormatPrice.discountSplitPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).splitShipSum, discount))} ₽</div>
                                        </div>
                                        <div className="SplitTime">После того как вы посмотрите отчет со склада</div>
                                    </>
                                }
                                <div className="OrderPromo">
                                    <div className="OrderInputBox BlockInput PromoInput">
                                        <label>Ввести промокод</label>
                                        <div className="InputRelative">
                                            <input className="NameInput" type="text" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Ваш промокод" />
                                            {promo.length > 0 &&
                                                <div className="InputClose" onClick={removePromo}><img src={close} alt="Стереть" /></div>
                                            }
                                        </div>
                                    </div>
                                    {!isPromo && <div className="PromoError">Акция не найдена</div>}
                                    {discount > 0 && isPromo && <div className="PromoSuccess">Промокод применен</div>}
                                    <div className="SubmitPromo" onClick={sendPromo}>Применить</div>
                                </div>
                            </div>
                            <div className="OrderBtns">
                                <div
                                    className={
                                        `OrderConfirm ${(
                                            costCheck &&
                                            name.length > 0 &&
                                            surname.length > 0 &&
                                            patronymic.length > 0 &&
                                            sendNumber.length === 11 &&
                                            address.length > 0 &&
                                            !isOrdering
                                        ) ? 'Active' : ''}`
                                    }
                                    onClick={createOrder}
                                >
                                    Подтвердить заказ
                                </div>
                            </div>
                            <div className="OrderCostChecker">
                                <span className="CheckStatic">Проверка стоимости</span>
                                <span className="CheckLoad"></span>
                            </div>
                            {isOrdering &&
                                <div className="OrderOrderer Active">
                                    <span className="CheckStatic">Оформление заказа</span>
                                    <span className="CheckLoad"></span>
                                </div>
                            }
                            <div className="OrderCheckError">Произошла ошибка при проверке цены. Оформите заказ, и мы свяжемся с вами!</div>
                            <div className="OrderOrdererError">Произошла ошибка при оформлении заказа.</div>
                        </div>
                        <div className="OrderInfo">
                            <div className="OrderInfoSub">Ваш заказ</div>
                            {fastItems().length > 0 &&
                                <>
                                    <div className="OrderItems">
                                        {fastItems().map((item, i) => {
                                            return (
                                                <div key={i} className="OrderItem">
                                                    <div className="OrderItemImgBox">
                                                        <img className="OrderItemImg" src={item.img} alt="Фото товара" />
                                                    </div>
                                                    <div className="OrderItemInfo">
                                                        <div className="OrderItemInfoTop">
                                                            <div className="OrderItemName">{item.name}</div>
                                                            <div className="OrderItemModel">{item.model}</div>
                                                        </div>
                                                        <div className="OrderItemSize">Размер: {item.size} {item.category === 'shoes' ? 'EU' : ''}</div>
                                                    </div>
                                                    {(item_uid && size && ship) ?
                                                        <></>
                                                        :
                                                        <div className="OrderItemDelete" onClick={() => removeFromCart(i, item)}>
                                                            <img src={trash} alt="Удалить" />
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="OrderItemsShip">
                                        <img src={fastShip} alt="" />
                                        <span>Экспресс доставка ~10 дней</span>
                                    </div>
                                    <div className="OrderCount">
                                        <div className="OrderCountText">{cartCount(fastItems().length)}</div>
                                        <div className="OrderCountSum">{FormatPrice.formatPrice(FormatPrice.formatFastArray(cart, constants.course, constants.expressShip, constants.fee).shipSum)} ₽</div>
                                    </div>
                                </>
                            }
                            {slowItems().length > 0 &&
                                <>
                                    <div className="OrderItems">
                                        {slowItems().map((item, i) => {
                                            return (
                                                <div key={i} className="OrderItem">
                                                    <div className="OrderItemImgBox">
                                                        <img className="OrderItemImg" src={item.img} alt="Фото товара" />
                                                    </div>
                                                    <div className="OrderItemInfo">
                                                        <div className="OrderItemInfoTop">
                                                            <div className="OrderItemName">{item.name}</div>
                                                            <div className="OrderItemModel">{item.model}</div>
                                                        </div>
                                                        <div className="OrderItemSize">Размер: {item.size} {item.category === 'shoes' ? 'EU' : ''}</div>
                                                    </div>
                                                    {(item_uid && size && ship) ?
                                                        <></>
                                                        :
                                                        <div className="OrderItemDelete" onClick={() => removeFromCart(i, item)}>
                                                            <img src={trash} alt="Удалить" />
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="OrderItemsShip">
                                        <img src={slowShip} alt="" />
                                        <span>Стандартная доставка 20-25 дней</span>
                                    </div>
                                    <div className="OrderCount">
                                        <div className="OrderCountText">{cartCount(slowItems().length)}</div>
                                        <div className="OrderCountSum">{FormatPrice.formatPrice(FormatPrice.formatSlowArray(cart, constants.course, constants.standartShip, constants.fee).shipSum)} ₽</div>
                                    </div>
                                </>
                            }
                            <div className="OrderTotal PCOrder">
                                <div className="OrderTotalText">Итого</div>
                                <div className="OrderTotalSum">
                                    <span className={`MainSum ${discount > 0 ? 'SumSmall' : ''}`}>{FormatPrice.formatPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum)} ₽</span>
                                    {discount > 0 &&
                                        <span className="DiscountSum">{FormatPrice.formatPrice(FormatPrice.discountPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).shipSum, discount))} ₽</span>
                                    }
                                </div>
                            </div>
                            {payment === 'split' &&
                                <>
                                    <div className="OrderSplitInfo PCOrder">
                                        <div className="OrderSplitText">Предоплата</div>
                                        <div className="OrderSplitSum">{FormatPrice.formatPrice(FormatPrice.discountSplitPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).splitShipSum, discount))} ₽</div>
                                    </div>
                                    <div className="OrderSplitInfo PCOrder">
                                        <div className="OrderSplitText">Постоплата</div>
                                        <div className="OrderSplitSum">{FormatPrice.formatPrice(FormatPrice.discountSplitPrice(FormatPrice.formatFullArray(cart, constants.course, constants.standartShip, constants.expressShip, constants.fee).splitShipSum, discount))} ₽</div>
                                    </div>
                                    <div className="SplitTime PCOrder">После того как вы посмотрите отчет со склада</div>
                                </>
                            }
                            <div className="OrderTotalLine PCOrder"></div>
                            <div className="OrderPromo PCOrder">
                                <div className="OrderInputBox BlockInput">
                                    <label>Ввести промокод</label>
                                    <div className="InputRelative">
                                        <input className="NameInput" type="text" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Ваш промокод" />
                                        {promo.length > 0 &&
                                            <div className="InputClose" onClick={removePromo}><img src={close} alt="Стереть" /></div>
                                        }
                                    </div>
                                </div>
                                {!isPromo && <div className="PromoError">Акция не найдена</div>}
                                {discount > 0 && isPromo && <div className="PromoSuccess">Промокод применен</div>}
                                <div className="SubmitPromo" onClick={sendPromo}>Применить</div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
})