(window.webpackJsonp=window.webpackJsonp||[]).push([[77],{618:function(t,a,v){"use strict";v.r(a);var s=v(4),_=Object(s.a)({},(function(){var t=this,a=t.$createElement,v=t._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("p",[t._v("JVM 类加载机制分为五个部分：加载、验证、准备、解析、初始化，下面我们分别看一下这五个过程。")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/jvm/jvm类加载流程.png"),alt:"jvm类加载流程"}}),t._v(" "),v("h2",{attrs:{id:"加载"}},[t._v("加载")]),t._v(" "),v("p",[t._v("加载是类加载过程中的一个阶段，"),v("font",{attrs:{color:"#93D172"}},[t._v("这个阶段会在内存中生成一个代表这个类的 java.lang.Class 对象，作为这个类在方法区的各种数据入口")]),t._v("。注意这里不一定非得要从一个 Class 文件获取，这里既可以从 ZIP 包中读取（比如从 jar 包和 war 包中读取），也可以在运行时计算生成（动态代理），也可以由其它文件生成（比如将 JSP 文件转换成对应的 Class 类）。")],1),t._v(" "),v("h2",{attrs:{id:"验证"}},[t._v("验证")]),t._v(" "),v("p",[t._v("这一阶段的主要目的是为了"),v("font",{attrs:{color:"#93D172"}},[t._v("确保 Class 文件的字节流中包含的信息是否符合当前虚拟机的要求")]),t._v("，并且不会危害虚拟机自身的安全。")],1),t._v(" "),v("h2",{attrs:{id:"准备"}},[t._v("准备")]),t._v(" "),v("p",[t._v("准备阶段是正式为类变量分配内存并设置类变量的初始值阶段，即"),v("font",{attrs:{color:"#93D172"}},[t._v("在方法区中分配这些变量所需要的内存空间")]),t._v("。注意这里所说的初始化概念，比如一个变量定义为：")],1),t._v(" "),v("div",{staticClass:"language-java extra-class"},[v("pre",{pre:!0,attrs:{class:"language-java"}},[v("code",[v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" v "),v("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token number"}},[t._v("8080")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),v("p",[v("font",{attrs:{color:"#93D172"}},[t._v("实际上变量 v 在准备阶段过后的初始值为 0 ，而不是 8080")]),t._v("，将 v 赋值为 8080 的 "),v("code",[t._v("put static")]),t._v("指令是在程序被编译后执行的，"),v("font",{attrs:{color:"#1BB3EF"}},[t._v("存放在类构造<client>方法之中")]),t._v(" 。")],1),t._v(" "),v("p",[t._v("但是注意如果声明为：")]),t._v(" "),v("div",{staticClass:"language-java extra-class"},[v("pre",{pre:!0,attrs:{class:"language-java"}},[v("code",[v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" v "),v("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),v("span",{pre:!0,attrs:{class:"token number"}},[t._v("8080")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),v("p",[t._v("在编译阶段会为 v 生成 ConstantValue 属性，在"),v("font",{attrs:{color:"#1BB3EF"}},[t._v("准备阶段虚拟机会根据 ConstantValue 属性将 v 赋值为 8080")]),t._v("。")],1),t._v(" "),v("h2",{attrs:{id:"解析"}},[t._v("解析")]),t._v(" "),v("p",[t._v("解析阶段是指"),v("font",{attrs:{color:"#93D172"}},[t._v("虚拟机将常量池中的符号引用替换为直接引用的过程")]),t._v("。符号引用就是 class 文件中的：")],1),t._v(" "),v("ol",[v("li",[t._v("CONSTANT_Class_info")]),t._v(" "),v("li",[t._v("CONSTANT_Field_info")]),t._v(" "),v("li",[t._v("CONSTANT_Method_info")])]),t._v(" "),v("p",[t._v("等类型的常量。")]),t._v(" "),v("h2",{attrs:{id:"使用"}},[t._v("使用")]),t._v(" "),v("h3",{attrs:{id:"符号引用"}},[t._v("符号引用")]),t._v(" "),v("p",[t._v("符号引用与虚拟机实现的布局无关，"),v("font",{attrs:{color:"#93D172"}},[t._v("引用的目标并不一定要已经加载到内存中，各种虚拟机实现的内存布局可以各不相同")]),t._v("，但是它们能够接收的符号引用必须是一直的，因为符号引用以字面量形式明确定义在 Java 虚拟机规范的 Class 文件格式中。")],1),t._v(" "),v("h3",{attrs:{id:"直接引用"}},[t._v("直接引用")]),t._v(" "),v("p",[t._v("直接引用可以"),v("font",{attrs:{color:"#93D172"}},[t._v("是指向目标的指针，相对偏移量或是一个能间接定位到目标的句柄")]),t._v("。如果有了直接引用，"),v("font",{attrs:{color:"#93D172"}},[t._v("那么引用的目标必定已经存在内存中")]),t._v("。")],1),t._v(" "),v("h2",{attrs:{id:"初始化"}},[t._v("初始化")]),t._v(" "),v("p",[t._v("初始化阶段是类加载最后一个阶段，经过前面的类加载阶段之后，除了在加载阶段可以自定义类加载器以外，其它操作都由 JVM 主导。到了初始阶段。才开始真正执行类中定义的 Java 程序代码。")]),t._v(" "),v("h2",{attrs:{id:"类构造器-client"}},[t._v("类构造器 <client>")]),t._v(" "),v("p",[t._v("初始化阶段"),v("font",{attrs:{color:"#93D172"}},[t._v("是执行类构造<client>方法的过程")]),t._v("。<client> 方法是由编译器自动收集类中的类变量的赋值操作和静态语句块中的语句合并而成的。虚拟机会保证子<client>方法执行之前，父亲的<client>方法已经执行完毕，"),v("font",{attrs:{color:"#93D172"}},[t._v("如果一个类中没有对静态变量赋值也没有静态语句块，那么编译器可以不为这个类生成<client>方法")]),t._v("。")],1),t._v(" "),v("p",[t._v("注意一下几种情况不会执行类初始化：")]),t._v(" "),v("ol",[v("li",[t._v("通过子类引用父类的静态字段，只会触发父亲的初始化，而不会触发子类的初始化。")]),t._v(" "),v("li",[t._v("定义对象数组，不会触发该类的初始化。")]),t._v(" "),v("li",[t._v("常量在编译期间会存入调用类的常量池中，本质上并没有直接引用定义常量的类，不会触发定义常量所在的类。")]),t._v(" "),v("li",[t._v("通过类名获取 Class 对象，不会触发类的初始化。")]),t._v(" "),v("li",[t._v("通过 Class.forName 加载指定类时，如果指定参数 initialize 为 false 时，也不会触发类初始化，其实这个参数是告诉虚拟机，是否要对类进行初始化。")]),t._v(" "),v("li",[t._v("通过 Class.Loader 默认的 loadClass 方法，也不会触发初始化动作。")])]),t._v(" "),v("h2",{attrs:{id:"类加载器"}},[t._v("类加载器")]),t._v(" "),v("p",[t._v("虚拟机设计团队把加载动作放到 JVM 外部实现，以便让应用程序决定如何获取所需的类，JVM 提供了 3 中类加载器。")]),t._v(" "),v("h3",{attrs:{id:"启动类加载器-bootstrap-classloader"}},[t._v("启动类加载器（BootStrap ClassLoader）")]),t._v(" "),v("p",[t._v("负责加载 "),v("font",{attrs:{color:"#93D172"}},[t._v("JAVA_HOME\\lib")]),t._v(" 目录中的，或通过 -Xbootclasspath 参数指定路径中的，且被虚拟机认可（按文件识别，如 rt.jar）的类。")],1),t._v(" "),v("h3",{attrs:{id:"扩展类加载器-extension-classloader"}},[t._v("扩展类加载器（Extension ClassLoader）")]),t._v(" "),v("p",[t._v("负责加载 "),v("font",{attrs:{color:"#93D172"}},[t._v("JAVA_HOME\\lib\\ext")]),t._v(" 目录中的，或通过 java.ext.dirs 系统变量指定路径中的类库。")],1),t._v(" "),v("h3",{attrs:{id:"应用程序类加载器-application-classloader"}},[t._v("应用程序类加载器（Application ClassLoader）")]),t._v(" "),v("p",[t._v("负责加载"),v("font",{attrs:{color:"#93D172"}},[t._v("用户路径（classpath）上的类库")]),t._v("。JVM 通过双亲委派模型进行类的加载，当然我们也可以通过继承 java.lang.ClassLoader 实现自定义的类加载器。")],1),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/jvm/应用程序类加载器过程.png"),alt:"应用程序类加载器过程"}}),t._v(" "),v("h2",{attrs:{id:"双亲委派"}},[t._v("双亲委派")]),t._v(" "),v("p",[v("font",{attrs:{color:"#93D172"}},[t._v("当一个类收到了类加载请求，他首先不会尝试自己去加载这个类，而是把这个请求委派给父类去完成")]),t._v("，每一个层次类加载器都是如此，因此所有的加载请求都应该传送到启动类加载中，"),v("font",{attrs:{color:"#93D172"}},[t._v("只有当父类加载器反馈自己无法完成这个请求的时候（在它的加载路径下没有找到所需加载的 Class），子类加载器才会尝试自己去加载")]),t._v("。")],1),t._v(" "),v("p",[t._v("采用双亲委派的一个好处是，比如加载位于 rt.jar 包中的类 java.lang.Object，不管是哪个加载器加载这个类，最终都是委托给顶层的启动类加载器进行加载，这样就保证了"),v("font",{attrs:{color:"#93D172"}},[t._v("使用不同的类加载器最终得到的都是同样一个 Object 对象")]),t._v("。")],1),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/jvm/双亲委托模型.png"),alt:"双亲委托模型"}}),t._v(" "),v("h2",{attrs:{id:"osgi-动态模型系统"}},[t._v("OSGI（动态模型系统）")]),t._v(" "),v("p",[t._v("OSGI（Open Service Gateway Initiative），是面向 Java 的动态模型系统，是 Java 动态模块化系统的一系列规范。")]),t._v(" "),v("h3",{attrs:{id:"动态改变构造"}},[t._v("动态改变构造")]),t._v(" "),v("p",[t._v("OSGI 服务平台提供在多种网络设备上无需重启的动态改变构造的功能。为了最小化耦合度和促使这些耦合度可管理，OSGI 技术提供一种面向服务的架构，他能使这些组件动态的发现对方。")]),t._v(" "),v("h3",{attrs:{id:"模块化编程域热插拔"}},[t._v("模块化编程域热插拔")]),t._v(" "),v("p",[t._v("OSGI 旨在为实现 Java 程序的模块化编程提供基础条件，基于 OSGI 的程序很可能可以"),v("font",{attrs:{color:"#45C4F3"}},[t._v("实现模块级的热插拔功能")]),t._v("，当程序升级更新时，可以只停用、重新安装然后启动程序的其中一部分，这对企业级程序开发来说是非常具有诱惑力的特性。")],1),t._v(" "),v("p",[t._v("OSGI 描绘了一个很美好的模块化开发目标，而且定义了实现这个目标的所需要服务与架构，同时也有成熟的框架进行实现支持。但并非所有的应用都适合采用 OSGI 作为基础架构，它在提供强大功能同时，也引入了额外的复杂度，因为它不遵守类加载的双亲委托模型。")])])}),[],!1,null,null,null);a.default=_.exports}}]);