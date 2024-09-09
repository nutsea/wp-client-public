import React, { useState } from "react";
import './SizeGridMobile.scss'
import { SizeGridFilter } from "../../filters/sizeGridFilter/SizeGridFilter";

import arr from '../../../assets/arr8.svg'

export const SizeGridMobile = ({ onClose, onSelectGrid, preset, onDrop, category, brands }) => {
    const [grid, setGrid] = useState('EU')

    const handleFilterClose = () => {
        onClose()
    }

    const handleDropFilter = () => {
        setGrid('EU')
        onClose()
        onDrop()
    }

    const handleSelectFilter = (value) => {
        setGrid(value)
    }

    const handleSubmitFilter = () => {
        onSelectGrid(grid)
        onClose()
    }

    return (
        <div className="FilterContainer">
            <div className="FilterHeight">
                <div className="FilterTop">
                    <div className="FilterClose" onClick={handleFilterClose}>
                        <img src={arr} alt="Стрелка" />
                    </div>
                    <span>Размерная сетка</span>
                    <span></span>
                </div>
                <SizeGridFilter onSelectGrid={handleSelectFilter} preset={preset} category={category} brands={brands} />
            </div>
            <div className="SortSave">
                <div className="SortDrop" onClick={handleDropFilter}>Сбросить</div>
                <div className="SortAdd" onClick={handleSubmitFilter}>Применить</div>
            </div>
        </div>
    )
}