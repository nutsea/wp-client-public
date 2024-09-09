import React, { useEffect, useState } from "react";
import './WatchedItems.scss'

import { fetchByIds } from "../../http/itemAPI";
import { Item } from "../item/Item";

export const WatchedItems = () => {
    const [loading, setLoading] = useState(true)
    // eslint-disable-next-line
    const [count, setCount] = useState(5)
    const [items, setItems] = useState()

    const getItems = async () => {
        const watched = localStorage.getItem('watchedItems')
        if (watched)
            await fetchByIds(localStorage.getItem('watchedItems').split(',')).then((data) => {
                setItems(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        getItems()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width > 1240) setCount(5)
            else if (width <= 1240 && width > 1025) setCount(5 * 0.8)
            else if (width <= 1025 && width > 720) setCount(5 * 0.6)
            else if (width <= 720) setCount(6)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    if (items) {
        return (
            <div className="MainPopularContainer">
                <div className="MPTop">
                    <div className="MPSub">Вы смотрели</div>
                </div>
                <div className="MPItems">
                    {!loading && items && items.length && items.map((item, i) => {
                        if (i < count) return <Item key={item.id} item={item} />
                        else return null
                    })}
                </div>
            </div>
        )
    } else {
        return null
    }
}