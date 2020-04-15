import Vue from 'vue'
import { Button, Form, MessageBox} from 'element-ui'
import { FormItem } from 'element-ui'
import { Input, Transfer, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Transfer)


// 挂载弹框属性到全局变量中
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm