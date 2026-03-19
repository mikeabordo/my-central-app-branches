/**
 * Authentication Routes
 * Login, register, forgot/reset password, verification, lock screen
 */
import Login from '@/views/pages/authentication/sign-in.vue'

export default [
    {
        path: '/',
        redirect: '/sign-in'
    },
    {
        path: '/sign-in',
        name: 'sign-in',
        component: Login
    },
]