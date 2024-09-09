import React, { useState } from "react";
import './PriceMobile.scss'

import arr from '../../../assets/arr8.svg'
import { PriceFilter } from "../../filters/priceFilter/PriceFilter";

export const PriceMobile = ({ onClose, min, max, onSelectPrice, preset, onDrop }) => {
    const [value, setValue] = useState([min, max])

    const handleFilterClose = () => {
        onClose()
    }

    const handleDropFilter = () => {
        setValue([min, max])
        onClose()
        onDrop()
    }

    const handleSelectFilter = (value) => {
        setValue(value)
    }

    const handleSubmitFilter = () => {
        onSelectPrice(value)
        onClose()
    }

    return (
        <div className="FilterContainer">
            <div className="FilterHeight">
                <div className="FilterTop">
                    <div className="FilterClose" onClick={handleFilterClose}>
                        <img src={arr} alt="Стрелка" />
                    </div>
                    <span>Цена</span>
                    <span></span>
                </div>
                <PriceFilter
                    min={min}
                    max={max}
                    onSelectPrice={handleSelectFilter}
                    preset={preset}
                />
            </div>
            <div className="SortSave">
                <div className="SortDrop" onClick={handleDropFilter}>Сбросить</div>
                <div className="SortAdd" onClick={handleSubmitFilter}>Применить</div>
            </div>
        </div>
    )
}