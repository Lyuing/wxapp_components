/**
 * bg: 背景色
 * show: 控制显隐
 * animation：展示动画
 *      可用值： bottom ( 默认 )、top、 left、 right、 flash、 grow
 * 
 */
Component({
  options: {
    multipleSlots: true 
  },
  properties: {
    bg:{
      type: String,
      value: 'rgba(0,0,0,0.7)'
    },
    show: {
      type: Boolean,
      value: false,
      observer: 'observeShow'
    },
    animation:{
      type: String,
      value: 'bottom',
    },
    zIndex: {
      type: Number,
      value: 990,
    },
  },
  data: {
    inited: false,      // 初始化、注销
    display: false,     // 插槽挂载节点 过渡动画
    waiting: false,     // 是否正在处理上一个弹框事件
    hang: false,        // 挂起
  },
  methods: {
    observeShow (value) {
      value ? this.reset() : this.leave()
    },
    show () {
      this.data.hang = false
      this.setData({ inited: true },()=>{
        setTimeout(()=>{ this.setData({ display: true }) },10)
      })
    },
    leave () {
      this.data.waiting = true
      this.setData({ display: false }, () => {
        setTimeout(_=>{
          this.setData({ inited: false })
          this.triggerEvent("close");
          this.data.waiting = false
          if(this.data.hang) this.show()
        },200)
      })
    },
    reset() {
      if (this.data.waiting){
        // 正在执行前一个 popup
        this.data.hang = true
      }else{
        // 空闲
        this.show()
      }
    },

    preventTouchMove(e){
      return;
    },
  }
})
