import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import './MainPopular.scss'

import arr from '../../assets/arr1.svg'
import { fetchPopularItems } from "../../http/itemAPI";
import { Item } from "../item/Item";
import { observer } from "mobx-react-lite";

export const MainPopular = observer(({ sub, maxElements, mobileElements, viewAll }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    // eslint-disable-next-line
    const [count, setCount] = useState(maxElements)
    const [items, setItems] = useState()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
    }

    const getItems = async () => {
        await fetchPopularItems().then((data) => {
            setItems(data.rows)
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
            if (width > 1240) setCount(maxElements)
            else if (width <= 1240 && width > 1025) setCount(maxElements * 0.8)
            else if (width <= 1025 && width > 720) setCount(maxElements * 0.6)
            else if (width <= 720) setCount(mobileElements)
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [maxElements, mobileElements])

    return (
        <div className="MainPopularContainer">
            <div className="MPTop">
                <div className="MPSub">{sub}</div>
                {viewAll &&
                    <div className="MPAll" id="/catalogue" onClick={handleNavigate}>
                        <span id="/catalogue/?popular=true">Смотреть все</span>
                        <img id="/catalogue/?popular=true" src={arr} alt="arr" />
                    </div>
                }
            </div>
            <div className="MPItems">
                {!loading && items && items.length && items.map((item, i) => {
                    if (i < count) return <Item key={item.id} item={item} />
                    else return null
                })}
            </div>
        </div>
    )
})