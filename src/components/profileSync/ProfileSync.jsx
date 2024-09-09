import React, { useState } from "react";
import './ProfileSync.scss'
import { syncUsers } from "../../http/userAPI";

export const ProfileSync = () => {
    const [syncKey, setSyncKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [error, setError] = useState(false)

    const handleSync = async () => {
        try {
            setLoading(true)
            await syncUsers(syncKey).then(() => {
                setChecked(true)
                setLoading(false)
            })
        } catch (e) {
            setChecked(true)
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div className="ProfileSettings">
            <div className="ProfileSettingsSub">Ключ синхронизации</div>
            <input className="ProfilePassInput" value={syncKey} onChange={(e) => setSyncKey(e.target.value)} placeholder="Введите ключ" />
            <div className={`ProfileSavePass ${syncKey.length > 0 ? 'Active' : ''}`} onClick={handleSync}>Привязать заказы</div>
            {checked && !error && !loading &&
                <div className="ProfileSyncSuccess">Заказы успешно привязаны</div>
            }
            {checked && error && !loading &&
                <div className="ProfileSyncError">Ключ не найден</div>
            }
            {loading &&
                <div className="OrderOrderer Active">
                    <span className="CheckStatic">Синхронизация</span>
                    <span className="CheckLoad"></span>
                </div>
            }
        </div>
    )
}