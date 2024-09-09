import React, { useContext, useEffect, useState } from "react";
import "./PriceFilter.scss";
import Slider from 'react-slider'
import { observer } from "mobx-react-lite";
import { Context } from "../../..";
import FormatPrice from "../../../utils/FormatPrice";

export const PriceFilter = observer(({ min, max, onSelectPrice, subtitle, preset }) => {
    const { constants } = useContext(Context)
    const [value, setValue] = useState([min, max])

    const selectComplete = () => {
        onSelectPrice(value)
    }

    const createTracks = () => {
        const isLeftTrack = document.querySelector('.LeftTrack')
        const isRightTrack = document.querySelector('.RightTrack')
        let leftTrack = document.createElement('div')
        let rightTrack = document.createElement('div')
        leftTrack?.classList.add('LeftTrack')
        rightTrack?.classList.add('RightTrack')
        const slider = document.querySelector('.PriceSlider')
        if (!isLeftTrack) {
            slider?.appendChild(leftTrack)
        }
        if (!isRightTrack) {
            slider?.appendChild(rightTrack)
        }
    }

    useEffect(() => {
        createTracks()
    }, [min, max])

    useEffect(() => {
        createTracks()
        const leftTrack = document.querySelector('.LeftTrack')
        const rightTrack = document.querySelector('.RightTrack')
        leftTrack?.setAttribute('style', `width: calc(100% * (${value[0] - min} / ${max - min}))`)
        rightTrack?.setAttribute('style', `width: calc(100% * (${max - value[1]} / ${max - min}))`)
        // eslint-disable-next-line
    }, [value, max, min])

    useEffect(() => {
        setValue([min, max])
    }, [min, max])

    useEffect(() => {
        if (preset)
            setValue(preset)
    }, [preset])

    if (!min || !max) return null
    if (!value[0] || !value[1]) return null
    return (
        <div className="PriceFilter">
            {subtitle &&
                <div className="PFSub">Цена</div>
            }
            <div className="PFArea">
                <div className="PFAItem">
                    <span>От</span>
                    <b>{FormatPrice.formatPrice(FormatPrice.slowShipPrice(value[0], constants.course, constants.standartShip, constants.fee))} ₽</b>
                </div>
                <div className="PFAItem">
                    <span>До</span>
                    <b>{FormatPrice.formatPrice(FormatPrice.slowShipPrice(value[1], constants.course, constants.standartShip, constants.fee))} ₽</b>
                </div>
            </div>
            <Slider
                className='PriceSlider'
                value={value}
                min={min}
                max={max}
                onChange={setValue}
                onAfterChange={selectComplete}
            />
        </div>
    )
})