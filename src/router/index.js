import {createRouter, createWebHistory} from 'vue-router'
import Menu from '../views/Menu'
import About from '../views/About'
import Order from '../views/Order'
import Login from '../views/Login'
import Register from '../views/Register'
import Application from '../views/Application'

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/menu',
        name: 'menu',
        component: Menu
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/order',
        name: 'Order',
        component: Order
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/application',
        name: 'Application',
        component: Application,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(
        process.env.BASE_URL
    ), 
    routes
})

export default router