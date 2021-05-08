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
    "revision": "acb3e9f5a89d801c7588367a9d0b6e28"
  },
  {
    "url": "architect/多线程.html",
    "revision": "8cdb0f7860d0d5576af475693144e79f"
  },
  {
    "url": "architect/数据库管理系统.html",
    "revision": "d03822a0da826d66fca95c000c2461bc"
  },
  {
    "url": "architect/index.html",
    "revision": "b9a87d54d1be06ef7c654fb3919de1e8"
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
    "url": "assets/js/10.264c9da7.js",
    "revision": "1087a7cc3236407e9dcab6c1af5a197b"
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
    "url": "assets/js/13.f13ef90d.js",
    "revision": "5b7b26f3dd800892307c073e9d94471e"
  },
  {
    "url": "assets/js/14.3de61382.js",
    "revision": "d13dd04fe702ef9cf855464c42dd1758"
  },
  {
    "url": "assets/js/15.b0a474b3.js",
    "revision": "c19ff6ea55b1540d3622f6eca3b9db8c"
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
    "url": "assets/js/18.e4d0efac.js",
    "revision": "52f84b846ab167e8179e913df49aa90c"
  },
  {
    "url": "assets/js/19.c6478aa5.js",
    "revision": "300b6aff7059c207bf1116c02d28e038"
  },
  {
    "url": "assets/js/2.0271e996.js",
    "revision": "d570f67e9f46085a029da9f5dd47b749"
  },
  {
    "url": "assets/js/20.af80274b.js",
    "revision": "fd6a35a1eca6469d1caf4091a3c79ebe"
  },
  {
    "url": "assets/js/21.c097788a.js",
    "revision": "0056f3ab658ae18dc1f35a5e334768a3"
  },
  {
    "url": "assets/js/22.491c014f.js",
    "revision": "4faa8a3ae975962c74419d34acb61669"
  },
  {
    "url": "assets/js/23.7986117a.js",
    "revision": "3dd796e21db6e4436074c6ff700ea96e"
  },
  {
    "url": "assets/js/24.0b757a7c.js",
    "revision": "3efaa46676096f81eb267d4e1b8ae2dd"
  },
  {
    "url": "assets/js/25.5582dfa3.js",
    "revision": "85acecb6981e3b38cf79b6fefedd8f61"
  },
  {
    "url": "assets/js/26.f76ff027.js",
    "revision": "eca24b7c627cd03289559d5a60327214"
  },
  {
    "url": "assets/js/27.72355416.js",
    "revision": "620886b9427fe97bfad2a043edb4524f"
  },
  {
    "url": "assets/js/28.67f4f559.js",
    "revision": "187d04e76efa318572babc7a0cb03ab0"
  },
  {
    "url": "assets/js/29.8f705f17.js",
    "revision": "755e7b363201d594b8e9c0b64054d0e5"
  },
  {
    "url": "assets/js/3.caa7ea2f.js",
    "revision": "deb85a81edfa304761aa5094b164df88"
  },
  {
    "url": "assets/js/30.12109f8c.js",
    "revision": "e45c2fbfa5eadaf16834398b50ce4324"
  },
  {
    "url": "assets/js/31.40f58441.js",
    "revision": "eacb22d226c000ac8b537ebe9d7db1cd"
  },
  {
    "url": "assets/js/32.9f653343.js",
    "revision": "fa117a6e28c380916a1e08407ec8fa84"
  },
  {
    "url": "assets/js/33.4a5eeae5.js",
    "revision": "d14d315b2bf604a732830cee8042d0b3"
  },
  {
    "url": "assets/js/34.6b2ef01a.js",
    "revision": "008f1bf2986bb9ab1f25a71819c9b61c"
  },
  {
    "url": "assets/js/35.4f75fd31.js",
    "revision": "12bc1cbbd0c0d6ae3d5fe310f2eb28a4"
  },
  {
    "url": "assets/js/36.e5055252.js",
    "revision": "f635b4eb1f2e4b001a935c5ff78c6224"
  },
  {
    "url": "assets/js/37.17bfcd74.js",
    "revision": "a8fe3b6e683efff07ed772b19025d25f"
  },
  {
    "url": "assets/js/38.49088e73.js",
    "revision": "c96dc20ff1e616c20787d64aaa167196"
  },
  {
    "url": "assets/js/39.c0f33767.js",
    "revision": "e5cf2ea6c7d4d1d30c1e7206e1ee13ba"
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
    "url": "assets/js/41.a1128dca.js",
    "revision": "0395a23c855e7c16b7d68baa38f8e4de"
  },
  {
    "url": "assets/js/42.71e98f8c.js",
    "revision": "cffa346e46cd10425279150c9c543511"
  },
  {
    "url": "assets/js/43.29a76e93.js",
    "revision": "4853b35549bcfcfc7dc868a75e334f3f"
  },
  {
    "url": "assets/js/44.b5295df2.js",
    "revision": "fc202e0880c2b6e031176e5668984391"
  },
  {
    "url": "assets/js/45.05eb9a6e.js",
    "revision": "1c4ea17013e055342849ec80264b6bbf"
  },
  {
    "url": "assets/js/46.f33c2c8e.js",
    "revision": "fcc9dd54ca285fc51ae28723b870d7d1"
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
    "url": "assets/js/5.b8d1112a.js",
    "revision": "04ee547382da10feb4b1df5036cd9ee5"
  },
  {
    "url": "assets/js/6.34b81c9e.js",
    "revision": "5f04780a0007eef3a46c688ca26fdcdd"
  },
  {
    "url": "assets/js/7.73e430d3.js",
    "revision": "758674075314f02248550136439ae062"
  },
  {
    "url": "assets/js/8.f9ad6e38.js",
    "revision": "6d9d1c30ae16678422cfb0b40166fde8"
  },
  {
    "url": "assets/js/9.b5f6cee0.js",
    "revision": "95617ded26565ea92afbb624c352053a"
  },
  {
    "url": "assets/js/app.2fd67a2f.js",
    "revision": "c404f98f58714ec849d8acd86a4407ce"
  },
  {
    "url": "database/index.html",
    "revision": "8070b61bb3947a452fa225423362c841"
  },
  {
    "url": "database/mongodb/index.html",
    "revision": "1bf094078219b8d808c81a1297284417"
  },
  {
    "url": "database/mysql/index.html",
    "revision": "29d62ae807e5744055c1fe993adeb712"
  },
  {
    "url": "database/redis/index.html",
    "revision": "7e68af163dcfc4b448196ad5f54ffaae"
  },
  {
    "url": "database/redis/Redis哈希(Hash).html",
    "revision": "efe6c3dc68685c55c677a60d0f967c49"
  },
  {
    "url": "database/redis/Redis集合(Set).html",
    "revision": "11788a3074367e22f9fc1372d6681351"
  },
  {
    "url": "database/redis/Redis键(Key).html",
    "revision": "8de43c273e8c8e9d3b7151057515d909"
  },
  {
    "url": "database/redis/Redis列表(List).html",
    "revision": "bc899905e14da89012f1410481fb752d"
  },
  {
    "url": "database/redis/Redis有序集合.html",
    "revision": "69ce976448c06c93eca4b479e384c0ab"
  },
  {
    "url": "database/redis/Redis字符串(String).html",
    "revision": "9d61fbb5191cc1e67b7bf9eb79071ffc"
  },
  {
    "url": "go/index.html",
    "revision": "e5a7aae89fb0fdc3e8da61fc9f6a9ee0"
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
    "revision": "d7061dbbebe22f751331e53b1500421a"
  },
  {
    "url": "java/index.html",
    "revision": "cd7591e97a178ff8388cf11be1b8f29b"
  },
  {
    "url": "java/io/index.html",
    "revision": "603a44dcb825c1034d599c320779113c"
  },
  {
    "url": "java/jvm/垃圾回收与算法.html",
    "revision": "51fbead374c4044ae0853c31b0861769"
  },
  {
    "url": "java/jvm/线程.html",
    "revision": "6400a6d91cd30a42c6d6214e45a1ff99"
  },
  {
    "url": "java/jvm/GC 分代收集算法 VS 分区收集算法.html",
    "revision": "b7eaf2c771c15df65f12e4a166a442d9"
  },
  {
    "url": "java/jvm/GC 垃圾收集器.html",
    "revision": "53ffc312f46c0554538b39981dd1e2fa"
  },
  {
    "url": "java/jvm/index.html",
    "revision": "219b25ce98d9ce523832410331325614"
  },
  {
    "url": "java/jvm/Java 四种引用类型.html",
    "revision": "c5b2f5b16d7363cea5900cb776a536e2"
  },
  {
    "url": "java/jvm/Java IO&NIO.html",
    "revision": "079c34a2f652d069a6755fa496c34086"
  },
  {
    "url": "java/jvm/JVM 类加载机制.html",
    "revision": "98762fd1aab0af6be7c2fec560ec911a"
  },
  {
    "url": "java/jvm/JVM 内存区域.html",
    "revision": "4cdd4e197c12e81d2b796f44051c7ebf"
  },
  {
    "url": "java/jvm/JVM 运行时内存.html",
    "revision": "70d419b117252489a61da4bf890e7e25"
  },
  {
    "url": "java/nio/index.html",
    "revision": "17636b241450d687adeb3ba837d9696a"
  },
  {
    "url": "java/thread/线程池.html",
    "revision": "197a7078c54895ece94bba06c72d432e"
  },
  {
    "url": "java/thread/线程创建方式.html",
    "revision": "e9a8552413017ab7873d52cd80d9eb5a"
  },
  {
    "url": "java/thread/线程生命周期.html",
    "revision": "ed13794c2596a2caaf0fa347cd539394"
  },
  {
    "url": "java/thread/线程终止.html",
    "revision": "fe8c29b5a0e922287158196ecebd58b2"
  },
  {
    "url": "java/thread/index.html",
    "revision": "d3188039f1770eb4814f9e40672b74a4"
  },
  {
    "url": "java/thread/sleep()与wait().html",
    "revision": "16c75907779556a2d5177dff4b6bc3ba"
  },
  {
    "url": "logo.png",
    "revision": "f1154ad69fbbb84a14a1b34c7212c4bd"
  },
  {
    "url": "microservice/eureka/Eureka 服务搭建.html",
    "revision": "d04dcbc3e93919f2c78aa2c17106815d"
  },
  {
    "url": "microservice/eureka/Eureka 集群搭建.html",
    "revision": "6c9c023f2116e6ffed687e40b290a31a"
  },
  {
    "url": "microservice/eureka/index.html",
    "revision": "fb20fcf2419f58dc10e2bf93b37c2de9"
  },
  {
    "url": "microservice/index.html",
    "revision": "0a230f6c7c73c92dd156d072375ffc42"
  },
  {
    "url": "microservice/ribbon/index.html",
    "revision": "5365e3a607711e4b26c1915171c77db2"
  },
  {
    "url": "spring/index.html",
    "revision": "d67fed4e94d71cd5b63fbc5d75824de2"
  },
  {
    "url": "spring/spring/index.html",
    "revision": "57aecbf57c53a1e53f37bde17e9bfc30"
  },
  {
    "url": "spring/springBoot/index.html",
    "revision": "10ea410e726d2148cac6e3f523f5c9fd"
  },
  {
    "url": "spring/springSecurity/index.html",
    "revision": "eeb4ababa470085dc64060a43686b16d"
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
