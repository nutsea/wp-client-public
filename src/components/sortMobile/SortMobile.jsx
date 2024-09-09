import React, { useState } from "react";
import './SortMobile.scss'

import close from '../../assets/close.svg'
import checkImg from './imgs/check.svg'

export const SortMobile = ({ sortOptions, onSelectSort, selectedSort }) => {
    const [sort, setSort] = useState(sortOptions[0])

    const handleSelectSort = () => {
        const nowSort = sort
        onSelectSort(sort)
        handleSortClose()
        setSort(nowSort)
    }

    const handleDropSort = () => {
        handleSortClose()
        setSort(sortOptions[0])
        onSelectSort(sortOptions[0])
    }

    const handleSortClose = () => {
        setSort(selectedSort)
        document.querySelector('.App')?.classList.remove('Lock')
        const menu = document.querySelector('.SortContainer')
        menu?.classList.add('SortHide')
        const menuBox = document.querySelector('.SortBox')
        menuBox?.classList.add('SortBoxHide')
        setTimeout(() => {
            menuBox?.classList.add('None')
        }, 200);
    }

    const clickSortAway = (e) => {
        if (!e.target.closest('.SortContainer') && !e.target.closest('.CSMSort')) {
            setSort(selectedSort)
            handleSortClose()
        }
    }

    return (
        <div className="SortBox SortBoxHide None" onClick={clickSortAway}>
            <div className="SortContainer SortHide">
                <div className="SortHeight">
                    <div className="SortTop">
                        <div className="SortClose" onClick={handleSortClose}>
                            <img src={close} alt="Закрыть" />
                        </div>
                        <span>Сортировка</span>
                        <span></span>
                    </div>
                    <div className="SortListMob">
                        {sortOptions.map((item, i) => {
                            return (
                                <div key={i} className="SortListItemMob" onClick={() => setSort(item)}>
                                    <span className={`SortCheck ${sort.name === item.name ? 'CheckedSort' : ''}`}>
                                        <img src={checkImg} alt="Выбрать" />
                                    </span>
                                    <span>{item.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="SortSave">
                    <div className="SortDrop" onClick={handleDropSort}>Сбросить</div>
                    <div className="SortAdd" onClick={handleSelectSort}>Применить</div>
                </div>
                {/* <div className="DownElement"></div> */}
            </div>
        </div>
    )
}