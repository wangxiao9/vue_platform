import Vue from 'vue'
import { Button, Form, MessageBox } from 'element-ui'
import { FormItem } from 'element-ui'
import {
     Input,
     Transfer,
     Message,
     Container,
     Header,
     Aside,
     Main,
     Col,
     Menu,
     MenuItem,
     MenuItemGroup,
     Submenu

}
from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Transfer)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)



// 挂载弹框属性到全局变量中
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm