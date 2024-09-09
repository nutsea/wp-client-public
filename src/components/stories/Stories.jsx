import React, { useEffect, useState } from "react";
import './Stories.scss';
import { observer } from "mobx-react-lite";

import st1 from './icons/st1.png';
import st2 from './icons/st2.png';
import st3 from './icons/st3.png';
import st4 from './icons/st4.png';
import st5 from './icons/st5.png';
import st6 from './icons/st6.png';
import close from '../../assets/close3.svg';
import close2 from '../../assets/close4.svg';
import { fetchStories } from "../../http/storyAPI";

let timer

export const Stories = observer(() => {
    const [type, setType] = useState('')
    const [loading, setLoading] = useState(true)
    const [stories, setStories] = useState([])
    const [storyNum, setStoryNum] = useState(-1)
    const [factor, setFactor] = useState(19.575)
    const [factor2, setFactor2] = useState(1.975)
    const [scrollPos, setScrollPos] = useState(0)
    const [watched, setWatched] = useState([])

    const findStories = () => {
        setLoading(true)
        fetchStories(type).then(data => {
            setStories(data)
            setLoading(false)
        })
    }

    const handleStory = (type) => {
        setType(type)
        const date = new Date()
        localStorage.setItem(`${type}`, JSON.stringify(date))
        setWatched(watched => [...watched, type])
        document.querySelector('.StoriesModal')?.classList.remove('NoneStories')
        setScrollPos(window.scrollY)
        document.querySelector('.App')?.classList.add('Lock')
        setStoryNum(0)
    }

    const storyTimer = () => {
        timer = setTimeout(() => {
            if (storyNum === stories.length - 1) {
                setStoryNum(-1)
                document.querySelector('.StoryItems')?.removeAttribute('style')
                document.querySelector('.StoriesModal')?.classList.add('NoneStories')
                document.querySelector('.App')?.classList.remove('Lock')
                window.scrollTo(0, scrollPos)
            } else {
                setStoryNum(storyNum + 1)
                document.querySelector('.StoryItems')?.setAttribute('style', `transform: translate(-${(storyNum + 1) * factor + factor2}vw, 0)`)
            }
        }, 5000)
    }

    const resetTimer = () => {
        clearTimeout(timer)
        storyTimer()
    }

    const storyLeft = () => {
        if (storyNum === 0) return
        setStoryNum(storyNum - 1)
        document.querySelector('.StoryItems')?.setAttribute('style', `transform: translate(-${(storyNum - 1) * factor + factor2}vw, 0)`)
    }

    const storyRight = () => {
        if (storyNum === stories.length - 1) {
            setStoryNum(-1)
            document.querySelector('.StoryItems')?.removeAttribute('style')
            document.querySelector('.App')?.classList.remove('Lock')
            window.scrollTo(0, scrollPos)
            document.querySelector('.StoriesModal')?.classList.add('NoneStories')
            return
        }
        setStoryNum(storyNum + 1)
        document.querySelector('.StoryItems')?.setAttribute('style', `transform: translate(-${(storyNum + 1) * factor + factor2}vw, 0)`)
    }

    const storyClose = () => {
        setStoryNum(-1)
        document.querySelector('.StoryItems')?.removeAttribute('style')
        document.querySelector('.StoriesModal')?.classList.add('NoneStories')
        document.querySelector('.App')?.classList.remove('Lock')
        window.scrollTo(0, scrollPos)
    }

    const storyType = () => {
        switch (type) {
            case 'new':
                return 'Релизы'
            case 'select':
                return 'Подборки'
            case 'look':
                return 'Образы'
            case 'report':
                return 'Фотоотчеты'
            case 'review':
                return 'Отзывы'
            case 'gift':
                return 'Подарочная карта'
            default:
                return ''
        }
    }

    const storyImg = () => {
        switch (type) {
            case 'new':
                return st1
            case 'select':
                return st2
            case 'look':
                return st3
            case 'report':
                return st4
            case 'review':
                return st5
            case 'gift':
                return st6
            default:
                return ''
        }
    }

    useEffect(() => {
        if (storyNum !== -1) {
            resetTimer()
        }
        // eslint-disable-next-line
    }, [storyNum])

    useEffect(() => {
        if (type) {
            findStories()
        }
        // eslint-disable-next-line
    }, [type])

    useEffect(() => {
        const storyTypes = ['new', 'select', 'look', 'report', 'review', 'gift']
        storyTypes.forEach(type => {
            const date = localStorage.getItem(`${type}`)
            if (date) {
                const now = new Date()
                const diff = now - new Date(date)
                if (diff > 86400000) {
                    localStorage.removeItem(`${type}`)
                } else {
                    setWatched(watched => [...watched, type])
                }
            }
        })

        const handleResize = () => {
            const width = window.innerWidth
            if (width > 1200) {
                setFactor(19.575)
                setFactor2(1.975)
            }
            else if (width <= 1200 && width > 860) {
                setFactor(28.435)
                setFactor2(1.975)
            }
            else if (width <= 860 && width > 550) {
                setFactor(41.71)
                setFactor2(1.975)
            }
            else if (width <= 550) {
                setFactor(100)
                setFactor2(0)
            }
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="StoriesContainer">
            <div className="StoryFake" />
            <div className="StoryIcon" onClick={() => handleStory('new')}>
                <div className={`BorderIcon Icon1 ${watched.includes('new') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st1} alt="Story" onLoad={() => document.querySelector('.Icon1').removeAttribute('style')} />
                    {/* <img src={st1} alt="Story" /> */}
                </div>
                <span>релизы</span>
            </div>
            <div className="StoryIcon" onClick={() => handleStory('select')}>
                <div className={`BorderIcon Icon2 ${watched.includes('select') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st2} alt="Story" onLoad={() => document.querySelector('.Icon2').removeAttribute('style')} />
                </div>
                <span>подборки</span>
            </div>
            <div className="StoryIcon" onClick={() => handleStory('look')}>
                <div className={`BorderIcon Icon3 ${watched.includes('look') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st3} alt="Story" onLoad={() => document.querySelector('.Icon3').removeAttribute('style')} />
                </div>
                <span>образы</span>
            </div>
            <div className="StoryIcon" onClick={() => handleStory('report')}>
                <div className={`BorderIcon Icon4 ${watched.includes('report') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st4} alt="Story" onLoad={() => document.querySelector('.Icon4').removeAttribute('style')} />
                </div>
                <span>фотоотчеты</span>
            </div>
            <div className="StoryIcon" onClick={() => handleStory('review')}>
                <div className={`BorderIcon Icon5 ${watched.includes('review') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st5} alt="Story" onLoad={() => document.querySelector('.Icon5').removeAttribute('style')} />
                </div>
                <span>отзывы</span>
            </div>
            <div className="StoryIcon" onClick={() => handleStory('gift')}>
                <div className={`BorderIcon Icon6 ${watched.includes('gift') ? 'WatchedStory' : ''}`} style={{height: '10.73vw', maxHeight: 182.4}}>
                    <img src={st6} alt="Story" onLoad={() => document.querySelector('.Icon6').removeAttribute('style')} />
                </div>
                <span>подарочная карта</span>
            </div>
            <div className="StoryFake" />
            <div className="StoriesModal NoneStories">
                {!loading ?
                    <>
                        <div className="StoryLeft" onClick={storyLeft} />
                        <div className="StoryRight" onClick={storyRight} />
                        {factor2 !== 0 &&
                            <div className="StoryClose" onClick={storyClose}>
                                <img src={close} alt="Закрыть" />
                            </div>
                        }
                        <div className="StoryItems">
                            {stories && stories.map((story, i) => {
                                return (
                                    <div className={`Story ${i === 0 ? 'FirstStory' : ''} ${storyNum === i ? 'ActiveStory' : ''}`} key={i} style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL + story.img})` }}>
                                        {storyNum === i &&
                                            <div className="StoryLine" />
                                        }
                                        {(storyNum !== i && factor2 === 0) &&
                                            <div className="StoryLine2" />
                                        }
                                        <div className="StoryHead">
                                            <img src={storyImg()} alt="Story" />
                                            <span>{storyType()}</span>
                                            {(factor2 === 0 && storyNum === i) &&
                                                <div className="StoryClose" onClick={storyClose}>
                                                    <img src={close2} alt="Закрыть" />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                    :
                    <></>
                }
            </div>
        </div>
    )
})