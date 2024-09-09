import React, { useEffect, useState } from "react";
import "./ProfileOrders.scss"
import { fetchClientOrders, fetchOrderItems, fetchOrderReport } from "../../http/orderAPI";
import FormatPrice from "../../utils/FormatPrice";

import fastShip from '../../assets/fastShip.svg'
import split1 from '../../assets/split1.svg'
import split2 from '../../assets/split2.svg'
import reportBuy from '../../assets/reportBuy.png'
import demoReport from '../../assets/demoReport.svg'
import reportStock1 from '../../assets/reportStock1.png'
import reportStock2 from '../../assets/reportStock2.png'
import reportStock3 from '../../assets/reportStock3.png'
import reportStock4 from '../../assets/reportStock4.png'
import reportStock5 from '../../assets/reportStock5.png'
import reportStock6 from '../../assets/reportStock6.png'
import { fetchOneItemBySpu } from "../../http/itemAPI";

const orderStatus = [
    { id: 0, name: 'В обработке' },
    { id: 1, name: 'Принят' },
    { id: 2, name: 'Выкуплен' },
    { id: 3, name: 'Получен трек' },
    { id: 4, name: 'Принят в Китае' },
    { id: 5, name: 'Оформляется' },
    { id: 6, name: 'Доставляется в Россию' },
    { id: 7, name: 'Прибыл в Россию' },
    { id: 8, name: 'Передан в СДЭК' },
    { id: 9, name: 'Выполнен' },
    { id: 10, name: 'Требует уточнений' },
    { id: 11, name: 'Отменен' },
]

