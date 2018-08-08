import Vue from 'vue'
import Router from 'vue-router'
import tools from '@/utils/tools'
import services from '@/services/services'
import videoList from '@/pages/videoList'
import remoteRecipesList from '@/pages/remoteRecipesList'
import onlineRecipesList from '@/pages/onlineRecipesList'
import videoDetail from '@/pages/videoDetail'
import remoteRecipesDetail from '@/pages/remoteRecipesDetail'
import onlineRecipesDetail from '@/pages/onlineRecipesDetail'
import doctorsList from '@/pages/doctorsList'
import doctorsDetail from '@/pages/doctorsDetail'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: '主页',
            redirect: '/videos'
        },
        {
            path: '/videos',
            redirect: '/videos/list'
        },
        {
            path: '/videos/list',
            name: '视频问诊列表',
            component: videoList
        },
        {
            path: '/videos/detail',
            name: '视频问诊详情',
            component: videoDetail
        },
        {
            path: '/remoteRecipes',
            redirect: '/remoteRecipes/list'
        },
        {
            path: '/remoteRecipes/list',
            name: '远程续方列表',
            component: remoteRecipesList
        },
        {
            path: '/remoteRecipes/detail',
            name: '远程续方详情',
            component: remoteRecipesDetail
        },
        {
            path: '/onlineRecipes',
            redirect: '/onlineRecipes/list'
        },
        {
            path: '/onlineRecipes/list',
            name: '在线处方列表',
            component: onlineRecipesList
        },
        {
            path: '/onlineRecipes/detail',
            name: '在线处方详情',
            component: onlineRecipesDetail
        },
        {
            path: '/doctors',
            redirect: '/doctors/list'
        },
        {
            path: '/doctors/list',
            name: '医生管理',
            component: doctorsList
        },
        {
            path: '/doctors/detail',
            name: '医生详情',
            component: doctorsDetail
        }
    ]
})

//路由拦截器
router.beforeEach((to, from, next) => {
  if(!tools.getSessionStorage('user_details_data')){
    services.fetchUser()
    .then(res => {
      let user = res.results.doctorDetail;
      tools.setSessionStorage('user_details_data', user);
      next();
    })
    .catch(err => {
      next();
    })
  } else {
    next();
  }
});

export default router;
