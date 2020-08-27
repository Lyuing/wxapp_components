
Component({

  properties: {
    show:{
      type: Boolean,
      value: false,
      observer: 'showValueChange'
    },
    qrcode:{
      type: String,
      value: "../../image/qrcode2x.png"
    },
    date: {
      type: String,
      value: ""
    },
    url:{
      type: String,
      value: ""
    },
    content:{
      type: String,
      value: ""
    },
  },

  data: {
    imgUrl: '',
  },

  methods: {
    showValueChange(e){
      if(e){
        console.log("展示")
        this.draw()
      }else{
        this.setData({ imgUrl: ''})
      }
    },
    
    async draw(){
      let canvas, ctx;
      // let dpr = wx.getSystemInfoSync().pixelRatio,
      //   ratio = wx.getSystemInfoSync().screenWidth / 750;

      try{
        let canvasNode = await new Promise((resolve, reject)=>{
          const query = wx.createSelectorQuery().in(this)
          query.select('#myCanvas')
            .fields({ node: true, size: true })
            .exec(res=>{
              resolve(res[0])
            })
        }).catch(err=>{
          console.warn(err)
        })
        canvas = canvasNode.node
        ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.ctx = ctx
        // let {width, height} = canvasNode
        canvas.width = 670
        canvas.height = 1012
        // 670 - 1012
        // ctx.scale(670 / width, 1012 / height)
      }catch(err){
        console.warn(err)
        return wx.showToast({
          title: 'canvas 构建失败，请稍后重试',
          icon: 'none'
        })
      }

      // 背景图
      await this.drawPaper(canvas, ctx)
      ctx.save()
      // 背景线条
      this.arrayLine(ctx)
      // 头部日期
      this.writeDate(ctx)
      // 底部文案
      this.writeDescribe(ctx)
      // 小程序码
      await this.qrcode(canvas, ctx)
      // 便签背景
      await this.drawMemo(canvas, ctx)
      // 主题图
      await this.loadPhoto(canvas, ctx)
      // 文本内容
      this.writeContent(ctx)
      // 邮戳
      await this.drawScope(canvas, ctx)
      await this.drawTape(canvas, ctx)
      // canvas 转图片
      this.transPicture(canvas)
    },
    awaitImage(canvas, url){
      return new Promise((resolve, reject)=>{
        let img = canvas.createImage()
        img.src = url
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (e) => {
          console.warn('image error：', url)
          reject(e)
        }
      })
    },

    async drawPaper(canvas, ctx){
      try {
        let img = await this.awaitImage(canvas, "../../image/bg_paper.png")
        ctx.drawImage(img, 0, 0, 670, 1020)
      } catch (error) {
        console.log(error)
      }
      console.log('paper:',new Date())
    },
    arrayLine(ctx){
      let startY = 92,
        repeat = 13;
      const startX = 32,
        offsetY = 73,
        w = 606,
        h = 4;
      for(let i = 0; i<repeat; i++){
        this.roundRect(ctx, startX, startY + i*offsetY, w, h, 2, '#fae8c8')
        ctx.save()
      }
    },
    writeDate(ctx){
      let text = this.properties.date;
      ctx.font = `32px Microsoft YaHei`
      ctx.fillStyle = "#BF9356"
      ctx.textBaseline="top"
      ctx.fillText(text, 80, 40)
    },
    writeDescribe(ctx){
      ctx.font = `28px Microsoft YaHei`
      ctx.fillStyle = "#2F3634"
      ctx.textBaseline="top"
      ctx.fillText('精诚所至', 80, 874)
      ctx.fillText('爱心传递', 80, 916)
    },
    async qrcode(canvas, ctx){
      try {
        let img = await this.awaitImage(canvas, this.properties.qrcode)
        ctx.drawImage(img, 464, 846, 126, 126)
      } catch (error) {
        console.log(error)
      }
      console.log('qrcode:',new Date())
    },
    async drawMemo(canvas, ctx){
      try {
        let img = await this.awaitImage(canvas, "../../image/bg_memo_poster.png")
        ctx.drawImage(img, 50, 112, 570, 710)
      } catch (error) {
        console.log(error)
      }
      console.log('memo:',new Date())
    },
    async loadPhoto(canvas, ctx){
      let url = this.properties.url
      if(!url) return;

      let info = await new Promise((resolve, reject)=>{
        wx.getImageInfo({
          src: url,
          success: resolve,
          fail: reject
        })
      })
      let image = await new Promise((resolve, reject)=>{
        let img = canvas.createImage()
        img.src = info && info.path||url
        img.onload = () => {
          img ? resolve(img) : reject()
        }
        img.onerror = (e) => {
          console.warn('image error')
          reject(e)
        }
      }).catch(err=>{
        console.warn(err)
        wx.showToast({
          title: '图片加载失败,请稍后再试',
          icon: 'none'
        })
      })

      if(info && info.width){
        let { width: w, height: h} = info
        // console.log('info:', w, h)
        let offset_x = 0,       // 图片横向偏移量
          offset_y = 0,         // 图片纵向偏移量
          clit_w = 0,           // 图片裁剪宽度
          clit_h = 0,           // 图片裁剪高度
          w2h = parseInt(w * 392 / 522),      // 根据宽度计算的锁定高度
          h2w = parseInt(h * 522 / 392);      // 根据高度计算的锁定宽度
        if(w2h <= h){
          // 裁剪上下两端
          clit_w = w
          clit_h = w2h
          offset_y = parseInt((h-w2h) / 2)
        }else{
          // 裁剪左右两端
          clit_w = h2w
          clit_h = h
          offset_x = parseInt((w-h2w) / 2)
        }
        console.log('loadPhoto clip:',new Date())
        return await ctx.drawImage(image, offset_x, offset_y, clit_w, clit_h, 74, 128, 522, 392)
      }else{
        console.log('loadPhoto origin:',new Date())
        return await ctx.drawImage(image, 74, 128, 522, 392)
      }
    },
    async drawScope(canvas, ctx){
      try {
        let img = await this.awaitImage(canvas, "../../image/img_postScope.png")
        ctx.drawImage(img, 455, 18, 197, 179)
      } catch (error) {
        console.log(error)
      }
      console.log('scope:',new Date())
    },
    async drawTape(canvas, ctx){
      try {
        let img = await this.awaitImage(canvas, "../../image/img_tape.png")
        ctx.drawImage(img, 28, 82, 156, 156)
      } catch (error) {
        console.log(error)
      }
      console.log('tape:',new Date())
    },
    writeContent(ctx){
      let startX = 82,
        startY = 544,
        offset = 50;
      let content = this.properties.content.replace(/^\s+|\s+$/gm,'');
      let arr = content.split('\n'),
        res = []
      arr.forEach(i => {
        if(i.length <= 15){
          res.push(i)
        }else{
          while(i.length > 0){
            res.push(i.substr(0, 15))
            i = i.substr(15)
          }
        }
      });
      if(res.length>4 && res[5]){
        res = res.slice(0,4)
        res[3] = res[3].substr(0, 14) + '...'
      }
      ctx.font = `32px Microsoft YaHei`
      ctx.fillStyle = "#333"
      ctx.textBaseline="top"
      res.forEach((i, index)=>{
        ctx.fillText(i, startX, startY + index* offset)
      })
    },
    transPicture(canvas){
      console.log('trans:',new Date())
      return new Promise( (resolve, reject)=> {
        wx.canvasToTempFilePath({
          canvas: canvas,
          success:(res)=>{
            // console.log(res.tempFilePath)
            this.setData({
              imgUrl: res.tempFilePath
            })
            resolve(res.tempFilePath)
          },
          fail: reject
        })
      });
    },
    
    // 保存图片
    onSaveImage () {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.imgUrl,
        success: (res) =>{
          wx.showToast({
            title: '图片已保存',
            icon: "none"
          })
          this.triggerEvent('savePhoto')
        },
        fail(err) {
          wx.showModal({
            title: '提示',
            content: '当前未打开相册权限，请前去设置',
            confirmText: "设置",
            success(result) {
              if (result.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success(settingdata) {}
                })
              } else if (result.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    },

    roundRect(ctx, x, y, w, h, r, bgc='#FFF8EB') {
      // 开始绘制
      ctx.beginPath()
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      // ctx.setFillStyle('transparent')
      ctx.fillStyle = bgc
      // ctx.setStrokeStyle('transparent')

      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    
      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    
      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    
      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    
      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)
    
      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx.fill()
      // ctx.stroke()
      ctx.closePath()
      // 剪切
      ctx.clip()
      ctx.restore(); 
      // ctx.draw()
    }

  }
})
