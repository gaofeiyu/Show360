<h1>BigEye-Show360</h1>
<p>����360���϶�չʾ <a href="http://view.gaofeiyu.com/BigEye/demo/show360.html">[��ʾ]</a></p>
<h2>����˵��</h2>
<ol>
    <li>������ק��ת</li>
    <li>�ɷŴ���С</li>
    <li>�Զ�����</li>
    <li>���޽Ƕ���ת [������]</li>
</ol>
<h2>����ʾ��</h2>
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

<h2>����˵��</h2>
<pre><code>
    element: '',                // Ŀ��Ԫ��
    width: '',                  // Ԫ�ؿ�ȣ�������Ϊ����Ӧ **��û��
    height: '',                 // Ԫ�ظ߶ȣ�������Ϊ����Ӧ **��û��
    rotateRange: '2',           // ��ת���ŽǶ�
    imgPath: 'pic/',            // ͼƬ���·��
    imgPrefix: 'threesixty_',   // ͼƬ����ǰ׺
    imgType: 'jpg',             // ͼƬ����

    startIndex: '1',            // �ӵڼ���ͼ��ʼ
    maxScale: '3',              // ���Ŵ��ʣ�1��ʾ����Ҫ�Ŵ���
    autoPlay: false,            // �Ƿ�����Զ�����
    autoPlaySpeed: 20,          // �Զ������ٶ�
    loading: true,             // �Ƿ���ҪԤ����
</code></pre>
<h2>����˵��</h2>
<pre><code>
    loadProcess: null,          // �����лص�
    loadComplete: null          // �������
</code></pre>
<h2>�㷨˼·</h2>
<p>�п���д</p>