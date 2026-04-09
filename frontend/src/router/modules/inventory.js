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
                path: 'stock-request/add',
                name: 'add-stock-request',
                component: () => import('@/components/form-path/add-stock-request.vue')
            },
            {
                path: 'stock-request/view/:RSNo',
                name: 'view-stock-request',
                component: () => import('@/components/form-path/view-stock-request.vue')
            },
            {
                path: 'stock-request/edit/:RSNo',
                name: 'edit-stock-request',
                component: () => import('@/components/form-path/edit-stock-request.vue')
            },
            {
                path: 'incoming-stocks',
                name: 'incoming-stocks',
                component: () => import('@/views/pages/inventory/incoming-stocks.vue')
            },
            {
                path: 'pull-out-request',
                name: 'pull-out-request',
                component: () => import('@/views/pages/inventory/pull-out-request.vue')
            }
        ]
    }
]
