import React, { useEffect } from "react";
import './Main.scss';
import { Stories } from "../../components/stories/Stories";
import { MainTiles } from "../../components/mainTiles/MainTiles";
import { Banners } from "../../components/banners/Banners";
import { MainPopular } from "../../components/mainPopular/MainPopular";
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

export const Main = ({ getAuthCode }) => {
    const location = useLocation()
    const { authcode } = queryString.parse(location.search)

    useEffect(() => {
        getAuthCode(authcode)
        // eslint-disable-next-line
    }, [authcode])

    return (
        <div className="MainContainer MBInfo">
            <Banners />
            <Stories />
            <MainPopular sub="Популярное" maxElements={10} mobileElements={8} viewAll />
            <MainTiles />
        </div>
    )
}