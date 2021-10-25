import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("views/home/Home");
const User = () => import("views/user/User");
const Login = () => import('views/login/Login')

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
            title: '首页'
        }
    },
    {
        path: "/user",
        name: "User",
        component: User,
        meta: {
            title: '我的'
        }
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

//动态更改标题
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title
    next()
})

export default router;
