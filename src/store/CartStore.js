import { makeAutoObservable } from 'mobx'

export default class CartStore {
    constructor() {
        this._cart = []
        makeAutoObservable(this)
    }

    async setCart(cart) {
        this._cart = cart
    }

    get cart() {
        return this._cart
    }
}