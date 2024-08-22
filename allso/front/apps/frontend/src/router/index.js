import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const ifAuthenticated = (to, from, next) => {

    if (typeof router.app.$store != 'undefined') {
        if (router.app.$store.getters['auth/auth']) {
            next();
            return;
        }
    }

    router.push({
        name: 'Login',
        params: {
            returnTo: to.path,
            query: to.query,
        },
    });
};

const routes = [{
        path: '/',
        name: 'Main',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Main.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Login.vue')
    },
    {
        path: '/cluster1',
        name: 'Cluster1',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Cluster1.vue')
    },
    {
        path: '/cluster2',
        name: 'Cluster2',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Cluster2.vue')
    },
    {
        path: '/admin-console',
        name: 'AdminConsole',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/AdminConsole.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/pbs-monitoring',
        name: 'PBSMonitoring',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/PBSMonitoring.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/process',
        name: 'Process',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Process.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/process-sub',
        name: 'ProcessSub',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/ProcessSub.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/remote-control',
        name: 'RemoteControl',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/RemoteControl.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '/alarm',
        name: 'Alarm',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Alarm.vue'),
        // beforeEnter: ifAuthenticated,
    },
    {
        path: '*',
        name: 'Main',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Main.vue'),
        // beforeEnter: ifAuthenticated,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router