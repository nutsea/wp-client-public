import './base.scss'
import './App.scss'
import { Header } from './components/header/Header';
import { AppRoutes } from './AppRoutes';
import { Footer } from './components/footer/Footer';
import { useContext, useEffect, useState } from 'react';
import { fetchCourse, fetchExpressShip, fetchFee, fetchStandartShip } from './http/constantsAPI';
import { Context } from '.';
import { observer } from 'mobx-react-lite';

// eslint-disable-next-line
import loadLogo from './assets/loadLogo.png'

export const App = observer(() => {
    const [authcode, setAuthCode] = useState()
    const { constants } = useContext(Context)

    const getCourse = async () => {
        await fetchCourse().then(data => {
            constants.setCourse(data.value)
        })
        await fetchStandartShip().then(data => {
            constants.setStandartShip(data.value)
        })
        await fetchExpressShip().then(data => {
            constants.setExpressShip(data.value)
        })
        await fetchFee().then(data => {
            constants.setFee(data.value)
        })
    }

    useEffect(() => {
        getCourse()
        // eslint-disable-next-line
    }, [])

    return (
        <div className='App'>
            {constants.course && constants.standartShip && constants.expressShip && constants.fee ?
                <>
                    <Header authcode={authcode} />
                    <AppRoutes getAuthCode={setAuthCode} />
                    <Footer />
                </>
                :
                <div className='LoaderBox3'>
                    {/* <img className='LoadLogo' src={loadLogo} alt="" /> */}
                    <div className='Loader'></div>
                </div>
            }
        </div>
    );
})