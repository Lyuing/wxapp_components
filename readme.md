# popup #

调用方式: 
```
<popup show='{{isShow}}' z-index="99" bg='rgba(0,0,0,.5)' animation='grow'>
  <view>
    ...
  </view>

  <view slot='out'></view>
</popup>

/**
 * bg: 背景色
 * show: 控制显隐
 * animation：展示动画
 *      可用值： bottom ( 默认 )、top、 left、 right、 flash、 grow
 * 
 * slot = 'out' 节点不属于动画展示区域
 */
```

# poster: Canvas 2D 绘制海报 #
canvas 在屏幕外绘制，绘制完后转为图片，显示出来。
需随页面同时加载，若用 `wx:if` 会导致iOS上图片显示不完整。

包含 文字自动换行、绘制圆角、绘制图片裁剪
