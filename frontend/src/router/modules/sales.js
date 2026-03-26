import { RouterView } from 'vue-router'

export default [
    {
        path: '/sales',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'pos'
            },
            {
                path: 'pos',
                name: 'pos',
                component: () => import('@/views/pages/sales/pos.vue')
            },
            {
                path: 'charge-sales',
                name: 'charge-sales',
                component: () => import('@/views/pages/sales/charge-sales.vue')
            },
            {
                path: 'sales-report',
                name: 'sales-report',
                component: () => import('@/views/pages/sales/sales-report.vue')
            },
            {
                path: 'item-report',
                name: 'item-report',
                component: () => import('@/views/pages/sales/item-report.vue')
            },
            {
                path: 'history',
                name: 'history',
                component: () => import('@/views/pages/other/history.vue')
            }
        ]
    }
]
