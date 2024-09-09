import React from "react";
import { useNavigate } from 'react-router-dom';
import './Payment.scss'

import sber from './imgs/sber.png'
import tink from './imgs/tink.png'
import sbp from './imgs/sbp.png'
import mock from './imgs/mock.png'
import point from './imgs/point.svg'
import point2 from './imgs/point2.svg'

export const Payment = () => {
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
    }

    return (
        <div className="MainContainer MBInfo">
            <div className="BreadCrumbs">
                <span className="LastCrumb" id="/" onClick={handleNavigate}>Главная</span>
                <span className="SlashCrumb">/</span>
                <span className="NewCrumb">Оплата и доставка</span>
            </div>
            <div className="PaymentInfo">
                <h2>Оплата</h2>
                <p>
                    При оформлении заказа вы сможете выбрать способ доставки и указать данные получателя. 
                    Оплата наших товаров — безопасная. В нашем сервисе вы можете оплатить свой заказ любым 
                    удобным для вас способом:
                </p>
                <div className="PayTypes">
                    <div className="PayType">
                        <img className="SberType" src={sber} alt="Сбербанк" />
                    </div>
                    <div className="PayType">
                        <img className="TinkType" src={tink} alt="Тинькофф" />
                    </div>
                    <div className="PayType">
                        <img className="SbpType" src={sbp} alt="СБП" />
                    </div>
                    <div className="PayType">
                        <span className="SplitType">Сплит</span>
                    </div>
                </div>
                <div className="SplitDescription">
                    <div className="SplitDescText">
                        <h4>Подробнее о "сплите"</h4>
                        <p>
                            Сплит - это возможность оплатить вашу покупку двумя платежами.
                            Первая половина - сразу / вторая половина - после фото отчёта,
                            при этом Вы ничего не переплачиваете - смысл сплита не в том,
                            чтобы взять с Вас больше денег, он нужен для того, чтобы новые
                            пользователи могли дополнительно убедиться в честности и скорости
                            работы нашего сервиса. Получив фото отчёт своего заказа со склада в Китае,
                            Вы можете спокойно продолжить покупку после оплаты второй части заказа.
                        </p>
                        <h4>Как воспользоваться сплитом?</h4>
                        <p className="MB0">Активировать оплату "сплитом" вы сможете на странице оформления заказа при выборе способа оплаты.</p>
                        <p>У вас будет 2 варианта на выбор - оплатить полностью и сплит-платёж.</p>
                    </div>
                    <div className="SplitDescImg">
                        <img src={mock} alt="Оплата" />
                    </div>
                </div>
            </div>
            <div className="PaymentInfo">
                <h2>Доставка</h2>
                <div className="ShipSteps">
                    <div className="StepsLine" />
                    <div className="StepsBox">
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">ПРОДАВЕЦ</span>
                        </div>
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">LEGIT CHECK</span>
                        </div>
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">НАШ СКЛАД</span>
                        </div>
                        <div className="ShipStep MobNone">
                            <img src={point} alt="Доставка" />
                            <span className="StepText">ФОТООТЧЕТ</span>
                        </div>
                        <div className="ShipStep MobNone">
                            <img src={point} alt="Доставка" />
                            <span className="StepText">ПОСЫЛКА В ПУТИ</span>
                        </div>
                        <div className="ShipStep MobNone">
                            <img src={point} alt="Доставка" />
                            <span className="StepText">ПОСЫЛКА В СДЭКЕ</span>
                        </div>
                    </div>
                    <div className="StepsBox2">
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">ПОСЫЛКА В СДЭКЕ</span>
                        </div>
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">ПОСЫЛКА В ПУТИ</span>
                        </div>
                        <div className="ShipStep">
                            <img className="PointPC" src={point} alt="Доставка" />
                            <img className="PointMob" src={point2} alt="Доставка" />
                            <span className="StepText">ФОТООТЧЕТ</span>
                        </div>
                    </div>
                </div>
                <p>
                    Весь путь, который проходит Ваш заказ, занимает 2-3 недели - от продавца в Китае к вашему пункту СДЭКа.
                    После того, как ваш заказ будет успешно выкуплен, он тщательно <span className="PaymentLink" id="/guarantee" onClick={handleNavigate}>проверяется площадкой Poizon</span>,
                    после чего едет на наш склад в Китае. Занимает это от 1 до 6 дней. На этом этапе вы получаете фото отчёт,
                    и посылка выезжает в Россию.
                </p>
                <p><b>Важно: при получении заказа в СДЭКе вам не нужно будет оплачивать доставку, она входит в сумму заказа полностью - из Китая в указанный Вами СДЭК.</b></p>
            </div>
        </div>
    )
}