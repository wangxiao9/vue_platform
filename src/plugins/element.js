import Vue from 'vue'
import {
  Button, Form, MessageBox, Card, FormItem,
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
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Select,
  Option,
  Alert,
  Tabs,
  TabPane,
  Drawer,
  Divider,
  PageHeader,
  Radio,
  RadioGroup

} from 'element-ui'

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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Drawer)
Vue.use(Divider)
Vue.use(PageHeader)
Vue.use(Radio)
Vue.use(RadioGroup)
// 挂载弹框属性到全局变量中
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
