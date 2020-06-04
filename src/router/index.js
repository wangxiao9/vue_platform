import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Host from '../components/host/Host.vue'
import Sort from '../components/project/Sort.vue'
import Project from '../components/project/Project.vue'
import Api from '../components/api/Api.vue'
import Setting from '../components/api/Setting.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: { index: 0 },
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      { path: '/user', component: User },
      { path: '/host', component: Host },
      { path: '/project/sort', component: Sort },
      { path: '/project/list', component: Project },
      { path: '/api/list', component: Api },
      { path: '/api/setting', component: Setting }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to: 将要访问的路径
   * from: 从哪个路径挑战
   * next: 放行
   */
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