export const ProfileOrders = ({ user }) => {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const handleNavigate = async (item) => {
        try {
            await fetchOneItemBySpu(item.item_uid).then(data => {
                window.open(`/item/${data.id}`, '_blank')
            })
        } catch (e) {
            window.open(`/item/outofstock`, '_blank')
        }
    }

    const getOrders = async () => {
        try {
            const data = await fetchClientOrders()
            const orderPromises = data.map(async (i) => {
                const items = await fetchOrderItems(i.id)
                const buyReport = await fetchOrderReport(i.id, 'buy')
                const stockReport = await fetchOrderReport(i.id, 'stock')
                return { ...i, items, buyReport, stockReport }
            })
            const orders = await Promise.all(orderPromises)
            setOrders(orders)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const sortById = (a, b) => {
        if (a.id > b.id) {
            return -1
        }
        if (a.id < b.id) {
            return 1
        }
    }

    const formatPhone = (phone) => {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
    }

    useEffect(() => {
        getOrders()
    }, [])

    useEffect(() => {
        console.log(orders)
    }, [orders])

    return (
        <div className="ProfileOrders">
            {isLoading &&
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
            }
            {orders.length === 0 && !isLoading &&
                <div className="POEmpty">У вас пока нет заказов</div>
            }
            {orders && orders.length > 0 ?
                <>
                    {orders.sort(sortById).map((order, i) => {
                        if (order.items.length === 0) return null
                        return (
                            <div key={i} className="POrderBox">
                                <div className="POInfo">
                                    <div className="POTop">
                                        <div className="POTitle">№{order.id} на {FormatPrice.formatPrice(order.discount_cost)} ₽</div>
                                        {order.items[0].ship === 'fast' &&
                                            <div className="POShip">
                                                <img src={fastShip} alt="Экспресс" />
                                                <span>Экспресс доставка</span>
                                            </div>
                                        }
                                    </div>
                                    <div className="POStatusBox">
                                        <div className={`POStatus ${order.status === 11 ? 'Red' : ''}`}>{orderStatus[order.status].name}</div>
                                        {order.items[0].ship === 'fast' &&
                                            <div className="POShip2">
                                                <img src={fastShip} alt="" />
                                                <span>Экспресс доставка</span>
                                            </div>
                                        }
                                    </div>
                                    <div className="POItems">
                                        {order.items.map((item, j) => {
                                            return (
                                                <div key={j} className="POItemCard" onClick={() => handleNavigate(item)}>
                                                    <div className="POImgBox">
                                                        <img src={item.img} alt="Фото товара" />
                                                    </div>
                                                    <div className="POItemName">{item.name}</div>
                                                    <div className="POItemModel">{item.model}</div>
                                                    <div className="POItemSize">Размер: {item.size} {item.category === 'shoes' ? 'EU' : ''}</div>
                                                    <div className="POItemPrice">{FormatPrice.formatPrice(item.rub_cost)} ₽</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <h2 className="POInfoSub">Данные по заказу</h2>
                                    <div className="POInfoItem">
                                        <span className="POTip">ФИО получателя</span>
                                        <span className="POInfoText">{order.recipient}</span>
                                    </div>
                                    <div className="POInfoItem">
                                        <span className="POTip">Номер телефона</span>
                                        <span className="POInfoText">{formatPhone(order.phone)}</span>
                                    </div>
                                    <div className="POInfoItem">
                                        <span className="POTip">Способ доставки</span>
                                        <span className="POInfoText">{order.ship_type === 'home' ? 'Курьером до двери' : 'В пункт выдачи'}</span>
                                    </div>
                                    <div className="POInfoItem">
                                        <span className="POTip">Адрес доставки</span>
                                        <span className="POInfoText">{order.address}</span>
                                    </div>
                                    <div className="POInfoItem">
                                        <span className="POTip">Способ оплаты</span>
                                        <span className="POInfoText">
                                            {!order.is_split ?
                                                'Полная оплата'
                                                :
                                                <div className="POSplitInfo">
                                                    <div className="POSplitItem">
                                                        {order.first_paid ?
                                                            <img src={split1} alt="Оплачено" />
                                                            :
                                                            <img src={split2} alt="Не оплачено" />
                                                        }
                                                        <span>Первая часть сплита - {FormatPrice.formatSplitPrice(order.discount_cost)} руб.</span>
                                                    </div>
                                                    <div className="POSplitItem">
                                                        {order.second_paid ?
                                                            <img src={split1} alt="Оплачено" />
                                                            :
                                                            <img src={split2} alt="Не оплачено" />
                                                        }
                                                        <span>Вторая часть сплита - {FormatPrice.formatSplitPrice(order.discount_cost)} руб.</span>
                                                    </div>
                                                </div>
                                            }
                                        </span>
                                    </div>
                                    {order.sdek_track &&
                                        <>
                                            <h2 className="POInfoSub2">Трек номер СДЭК</h2>
                                            <div className="POTrack">94030104858930920</div>
                                        </>
                                    }
                                    <div className="POContactBtn">Связаться с нами</div>
                                </div>
                                <div className="POReport">
                                    <div className="POReportSub">Отчет о выкупе</div>
                                    <div className="POReportBuyPhotos">
                                        {order.buyReport && order.buyReport.length > 0 ?
                                            <>
                                                {order.buyReport.map((photo, k) => {
                                                    return (
                                                        <div key={k} className="POReportBuyImgBox">
                                                            <img src={process.env.REACT_APP_API_URL + photo.img} alt="Фото отчет" />
                                                        </div>
                                                    )
                                                })}</>
                                            :
                                            <>
                                                <div className="POReportBuyImgBox DemoImg">
                                                    <img src={reportBuy} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportBuyImgBox DemoImg">
                                                    <img src={reportBuy} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportBuyImgBox DemoImg">
                                                    <img src={reportBuy} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportDemoBox">
                                                    <img src={demoReport} alt="" />
                                                    <span>Скоро мы выкупим ваш заказ и добавим сюда информацию о выкупе!</span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="POReportSub">Отчет о прибытии на склад</div>
                                    <div className="POReportStockPhotos">
                                        {order.stockReport && order.stockReport.length > 0 ?
                                            <>
                                                {order.stockReport.map((photo, k) => {
                                                    return (
                                                        <div key={k} className="POReportStockImgBox">
                                                            <img src={process.env.REACT_APP_API_URL + photo.img} alt="Фото отчет" />
                                                        </div>
                                                    )
                                                })}</>
                                            :
                                            <>
                                                <div className="POReportStockImgBox DemoImg">
                                                    <img src={reportStock1} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg">
                                                    <img src={reportStock2} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg">
                                                    <img src={reportStock3} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg">
                                                    <img src={reportStock4} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg">
                                                    <img src={reportStock5} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg DemoPC">
                                                    <img src={reportStock6} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg DemoPC">
                                                    <img src={reportStock1} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg DemoPC">
                                                    <img src={reportStock2} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportStockImgBox DemoImg DemoPC">
                                                    <img src={reportStock3} alt="Демо отчет" />
                                                </div>
                                                <div className="POReportDemoBox">
                                                    <img src={demoReport} alt="" />
                                                    <span>Скоро мы выкупим ваш заказ и добавим сюда информацию о выкупе!</span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
                :
                <></>
            }
        </div>
    )
}