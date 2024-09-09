import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main } from "./pages/main/Main";
import { Payment } from "./pages/payment/Payment";
import { Guarantee } from "./pages/guarantee/Guarantee";
import { Help } from "./pages/help/Help";
import { Error } from "./pages/error/Error";
import { Profile } from "./pages/profile/Profile";
import { ItemCard } from "./pages/itemCard/ItemCard";
import { Catalogue } from "./pages/catalogue/Catalogue";
import { Cart } from "./pages/cart/Cart";
import { Order } from "./pages/order/Order";
import { Fav } from "./pages/fav/Fav";
import { Oops } from "./pages/oops/Oops";
import { Contacts } from "./pages/contacts/Contacts";
import { Thanks } from "./pages/thanks/Thanks";

export const AppRoutes = ({ getAuthCode }) => {
    return (
        <Routes>
            <Route path="/" element={<Main getAuthCode={getAuthCode} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/guarantee" element={<Guarantee />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/profile/:tab?" element={<Profile />} />
            <Route path="/item/:id" element={<ItemCard />} />
            <Route path="/catalogue/:category?/:popular?/:brand?/:brandset?" element={<Catalogue />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/fav" element={<Fav />} />
            <Route path="/order/:item_uid?/:size?/:ship?" element={<Order />} />
            <Route path="/oops" element={<Oops />} />
            <Route path="/thanks" element={<Thanks />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}