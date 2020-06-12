import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
/*******************************************
 * state:     存放全局数据
 * mutations: 变更state中的数据
 * actions:   处理异步操作
 ******************************************/
export default new Vuex.Store({
  state: {
    projectList: [],
    project_total: 0,
    typeList: [],
    type_total: 0
  },
  mutations: {
    initProjectList(state, res) {
      state.projectList = res.projects
      state.project_total = res._meta.total
    },
    initTypeList(state, res) {
      state.typeList = res.typeList
      state.type_total = res._meta.total
    }
  },
  actions: {
    /**
     * 获取项目列表
     * @param {*} context mutations
     * @param {*} query   参数
     */
    async getProjectList(context, query) {
      await axios.post('projects', query).then(res => {
        context.commit('initProjectList', res.data)
      }).catch(error => {
        console.log(error)
      })
    },

    async getTypeList(context, query) {
      await axios.$http.post('types', query).then(res => {
        console.log(res.data)
        context.commit('initTypeList', res.data)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  getters: {}

})
