import React, { useEffect, useState } from "react";
import "./SizeGridFilter.scss";

import checkImg from '../imgs/check.svg'

export const SizeGridFilter = ({ onSelectGrid, subtitle, preset, category, brands }) => {
    const [grid, setGrid] = useState('EU')
    const [showFR, setShowFR] = useState(false)

    const handleGrid = (type) => {
        onSelectGrid(type)
        setGrid(type)
    }

    useEffect(() => {
        if (preset)
            setGrid(preset)
    }, [preset])

    useEffect(() => {
        if (brands && brands.length > 0) {
            if (brands.includes('Adidas') || brands.includes('Adidas Originals')) {
                setShowFR(true)
                if (grid !== 'FR') handleGrid('FR')
            } else {
                setShowFR(false)
                if (grid !== 'EU') handleGrid('EU')
            }
        } else {
            setShowFR(false)
            if (grid !== 'EU') handleGrid('EU')
        }
        // eslint-disable-next-line
    }, [brands])

    if (category === 'cosmetics' || category === 'perfumery' || category === 'clothes') return null
    if (false) return (
        <div className="SizeGridFilter">
            {subtitle &&
                <div className="SGFSub">Размерная сетка</div>
            }
            <div className="SGFGrid">
                <div className="SGFGridItem" onClick={() => handleGrid('EU')}>
                    <span className={`GridCheck ${grid === 'EU' ? 'CheckedGrid' : ''}`}>
                        <img src={checkImg} alt="" />
                    </span>
                    <span>EU</span>
                </div>
                {/* <div className="SGFGridItem" onClick={() => handleGrid('US')}>
                    <span className={`GridCheck ${grid === 'US' ? 'CheckedGrid' : ''}`}>
                        <img src={checkImg} alt="" />
                    </span>
                    <span>US</span>
                </div>
                <div className="SGFGridItem" onClick={() => handleGrid('UK')}>
                    <span className={`GridCheck ${grid === 'UK' ? 'CheckedGrid' : ''}`}>
                        <img src={checkImg} alt="" />
                    </span>
                    <span>UK</span>
                </div> */}
                {showFR &&
                    <div className="SGFGridItem" onClick={() => handleGrid('FR')}>
                        <span className={`GridCheck ${grid === 'FR' ? 'CheckedGrid' : ''}`}>
                            <img src={checkImg} alt="" />
                        </span>
                        <span>FR</span>
                    </div>
                }
            </div>
        </div>
    )
    return null
}