(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{628:function(t,a,s){"use strict";s.r(a);var n=s(4),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"scatter-gather"}},[t._v("Scatter & Gather")]),t._v(" "),s("p",[t._v("Java NIO 开始支持 Scatter、Gather，Scatter、Gather 用于描述从 Channel 中读取或者写入到 Channel 的操作。")]),t._v(" "),s("p",[s("strong",[t._v("分散（Scatter）")]),t._v(" 从 Channel 中读取是指在读操作时将读取的数据写入多个 Buffer 中。因此，Channel 将从 Channel 中读取得数据“分散（Scatter）”到多个 Buffer 中。")]),t._v(" "),s("p",[s("strong",[t._v("聚集（Gather）")]),t._v(" 写入 Channel 是指在写操作时将多个 Buffer 的数据写入同一个 Channel，因此，Channel 将多个 Buffer 中的数据“聚集（Gather）”后发送到 Channel。")]),t._v(" "),s("p",[t._v("Scatter-Gather 经常用于需要将传输的数据分开处理的场合，例如传输一个由消息头和消息体组成的消息，你可能会将消息体和消息头分散到不同的 Buffer 中，这样你可以方便的处理消息头和消息体。")]),t._v(" "),s("h2",{attrs:{id:"scattering-reads"}},[t._v("Scattering Reads")]),t._v(" "),s("p",[t._v("Scattering Reads 是指数据从一个 Channel 读取到多个 Buffer 中。如下图：")]),t._v(" "),s("img",{attrs:{src:t.$withBase("/img/java/nio/Scatter.png"),alt:"Scatter"}}),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),t._v(" header "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("allocate")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("128")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),t._v(" body "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("allocate")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1024")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" bufferArray "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" header"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" body "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nchannel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("read")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("buffereArray"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("注意 Buffer 首先被插入到数组，然后再将数组作为 channel.read() 的输入参数。read() 方法按照 Buffer 在数组中的顺序将从 Channel 中读取的数据写入到 Buffer，当一个 Buffer 被写满后，channel 紧接着向另一个 buffer 中写入。")]),t._v(" "),s("p",[t._v("Scattering Reads 在移动下一个 Buffer 前，必须填满当前的 Buffer，这也意味着它不适用于动态消息（消息大小不固定）。换句话说，如果 BufferArray 中包含消息头和消息体，那么会优先将消息头 Buffer 填充满，再填充消息体 Buffer。")]),t._v(" "),s("h2",{attrs:{id:"gathering-writes"}},[t._v("Gathering Writes")]),t._v(" "),s("p",[t._v("Gathering Writes 是指数据从多个 Buffer 写入到同一个 Channel。如下图描述：")]),t._v(" "),s("img",{attrs:{src:t.$withBase("/img/java/nio/Gather.png"),alt:"Gather"}}),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),t._v(" header "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("allocate")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("128")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),t._v(" body "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("allocate")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1024")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" bufferArray "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" header"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" body "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nchannel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("write")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bufferArray"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("buffers 数组是 write() 方法的入参，write() 方法会按照 buffer 在数组中的顺序，将数据写入到 channel，注意只有 position 和 limit 之间的数据才会被写入。因此，如果一个 buffer 的容量会 128 byte，但是仅仅包含 58 byte 数据，那么着 58 byte 的数据将被写入到 channel 中。因此与 Scattering Reads 相反，Gathering Writes 能较好的处理动态消息。")])])}),[],!1,null,null,null);a.default=e.exports}}]);