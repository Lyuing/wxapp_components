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