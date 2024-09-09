// import React, { useState, useRef } from "react"
// import "./Slider.scss"

// export const Slider = ({ item }) => {
//     const rowRef = useRef(null)
//     const [dragStartX, setDragStartX] = useState(0)
//     const [scrollLeftStart, setScrollLeftStart] = useState(0)
//     const [isDragging, setIsDragging] = useState(false)

//     const handleMouseDown = (e) => {
//         setIsDragging(true)
//         setDragStartX(e.clientX)
//         setScrollLeftStart(rowRef.current.scrollLeft)
//     }

//     const handleMouseMove = (e) => {
//         if (!isDragging) return
//         e.preventDefault()
//         const dx = (e.clientX - dragStartX) * 1.5
//         updateScroll(dx)
//     }

//     const handleMouseUp = () => {
//         setIsDragging(false)
//         scrollToNearestImage()
//     }

//     const updateScroll = (dx) => {
//         if (rowRef.current) {
//             const imageWidth = rowRef.current.querySelector('img').offsetWidth
//             const maxDx = imageWidth

//             if (Math.abs(dx) > maxDx) {
//                 dx = maxDx * Math.sign(dx)
//             }

//             rowRef.current.scrollLeft = scrollLeftStart - dx
//         }
//     }

//     const handleTouchStart = (e) => {
//         setDragStartX(e.touches[0].clientX)
//         setScrollLeftStart(rowRef.current.scrollLeft)
//     }

//     const handleTouchMove = (e) => {
//         e.preventDefault()
//         const dx = (e.touches[0].clientX - dragStartX) * 2
//         rowRef.current.scrollLeft = scrollLeftStart - dx
//         updateScroll(dx)
//     }

//     const scrollToNearestImage = () => {
//         const images = Array.from(rowRef.current.querySelectorAll('img'))
//         const middleX = rowRef.current.scrollLeft + rowRef.current.offsetWidth / 2
//         let closestImage = null
//         let minDistance = Infinity

//         images.forEach(img => {
//             const imgLeft = img.offsetLeft
//             const imgRight = imgLeft + img.offsetWidth
//             const imgMiddleX = (imgLeft + imgRight) / 2
//             const distance = Math.abs(imgMiddleX - middleX)

//             if (distance < minDistance) {
//                 minDistance = distance
//                 closestImage = img
//             }
//         })

//         if (closestImage) {
//             rowRef.current.scrollTo({
//                 left: Math.max(
//                     0,
//                     Math.min(
//                         rowRef.current.scrollWidth - rowRef.current.clientWidth,
//                         closestImage.offsetLeft - (rowRef.current.offsetWidth / 2 - closestImage.width / 2)
//                     )
//                 ),
//                 behavior: 'smooth'
//             })
//         }
//     }

//     const scrollToImageByIndex = (index) => {
//         const images = Array.from(rowRef.current.querySelectorAll('img'))
//         const targetImage = images[index]

//         if (targetImage) {
//             rowRef.current.scrollTo({
//                 left: targetImage.offsetLeft - (rowRef.current.offsetWidth / 2 - targetImage.width / 2),
//                 behavior: 'smooth'
//             })
//         }
//     }

//     const handleSmallImgClick = (index) => {
//         scrollToImageByIndex(index)
//     }

//     const handleTouchEnd = () => {
//         scrollToNearestImage()
//     }

//     return (
//         <>
//             <div className="ItemImagesSmall">
//                 {item.img && item.img.map((img, i) => {
//                     return (
//                         <div className="SmallImg" key={i}>
//                             <img
//                                 className="SmallImgStyle"
//                                 src={img.img}
//                                 onClick={() => handleSmallImgClick(i)}
//                                 alt="Фото товара"
//                             />
//                         </div>
//                     )
//                 })}
//             </div>
//             <div className="BigImgSliderBox">
//                 <div
//                     className="BigImgSlider"
//                     ref={rowRef}
//                     onMouseDown={handleMouseDown}
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseUp}

//                     onTouchStart={handleTouchStart}
//                     onTouchMove={handleTouchMove}
//                     onTouchEnd={handleTouchEnd}
//                 >
//                     <div
//                         className="BigImagesRow"
//                     >
//                         {item.img && item.img.map((img, i) => {
//                             return (
//                                 <img
//                                     key={i}
//                                     className="BigImg"
//                                     src={img.img}
//                                     alt="Фото товара"
//                                 />
//                             )
//                         })}
//                     </div>
//                 </div>
//             </div>
//             <div className="ItemImagesSmall2">
//                 {item.img && item.img.map((img, i) => {
//                     return (
//                         <div className="SmallImg" key={i}>
//                             <img
//                                 className="SmallImgStyle"
//                                 src={img.img}
//                                 onClick={() => handleSmallImgClick(i)}
//                                 alt="Фото товара"
//                             />
//                         </div>
//                     )
//                 })}
//                 <div className="SmallImgPad" />
//             </div>
//         </>
//     )
// }


// new version


import React, { useEffect, useState } from "react"
import "./Slider.scss"
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Pagination } from "swiper/modules";

export const Slider = ({ item }) => {
    const [width, setWidth] = useState(window.innerWidth)

    const setImages = () => {
        const oldPagination = document.querySelectorAll('.swiper-pagination-bullet')
        for (let i = 0; i < oldPagination.length; i++) {
            oldPagination[i].classList.add('SmallImg')
            if (!oldPagination[i].hasChildNodes()) {
                oldPagination[i].innerHTML = `<img class="SmallImgStyle" src=${item.img[i].img} alt="Фото товара" />`
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setImages()
            const hasChildNodes = Array.from(document.querySelectorAll('.swiper-pagination-bullet')).every(pagination => pagination.hasChildNodes())
            if (hasChildNodes) {
                clearInterval(interval)
            }
        }, 10)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setImages()
        // eslint-disable-next-line
    }, [width])

    return (
        <>
            {width > 1100 &&
                <>
                    <div className="ItemImagesSmall"></div>
                    <div className="BigImgSliderBox">
                        <div className="BigImgSlider">
                            <Swiper
                                modules={[Pagination]}
                                className="mySwiper"
                                pagination={{
                                    el: '.ItemImagesSmall',
                                    clickable: true
                                }}
                            >
                                {item.img && item.img.map((img, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <img
                                                key={i}
                                                className="BigImg"
                                                src={img.img}
                                                alt="Фото товара"
                                            />
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </div>
                </>
            }
            {width <= 1100 &&
                <>
                    <div className="BigImgSliderBox">
                        <div className="BigImgSlider">
                            <Swiper
                                modules={[Pagination]}
                                className="mySwiper"
                                pagination={{
                                    el: '.ItemImagesSmall2',
                                    clickable: true
                                }}
                            >
                                {item.img && item.img.map((img, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <img
                                                key={i}
                                                className="BigImg"
                                                src={img.img}
                                                alt="Фото товара"
                                            />
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </div>
                    <div className="ItemImagesSmall2"></div>
                </>
            }
        </>
    )
}