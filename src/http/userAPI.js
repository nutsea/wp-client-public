import { $authHost, $host } from '.'

export const checkUser = async () => {
    const { data } = await $authHost.get('api/user')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user.id))
    return data
}

export const updateUser = async (name, surname, phone) => {
    const { data } = await $authHost.put('api/user', { name, surname, phone })
    return data
}

export const setPassword = async (password) => {
    const { data } = await $authHost.put('api/user/password', { password })
    return data
}

export const changePassword = async (oldPass, newPass) => {
    const { data } = await $authHost.put('api/user/changePassword', { oldPass, newPass })
    return data
}

export const login = async (phone, password) => {
    const { data } = await $authHost.get('api/user/login', { params: { phone, password } })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user.id))
    return data
}

export const fetchUser = async (id) => {
    const { data } = await $host.get('api/user/one', { params: { id } })
    return data
}

export const fetchUsers = async (search) => {
    const { data } = await $host.get('api/user/all', { params: { search } })
    return data
}

export const updateRoles = async (idArr, role) => {
    const { data } = await $authHost.put('api/user/roles', { idArr, role })
    return data
}

export const syncUsers = async (sync_key) => {
    const { data } = await $authHost.put('api/user/sync', { sync_key })
    return data
}