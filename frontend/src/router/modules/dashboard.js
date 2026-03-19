import { RouterView } from 'vue-router'
import AdminDashboard from '@/views/pages/dashboard/admin-dashboard.vue'

export default [
    {
        path: '/dashboard',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'admin-dashboard'
            },
            {
                path: 'admin-dashboard',
                name: 'admin-dashboard',
                component: AdminDashboard
            }
        ]
    }
]
