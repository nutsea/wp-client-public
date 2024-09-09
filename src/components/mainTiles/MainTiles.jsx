import React from "react";
import './MainTiles.scss';

import arr2 from '../../assets/arr2.svg';
import arr3 from '../../assets/arr3.svg';
import arr5 from '../../assets/arr5.svg';
import sho from './imgs/sho1.png';
import clo from './imgs/clo1.png';
import acc from './imgs/acc1.png';
import cos from './imgs/cos1.png';
import per from './imgs/per1.png';
import sho2 from './imgs/sho2.png';
import clo2 from './imgs/clo2.png';
import acc2 from './imgs/acc2.png';
import cos2 from './imgs/cos2.png';
import per2 from './imgs/per2.png';
import shoItem from './imgs/shoItem.png';
import cloItem from './imgs/cloItem.png';
import accItem from './imgs/accItem.png';
import cosItem from './imgs/cosItem.png';
import perItem from './imgs/perItem.png';
import { useNavigate } from "react-router-dom";

export const MainTiles = () => {
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
        navigate(e.target.id)
    }

    return (
        <div className="MainTilesContainer">
            <div className="TilesTop">
                <div className="TilesTopLeft">
                    <div className="TileCatalogueBtn" id="/catalogue" onClick={handleNavigate}>
                        <span id="/catalogue">Перейти в каталог</span>
                        <img className="TileArrBig" id="/catalogue" src={arr2} alt="Каталог" />
                        <img className="TileArrSmall" id="/catalogue" src={arr5} alt="Каталог" />
                    </div>
                    <div className="TileShoes" id="/catalogue/?category=shoes" onClick={handleNavigate}>
                        <div className="TileSub" id="/catalogue/?category=shoes">
                            <span id="/catalogue/?category=shoes">Обувь</span>
                            <img src={arr3} id="/catalogue/?category=shoes" alt="Обувь" />
                        </div>
                        <img className="TileImg" id="/catalogue/?category=shoes" src={sho} alt="Обувь" />
                        <img className="TileImg2" id="/catalogue/?category=shoes" src={sho2} alt="Обувь" />
                        <img className="ShoTile" id="/catalogue/?category=shoes" src={shoItem} alt="Обувь" />
                    </div>
                </div>
                {/* <div className="TileClothes" id="/catalogue/?category=clothes" onClick={handleNavigate}> */}
                <div className="TileClothes" id="/oops" onClick={handleNavigate}>
                    <div className="TileSub" id="/oops">
                        <span id="/oops">Одежда</span>
                        <img src={arr3} id="/oops" alt="Одежда" />
                    </div>
                    <img className="TileImg" id="/oops" src={clo} alt="Одежда" />
                    <img className="TileImg2" id="/oops" src={clo2} alt="Одежда" />
                    <img className="CloTile" id="/oops" src={cloItem} alt="Одежда" />
                </div>
            </div>
            <div className="TilesBottom">
                {/* <div className="TileAccessories" id="/catalogue/?category=accessories" onClick={handleNavigate}> */}
                <div className="TileAccessories" id="/oops" onClick={handleNavigate}>
                    <div className="TileSub" id="/oops">
                        <span id="/oops">Аксессуары</span>
                        <img src={arr3} id="/oops" alt="Аксессуары" />
                    </div>
                    <img className="TileImg" id="/oops" src={acc} alt="Аксессуары" />
                    <img className="AccTile" id="/oops" src={accItem} alt="Аксессуары" />
                </div>
                {/* <div className="TileCosmetics" id="/catalogue/?category=cosmetics" onClick={handleNavigate}> */}
                <div className="TileCosmetics" id="/oops" onClick={handleNavigate}>
                    <div className="TileSub" id="/oops">
                        <span id="/oops">Косметика</span>
                        <img src={arr3} id="/oops" alt="Косметика" />
                    </div>
                    <img className="TileImg" id="/oops" src={cos} alt="Косметика" />
                    <img className="TileImg2" id="/oops" src={cos2} alt="Косметика" />
                    <img className="CosTile" id="/oops" src={cosItem} alt="Косметика" />
                </div>
                {/* <div className="TilePerfumery" id="/catalogue/?category=perfumery" onClick={handleNavigate}> */}
                <div className="TilePerfumery" id="/oops" onClick={handleNavigate}>
                    <div className="TileSub" id="/oops">
                        <span id="/oops">Парфюмерия</span>
                        <img src={arr3} id="/oops" alt="Парфюмерия" />
                    </div>
                    <img className="TileImg" id="/oops" src={per} alt="Парфюмерия" />
                    <img className="TileImg2" id="/oops" src={per2} alt="Парфюмерия" />
                    <img className="PerTile" id="/oops" src={perItem} alt="Парфюмерия" />
                </div>
            </div>
            {/* <div className="TileAccessories2" id="/catalogue/?category=accessories" onClick={handleNavigate}> */}
            <div className="TileAccessories2" id="/oops" onClick={handleNavigate}>
                <div className="TileSub" id="/oops">
                    <span id="/oops">Аксессуары</span>
                    <img src={arr3} id="/oops" alt="Аксессуары" />
                </div>
                <img className="TileImg2" id="/oops" src={acc2} alt="Аксессуары" />
                <img className="AccTile" id="/oops" src={accItem} alt="Аксессуары" />
            </div>
        </div>
    )
}