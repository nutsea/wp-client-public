import React, { useEffect, useState } from "react";
import './SizeMobile.scss'

import arr from '../../../assets/arr8.svg'
import { SizeFilter } from "../../filters/sizeFilter/SizeFilter";

export const SizeMobile = ({ onClose, onSelectSize, preset, onDrop, sizeGrid }) => {
    const [checkedSizes, setCheckedSizes] = useState([])

    const handleFilterClose = () => {
        onClose()
    }

    const handleDropFilter = () => {
        setCheckedSizes([])
        onClose()
        onDrop()
    }

    const handleSelectFilter = (value) => {
        if (checkedSizes.includes(value)) {
            setCheckedSizes(checkedSizes.filter(item => item !== value))
        } else {
            setCheckedSizes([...checkedSizes, value])
        }
    }

    const handleSubmitFilter = () => {
        onSelectSize(checkedSizes)
        onClose()
    }

    useEffect(() => {
        if (preset)
            setCheckedSizes(preset)
    }, [preset])

    return (
        <div className="FilterContainer">
            <div className="FilterHeight">
                <div className="FilterTop">
                    <div className="FilterClose" onClick={handleFilterClose}>
                        <img src={arr} alt="Стрелка" />
                    </div>
                    <span>Размер</span>
                    <span></span>
                </div>
                <SizeFilter
                    onSelectSize={handleSelectFilter}
                    preset={preset}
                    sizeGrid={sizeGrid}
                />
            </div>
            <div className="SortSave">
                <div className="SortDrop" onClick={handleDropFilter}>Сбросить</div>
                <div className="SortAdd" onClick={handleSubmitFilter}>Применить</div>
            </div>
        </div>
    )
}