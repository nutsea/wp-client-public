import React, { useEffect, useState } from "react";
import "./SizeFilter.scss";
import { fetchSizes } from "../../../http/sizeAPI";

import checkImg from '../imgs/check.svg'

export const SizeFilter = ({ sizeGrid, category, onSelectSize, subtitle, preset }) => {
    const [sizes, setSizes] = useState()
    const [checkedSizes, setCheckedSizes] = useState([])

    const getSizes = async () => await fetchSizes(sizeGrid, category).then(data => setSizes(data))


    const sortSizes = (a, b) => {
        const sizeA = parseFloat(a.size)
        const sizeB = parseFloat(b.size)
        if (isNaN(sizeA) || isNaN(sizeB)) {
            return a.size.localeCompare(b.size)
        }
        return sizeA - sizeB
    }

    const clickSize = (size) => {
        onSelectSize(size)
        if (checkedSizes.includes(size)) {
            setCheckedSizes(checkedSizes.filter(item => item !== size))
        } else {
            setCheckedSizes([...checkedSizes, size])
        }
    }

    useEffect(() => {
        getSizes()
        setCheckedSizes([])
        // eslint-disable-next-line
    }, [sizeGrid, category])

    useEffect(() => {
        if (preset)
            setCheckedSizes(preset)
    }, [preset])

    const sortedSizes = sizes && sizes.sort(sortSizes)

    if (category === 'cosmetics' || category === 'perfumery') return null
    return (
        <div className="SizeFilter">
            {subtitle &&
                // <div className="SFSub">Размер {category === 'shoes' ? `(${sizeGrid})` : ''}</div>
                <div className="SFSub">Размер</div>
            }
            <div className="SFGrid">
                {sortedSizes && sortedSizes.map((size, i) => {
                    // if (sizeGrid === 'EU' && (size.brand === 'Adidas' || size.brand === 'Adidas Originals')) return null
                    return (
                        <div key={i} className="SFSizeItem" onClick={() => clickSize(size.size)}>
                            <span className={`SizeCheck ${checkedSizes.includes(size.size) ? 'CheckedSize' : ''}`}>
                                <img src={checkImg} alt="" />
                            </span>
                            <span>{size.size}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}