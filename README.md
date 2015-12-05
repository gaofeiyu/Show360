<h1>BigEye-Show360</h1>
<p>物体360°拖动展示 <a href="http://view.gaofeiyu.com/BigEye/demo/show360.html">[演示]</a></p>
<h2>功能说明</h2>
<ol>
    <li>对象拖拽旋转</li>
    <li>可放大缩小</li>
    <li>自动播放</li>
    <li>有限角度旋转 [开发中]</li>
</ol>
<h2>代码示例</h2>
<p>html:</p>

        <div id="loading"></div>
        <div id="show360"></div>

<p>JS:</p>
<pre>
    <code>
var bigEye = new BigEye();
var show360 = bigEye.show360({
    element : '#show360',
    imgPath : 'images/show360/',
    loadProcess : function(num){
        document.getElementById('loading').innerText = num+'%';
    },
    loadComplete: function(){
        document.body.removeChild(document.getElementById('loading'));
    }
});
    </code>
</pre>

<h2>属性说明</h2>
<pre><code>
    element: '',                // 目标元素
    width: '',                  // 元素宽度，不设置为自适应 **还没做
    height: '',                 // 元素高度，不设置为自适应 **还没做
    rotateRange: '2',           // 旋转单张角度
    imgPath: 'pic/',            // 图片相对路径
    imgPrefix: 'threesixty_',   // 图片名称前缀
    imgType: 'jpg',             // 图片类型

    startIndex: '1',            // 从第几张图开始
    maxScale: '3',              // 最大放大倍率，1表示不需要放大功能
    autoPlay: false,            // 是否可以自动播放
    autoPlaySpeed: 20,          // 自动播放速度
    loading: true,             // 是否需要预加载
</code></pre>
<h2>方法说明</h2>
<pre><code>
    loadProcess: null,          // 加载中回调
    loadComplete: null          // 加载完成
</code></pre>
<h2>算法思路</h2>
<p>有空再写</p>