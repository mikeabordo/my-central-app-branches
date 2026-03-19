import { RouterView } from 'vue-router'

export default [
    {
        path: '/inventory',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'book-list'
            },
            {
                path: 'book-list',
                name: 'book-list',
                component: () => import('@/views/pages/inventory/book-list.vue')
            },
            {
                path: 'stock-request',
                name: 'stock-request',
                component: () => import('@/views/pages/inventory/stock-request.vue')
            },
            {
                path: 'pull-out-request',
                name: 'pull-out-request',
                component: () => import('@/views/pages/inventory/pull-out-request.vue')
            }
        ]
    }
]
