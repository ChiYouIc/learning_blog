/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "469f801fe43b9da871e62150187ef819"
  },
  {
    "url": "architect/多线程.html",
    "revision": "d5d5337043954b21c293f691a93c42c5"
  },
  {
    "url": "architect/数据库管理系统.html",
    "revision": "5f127e956387e3a681459a3460eac313"
  },
  {
    "url": "architect/index.html",
    "revision": "e9fe8345e89040c1f76072b6eb73bf54"
  },
  {
    "url": "assets/css/0.styles.292e88f6.css",
    "revision": "5d057e6a28ebefb0dc921d1764395df0"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/search.867d45d8.svg",
    "revision": "867d45d8f9c0da0e3e733dd5e7a8d263"
  },
  {
    "url": "assets/js/10.fa32bf79.js",
    "revision": "f0730b017ee2a4764b872191e5ead4dd"
  },
  {
    "url": "assets/js/11.78d93213.js",
    "revision": "08aa058c6b88ee99582cb592e8f836a7"
  },
  {
    "url": "assets/js/12.c835fde2.js",
    "revision": "64af4984ff9d7cdf5d40851fa78a6c4a"
  },
  {
    "url": "assets/js/13.5d287911.js",
    "revision": "0c35a5534f22b337f366d821380db825"
  },
  {
    "url": "assets/js/14.6ecbd0f5.js",
    "revision": "5560ad9a22e890cf84d3a202bef95d9d"
  },
  {
    "url": "assets/js/15.e32309c1.js",
    "revision": "84224fceab35c9b21940a5d1e79905dd"
  },
  {
    "url": "assets/js/16.c056875c.js",
    "revision": "59304f36e26890eebf67e1b6ab38098f"
  },
  {
    "url": "assets/js/17.edd6c008.js",
    "revision": "2e1bb3b0616c216ef71c33ccc870aa68"
  },
  {
    "url": "assets/js/18.8bd7f64a.js",
    "revision": "2df316724c0dbba78bbb33bd9c49e192"
  },
  {
    "url": "assets/js/19.af0c561f.js",
    "revision": "f1e96bae6f11c77c843d35f0fd44eeb0"
  },
  {
    "url": "assets/js/2.0271e996.js",
    "revision": "d570f67e9f46085a029da9f5dd47b749"
  },
  {
    "url": "assets/js/20.361d64c4.js",
    "revision": "6659e4d3794e4f6b7ab3f94eb6e41de5"
  },
  {
    "url": "assets/js/21.478bca13.js",
    "revision": "da3e166289a3e7a7802b1b5ebc537351"
  },
  {
    "url": "assets/js/22.26b34132.js",
    "revision": "5f6af5096c1fbed2af67e0de37a6655b"
  },
  {
    "url": "assets/js/23.1e8fa082.js",
    "revision": "bd223cf7478fd99bb8f4919560b039e1"
  },
  {
    "url": "assets/js/24.b6bac62a.js",
    "revision": "9ede546a9dbf1de7f8f5771bf2deb61e"
  },
  {
    "url": "assets/js/25.5582dfa3.js",
    "revision": "85acecb6981e3b38cf79b6fefedd8f61"
  },
  {
    "url": "assets/js/26.cac04321.js",
    "revision": "dad28065aad89cc369f6c7ca3366cec7"
  },
  {
    "url": "assets/js/27.72355416.js",
    "revision": "620886b9427fe97bfad2a043edb4524f"
  },
  {
    "url": "assets/js/28.bc5305b5.js",
    "revision": "4744c9091eeff9f81b64b99ce188f873"
  },
  {
    "url": "assets/js/29.7f917b30.js",
    "revision": "1259e88ccffbae1ad2b1dcd571846b7f"
  },
  {
    "url": "assets/js/3.caa7ea2f.js",
    "revision": "deb85a81edfa304761aa5094b164df88"
  },
  {
    "url": "assets/js/30.5827ec14.js",
    "revision": "f4e61976f53e9530ad24f686767b6f3b"
  },
  {
    "url": "assets/js/31.3027fa44.js",
    "revision": "08e80d5d76a293e9901d006878188249"
  },
  {
    "url": "assets/js/32.01590656.js",
    "revision": "45a5a8827b36b96945a0f5764e947c50"
  },
  {
    "url": "assets/js/33.2812e46f.js",
    "revision": "86e7a3df2efeb3437c9035a49ae4b5c1"
  },
  {
    "url": "assets/js/34.5640d10b.js",
    "revision": "3e9c6b8af5ae4f3d9071ea042d692fee"
  },
  {
    "url": "assets/js/35.4ecf3e29.js",
    "revision": "90ed11c734d47e7d194d00dd9d71db03"
  },
  {
    "url": "assets/js/36.e5055252.js",
    "revision": "f635b4eb1f2e4b001a935c5ff78c6224"
  },
  {
    "url": "assets/js/37.80616500.js",
    "revision": "c4f82160ff83cc536f85c4d99eebaed6"
  },
  {
    "url": "assets/js/38.49088e73.js",
    "revision": "c96dc20ff1e616c20787d64aaa167196"
  },
  {
    "url": "assets/js/39.277912e4.js",
    "revision": "e472bee87f5464d52efa1c09a0ded89d"
  },
  {
    "url": "assets/js/4.9cb324be.js",
    "revision": "f6086a004e3a61ba6183ed64dc8eb5ef"
  },
  {
    "url": "assets/js/40.91b9658b.js",
    "revision": "b630db7281937d4f1a12445ecc1283ac"
  },
  {
    "url": "assets/js/41.fa379765.js",
    "revision": "300e14fd2a2d6a1660669d7ba48320e8"
  },
  {
    "url": "assets/js/42.01e11c2a.js",
    "revision": "a02068fd8fb94d8f6824582a28f25c71"
  },
  {
    "url": "assets/js/43.14333640.js",
    "revision": "ac5b65d314884b9fa83f12782a92d806"
  },
  {
    "url": "assets/js/44.feab68a6.js",
    "revision": "32c9d0f72354993dfaeb7eef31cb520c"
  },
  {
    "url": "assets/js/45.3fc299e2.js",
    "revision": "bc2078f4c017f07bda6ff992664ccff7"
  },
  {
    "url": "assets/js/46.b14746f1.js",
    "revision": "551f8b08e9e92c3f3961148c7d6e2a60"
  },
  {
    "url": "assets/js/47.0d802150.js",
    "revision": "0a3725f1d67b2b998cefe73500c785db"
  },
  {
    "url": "assets/js/48.85c9ecd0.js",
    "revision": "e1e744b1a9aa7963cbe9ba3b6f6a0c98"
  },
  {
    "url": "assets/js/5.3007a890.js",
    "revision": "03248573923cce05b987d98de0b1c3c0"
  },
  {
    "url": "assets/js/6.adfa8de6.js",
    "revision": "35e43cbf74cd839fe4767c6bba7489c3"
  },
  {
    "url": "assets/js/7.b2d01a0f.js",
    "revision": "7d1c63be1116a71027768a33a47b8719"
  },
  {
    "url": "assets/js/8.2ad448e8.js",
    "revision": "039443ae7f5ae6a1a00a6a3e838d5c0b"
  },
  {
    "url": "assets/js/9.0a29ecb6.js",
    "revision": "15b548a153b6e51bc5e4b8ea160e0c19"
  },
  {
    "url": "assets/js/app.27be6c1f.js",
    "revision": "7e2388d41ccf0f24b540738264b76dfa"
  },
  {
    "url": "database/index.html",
    "revision": "d3d67c0d05e39a8bcbe120054c0bd4f5"
  },
  {
    "url": "database/mongodb/index.html",
    "revision": "51b963d5e34ef3f4e5513e597c969598"
  },
  {
    "url": "database/mysql/index.html",
    "revision": "0a6c9d5537f04a22b01c1a1319841eb8"
  },
  {
    "url": "database/redis/index.html",
    "revision": "7f874b63b89419f87c9a0e67c8ec7a13"
  },
  {
    "url": "database/redis/Redis哈希(Hash).html",
    "revision": "3aa8135fa923bb26e6b3d1193029176d"
  },
  {
    "url": "database/redis/Redis集合(Set).html",
    "revision": "320638f50072d41fcf3cb3df3f21e91b"
  },
  {
    "url": "database/redis/Redis键(Key).html",
    "revision": "08d3e6ccea6ee62d314d0aea249ce5ad"
  },
  {
    "url": "database/redis/Redis列表(List).html",
    "revision": "78e67ebee12adb453f637240a6485f68"
  },
  {
    "url": "database/redis/Redis有序集合.html",
    "revision": "8cd2cdcea5f4296a3ee1862220ef2e45"
  },
  {
    "url": "database/redis/Redis字符串(String).html",
    "revision": "0a72495849465655e19442e65b7d25e2"
  },
  {
    "url": "go/index.html",
    "revision": "872054a504e9745903e93bb2fe989ed6"
  },
  {
    "url": "icons/homescreen.png",
    "revision": "f1154ad69fbbb84a14a1b34c7212c4bd"
  },
  {
    "url": "img/java/jvm/标记清除算法示例图.png",
    "revision": "8af6a45e0033aeaeedc3f4da57f80256"
  },
  {
    "url": "img/java/jvm/标记整理算法示例图.png",
    "revision": "8b19c01c3c9f280142616d28f05dd908"
  },
  {
    "url": "img/java/jvm/复制算法示例图.png",
    "revision": "d81177014d47af0e788f881ff9554706"
  },
  {
    "url": "img/java/jvm/缓冲区数据流向.png",
    "revision": "a87655762e72e934b592a726b17df4ec"
  },
  {
    "url": "img/java/jvm/双亲委托模型.png",
    "revision": "d40f91e9c1eff0e84d1b65c27efe05fd"
  },
  {
    "url": "img/java/jvm/新生代 Parallel Scavenge 和年老代 Parallel Old 收集器搭配运行过程图.png",
    "revision": "e99b7e472be25ae4d1dfbdab6e78da63"
  },
  {
    "url": "img/java/jvm/新生代 Parallel Scavenge-ParNew 与年老代 Serial Old 搭配垃圾收集过程图.png",
    "revision": "56b8809f4027736b2b02464797f0e3e5"
  },
  {
    "url": "img/java/jvm/新生代 Serial 与年老代 Serial Old 搭配垃圾收集过程图.png",
    "revision": "09467812d96b0f9465268842a1e1b8fe"
  },
  {
    "url": "img/java/jvm/新生代内存.png",
    "revision": "046b419f8c04c9f2ed2641b989b03b58"
  },
  {
    "url": "img/java/jvm/虚拟机栈.png",
    "revision": "5a9d395a1ecf2ef16e2c068fb345fbaf"
  },
  {
    "url": "img/java/jvm/应用程序类加载器过程.png",
    "revision": "038601abd04c92fc803e334590abb344"
  },
  {
    "url": "img/java/jvm/CMS 收集器工作过程.png",
    "revision": "13fd991648364d139d1aa8011601778a"
  },
  {
    "url": "img/java/jvm/Java IO包.png",
    "revision": "146d7a495a31808e3d30465abab23879"
  },
  {
    "url": "img/java/jvm/Java NIO包.png",
    "revision": "2311072917d972990b82f8a8f6ec2fb4"
  },
  {
    "url": "img/java/jvm/Java NIO网络模型.png",
    "revision": "3cc61447b7cd41429409f0f53a0e50b4"
  },
  {
    "url": "img/java/jvm/JVM 内存.png",
    "revision": "d7c7c366872ac1a61617e6d6e80b8079"
  },
  {
    "url": "img/java/jvm/JVM GC.png",
    "revision": "a21c36b611490000f7cf9998ace3e5f4"
  },
  {
    "url": "img/java/jvm/JVM.png",
    "revision": "c4a053d5d1706821a3f6698ad3e1d904"
  },
  {
    "url": "img/java/jvm/jvm类加载流程.png",
    "revision": "37f24601e7352d31f0ade8809101e75a"
  },
  {
    "url": "img/java/jvm/jvm数据区.png",
    "revision": "9e39a4cd51752832ac77fbb68db9a437"
  },
  {
    "url": "img/java/jvm/jvm运行过程.png",
    "revision": "ca9e6345ceb5c6afd772b61ec4334bef"
  },
  {
    "url": "img/java/jvm/JVM运行时内存.png",
    "revision": "8d2de083a0dc81ffc31e6c921b158a10"
  },
  {
    "url": "img/java/jvm/Sun HotSpot 虚拟机的垃圾收集器.png",
    "revision": "67a358baec59dd1dbe6253c6a9ec1dc5"
  },
  {
    "url": "img/java/thread/线程池的执行流程.png",
    "revision": "3dfe7c821fc983500db4ede7cb0c4dce"
  },
  {
    "url": "img/java/thread/线程池状态.png",
    "revision": "ae300e3eb74c89146dde5bf6ec3556aa"
  },
  {
    "url": "img/java/thread/线程五态.png",
    "revision": "36640050431e9b4d01ea80b9211fe785"
  },
  {
    "url": "img/microservice/eureka/创建工程.png",
    "revision": "d0d5ae0d1025c8d7322a38de9484a9e1"
  },
  {
    "url": "img/microservice/eureka/创建集群工程.png",
    "revision": "9f4abfd19ae49594f7e7722f4108569e"
  },
  {
    "url": "img/microservice/eureka/Eureka Server 8011.png",
    "revision": "42de59c5761b32e34b03aeaac357b136"
  },
  {
    "url": "img/microservice/eureka/Eureka Server 8012.png",
    "revision": "4b31f55b9307ed9fc7e1f8242c8a385f"
  },
  {
    "url": "img/microservice/eureka/Eureka Server 8013.png",
    "revision": "c368beee0ed995e146159b45a742f683"
  },
  {
    "url": "img/microservice/eureka/Eureka Server主页面.png",
    "revision": "2da5c6026e8daa23a4f15246d27b1d57"
  },
  {
    "url": "img/microservice/eureka/Eureka架构图.png",
    "revision": "fffe86f8f11a446d82ceb5cc6d0e4b77"
  },
  {
    "url": "index.html",
    "revision": "2d78dc8bc01cb4292cef28c04d293d34"
  },
  {
    "url": "java/index.html",
    "revision": "de5e13768a57b5a3a4bc58cb4fee2dba"
  },
  {
    "url": "java/io/index.html",
    "revision": "93482452cc6ed6665faf7fdb48ade953"
  },
  {
    "url": "java/jvm/垃圾回收与算法.html",
    "revision": "d7532b2eae0bf25b5d014eda20e4694b"
  },
  {
    "url": "java/jvm/线程.html",
    "revision": "6d1f18cf76da1b337e018b9c9f5bbbb0"
  },
  {
    "url": "java/jvm/GC 分代收集算法 VS 分区收集算法.html",
    "revision": "22954a9d9c4a5c916dfa57b8a3f641f0"
  },
  {
    "url": "java/jvm/GC 垃圾收集器.html",
    "revision": "fe6e58db664bbbda358e1154bedb39c2"
  },
  {
    "url": "java/jvm/index.html",
    "revision": "2373fa8e4f9b82b334f1cbcaa0d22aba"
  },
  {
    "url": "java/jvm/Java 四种引用类型.html",
    "revision": "c13eb9a2bd6c66b0015895b0ded36d87"
  },
  {
    "url": "java/jvm/Java IO&NIO.html",
    "revision": "867c83fa872f09c1b547b072942be4b9"
  },
  {
    "url": "java/jvm/JVM 类加载机制.html",
    "revision": "d37525656b64ab18acf7960bc18b74e6"
  },
  {
    "url": "java/jvm/JVM 内存区域.html",
    "revision": "22be26ada4f1758c9e0d7a832870d0e8"
  },
  {
    "url": "java/jvm/JVM 运行时内存.html",
    "revision": "d2383e5c56300c00d8346f49bbc25880"
  },
  {
    "url": "java/nio/index.html",
    "revision": "1aafd2de3a7a9dc3b3a8c88f303f373d"
  },
  {
    "url": "java/thread/线程池.html",
    "revision": "6297fa9aed8996e25bd591d2f2819c48"
  },
  {
    "url": "java/thread/线程创建方式.html",
    "revision": "fb58748e61155fa13bad1046e051a0d1"
  },
  {
    "url": "java/thread/线程生命周期.html",
    "revision": "6ed5e63e5bb3cc264349e9cdaf44585b"
  },
  {
    "url": "java/thread/线程终止.html",
    "revision": "15d695aebc0c059a70400c4c9f8db521"
  },
  {
    "url": "java/thread/index.html",
    "revision": "3b427b6754c58e93da0773e3e448fdf9"
  },
  {
    "url": "java/thread/sleep()与wait().html",
    "revision": "1a20ad8365532a12264bbbe46cc8e610"
  },
  {
    "url": "logo.png",
    "revision": "f1154ad69fbbb84a14a1b34c7212c4bd"
  },
  {
    "url": "microservice/eureka/Eureka 服务搭建.html",
    "revision": "26778c84fd174c5b61f07e9dffaf4a57"
  },
  {
    "url": "microservice/eureka/Eureka 集群搭建.html",
    "revision": "bda72375d691b5a21b3a0b305c3795b2"
  },
  {
    "url": "microservice/eureka/index.html",
    "revision": "ea3553ac450785879bbfec15da854e0f"
  },
  {
    "url": "microservice/index.html",
    "revision": "eaf786c482851adb19fd303035798990"
  },
  {
    "url": "microservice/ribbon/index.html",
    "revision": "4e1f417bb63068326ca1cd7c18317578"
  },
  {
    "url": "spring/index.html",
    "revision": "fac995695f1ac207e21a205b57da0a4f"
  },
  {
    "url": "spring/spring/index.html",
    "revision": "f24050414d3460cc0761d5e0b6edd333"
  },
  {
    "url": "spring/springBoot/index.html",
    "revision": "2eeda7c5268f880d1b97f33c09256c83"
  },
  {
    "url": "spring/springSecurity/index.html",
    "revision": "a648686bbf1fd89ad810fd9ae88a7888"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
