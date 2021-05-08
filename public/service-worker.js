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
    "revision": "a624c45db56fa54f86c7d8e8f4e22485"
  },
  {
    "url": "architect/多线程.html",
    "revision": "a106fc0046e0d58e2155e054860fac42"
  },
  {
    "url": "architect/数据库管理系统.html",
    "revision": "4100df44f33bf3166979e4fda5410bb0"
  },
  {
    "url": "architect/index.html",
    "revision": "d462b03a1fc0c0b64bcea2dc1d2730c8"
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
    "url": "assets/js/10.9596189d.js",
    "revision": "ab5dba1cc43d6fa8236ebe414290bfc0"
  },
  {
    "url": "assets/js/11.caa8a3ce.js",
    "revision": "1a3f8a1c79ab13de7c860b655a53baee"
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
    "url": "assets/js/14.cb65a506.js",
    "revision": "87097ecb407924000b00f2621c7ce235"
  },
  {
    "url": "assets/js/15.67679d14.js",
    "revision": "cce96736f08bee9b50db069d18428998"
  },
  {
    "url": "assets/js/16.a61c99f4.js",
    "revision": "210bed05b36a00eb782862d14381f17c"
  },
  {
    "url": "assets/js/17.fa3ffcb1.js",
    "revision": "23b8b4004db35bad5514a4bc72fcfdd1"
  },
  {
    "url": "assets/js/18.a6f67ac0.js",
    "revision": "4ac4bc816b08317227276dcb2763ee05"
  },
  {
    "url": "assets/js/19.d64da146.js",
    "revision": "246eee12831794600ea8b9050f731e06"
  },
  {
    "url": "assets/js/2.0271e996.js",
    "revision": "d570f67e9f46085a029da9f5dd47b749"
  },
  {
    "url": "assets/js/20.f3aea93c.js",
    "revision": "ea09866054770a0ce3fa9a96933a5e16"
  },
  {
    "url": "assets/js/21.0d54a03a.js",
    "revision": "904e25a067f1a9a2e60a28d2ccfa193b"
  },
  {
    "url": "assets/js/22.af5f8ff3.js",
    "revision": "87119283ecc37f34536b7d5e56b9903c"
  },
  {
    "url": "assets/js/23.d62f60ff.js",
    "revision": "04018c6c6ba3543f4284b17935056788"
  },
  {
    "url": "assets/js/24.e82ab4f9.js",
    "revision": "d087a2540542c9c6ff11fef078c06df0"
  },
  {
    "url": "assets/js/25.0c6fb9d1.js",
    "revision": "41862e83932b1e2ded78910a3bd29a71"
  },
  {
    "url": "assets/js/26.f76ff027.js",
    "revision": "eca24b7c627cd03289559d5a60327214"
  },
  {
    "url": "assets/js/27.b33888ec.js",
    "revision": "ef5ec94fb2bbe30574582ad1a2051e0d"
  },
  {
    "url": "assets/js/28.b6bb8900.js",
    "revision": "764632b3be31de54e6f6021084e4a2fd"
  },
  {
    "url": "assets/js/29.da46a9d1.js",
    "revision": "600b26e94ee335bfdb4c5ea01c286f34"
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
    "url": "assets/js/31.d899f45b.js",
    "revision": "5bbc1bae8fab0d104d75c3d882e1ed86"
  },
  {
    "url": "assets/js/32.4249f1c4.js",
    "revision": "7b0da54b999f6c3af9e01d27c4e29578"
  },
  {
    "url": "assets/js/33.4a5eeae5.js",
    "revision": "d14d315b2bf604a732830cee8042d0b3"
  },
  {
    "url": "assets/js/34.d274b518.js",
    "revision": "d7be10991ff505e035054002835a770a"
  },
  {
    "url": "assets/js/35.040c2e79.js",
    "revision": "c5456574620e2a658110a60dfe3d813c"
  },
  {
    "url": "assets/js/36.1869c4d4.js",
    "revision": "14f36867f022d4de6d3263d9da9f7213"
  },
  {
    "url": "assets/js/37.2502c91b.js",
    "revision": "d4de32d6a56f7d346233c044eb3418e5"
  },
  {
    "url": "assets/js/38.8a9c4c47.js",
    "revision": "aadb1fc5e34296f068767bd706d32a96"
  },
  {
    "url": "assets/js/39.0372b754.js",
    "revision": "f0285aef475faa840bababb5b966bf9d"
  },
  {
    "url": "assets/js/4.9cb324be.js",
    "revision": "f6086a004e3a61ba6183ed64dc8eb5ef"
  },
  {
    "url": "assets/js/40.36582b46.js",
    "revision": "584c6fc20a9c7a265e57f82eec2eeb80"
  },
  {
    "url": "assets/js/41.a1128dca.js",
    "revision": "0395a23c855e7c16b7d68baa38f8e4de"
  },
  {
    "url": "assets/js/42.a7a870ab.js",
    "revision": "7faf5abcd7a00484871d9059e44d665e"
  },
  {
    "url": "assets/js/43.52e5222a.js",
    "revision": "f8e7228773b64a08932b827184c6f495"
  },
  {
    "url": "assets/js/44.9e3dbdd3.js",
    "revision": "e363d3552830dd396c9fbfc2c9b162f1"
  },
  {
    "url": "assets/js/45.c2f0e646.js",
    "revision": "5dd8af07566539a94a067d4a1a345920"
  },
  {
    "url": "assets/js/46.f33c2c8e.js",
    "revision": "fcc9dd54ca285fc51ae28723b870d7d1"
  },
  {
    "url": "assets/js/47.2b23762b.js",
    "revision": "6cb604118f3fce1337698d40d06b19a9"
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
    "url": "assets/js/6.8f0ec843.js",
    "revision": "654cbbb8f54b21113b7b62ef7f76a515"
  },
  {
    "url": "assets/js/7.7ea023b2.js",
    "revision": "2b43653f184ecbd1394f3af430ee7515"
  },
  {
    "url": "assets/js/8.2ad448e8.js",
    "revision": "039443ae7f5ae6a1a00a6a3e838d5c0b"
  },
  {
    "url": "assets/js/9.a7b5ef8e.js",
    "revision": "70ba84bdc322921240cd7ac97654b4c1"
  },
  {
    "url": "assets/js/app.b8c437fb.js",
    "revision": "fcf2d504541185c0ce7f2a8e14161524"
  },
  {
    "url": "database/index.html",
    "revision": "6669bfa47de841155eee2dea07412c54"
  },
  {
    "url": "database/mongodb/index.html",
    "revision": "bffb1b4cd277cf534d887b5b1f7f7d6a"
  },
  {
    "url": "database/mysql/index.html",
    "revision": "d0aa7bbe4141b22506a27b47bca8e16a"
  },
  {
    "url": "database/redis/index.html",
    "revision": "705b582fa17810b3dc35a241ecf1d7ab"
  },
  {
    "url": "database/redis/Redis哈希(Hash).html",
    "revision": "d868706d480cd5d5463d877cc5c15361"
  },
  {
    "url": "database/redis/Redis集合(Set).html",
    "revision": "9ec106e572204224de2faa180f96be50"
  },
  {
    "url": "database/redis/Redis键(Key).html",
    "revision": "0c04f2367501da921fb69236971c32e0"
  },
  {
    "url": "database/redis/Redis列表(List).html",
    "revision": "4ad6bff810fdda2b1ae7b036aa43a0f6"
  },
  {
    "url": "database/redis/Redis有序集合.html",
    "revision": "24caa3a87c597c2e504c89a80659c19e"
  },
  {
    "url": "database/redis/Redis字符串(String).html",
    "revision": "55835daae2355374de7a90486f63d0c9"
  },
  {
    "url": "go/index.html",
    "revision": "f7cec6f170df4b01d0612a46ed263929"
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
    "revision": "36eb7137985de2941f0b1621fc6b07fd"
  },
  {
    "url": "java/index.html",
    "revision": "4c65142c51865885b7e81bffdbe692df"
  },
  {
    "url": "java/io/index.html",
    "revision": "3bf13f495629d064157b4b94f7f57ec7"
  },
  {
    "url": "java/jvm/垃圾回收与算法.html",
    "revision": "6c73d12941ab6a89d60ff2005b54e9f4"
  },
  {
    "url": "java/jvm/线程.html",
    "revision": "85db460db604f4ba456a9ac917ced6d5"
  },
  {
    "url": "java/jvm/GC 分代收集算法 VS 分区收集算法.html",
    "revision": "118d05b4837044b731ef1bbdbfe8ea0b"
  },
  {
    "url": "java/jvm/GC 垃圾收集器.html",
    "revision": "8aea03cfe636a56c2580cd754e276db3"
  },
  {
    "url": "java/jvm/index.html",
    "revision": "f2fd4633459d216df169d6cdf1832774"
  },
  {
    "url": "java/jvm/Java 四种引用类型.html",
    "revision": "05b2671a7cbb1cfa1778976d6650e2b5"
  },
  {
    "url": "java/jvm/Java IO&NIO.html",
    "revision": "c2f04c82a9a5a8215bd70eaf6334c769"
  },
  {
    "url": "java/jvm/JVM 类加载机制.html",
    "revision": "51240297926c4526d373eaf0dabdb0c9"
  },
  {
    "url": "java/jvm/JVM 内存区域.html",
    "revision": "3fc2ab5dd3dc686738336afad7ebcbc4"
  },
  {
    "url": "java/jvm/JVM 运行时内存.html",
    "revision": "cea5926ef47d798990bbb651de94dd9f"
  },
  {
    "url": "java/nio/index.html",
    "revision": "b10ffb35bbad4fb18d0485dde6f8bd72"
  },
  {
    "url": "java/thread/线程池.html",
    "revision": "a22a6041d465e97bd6c43c49f8b83db0"
  },
  {
    "url": "java/thread/线程创建方式.html",
    "revision": "f714c8ea77acb0e7c80cbd7d3cb9876e"
  },
  {
    "url": "java/thread/线程生命周期.html",
    "revision": "c870e62a14f086fc6af3a219d4f5066d"
  },
  {
    "url": "java/thread/线程终止.html",
    "revision": "e0ff0fd5d90f5b4e21d394ca2668b3a3"
  },
  {
    "url": "java/thread/index.html",
    "revision": "2a33b98443d01e0443c8ae4ca2c3d8dd"
  },
  {
    "url": "java/thread/sleep()与wait().html",
    "revision": "8bfd5b6a4f26465ff6b9fc341aaa2882"
  },
  {
    "url": "logo.png",
    "revision": "f1154ad69fbbb84a14a1b34c7212c4bd"
  },
  {
    "url": "microservice/eureka/Eureka 服务搭建.html",
    "revision": "17dfe3e6b2ca1062170e47121a39f97e"
  },
  {
    "url": "microservice/eureka/Eureka 集群搭建.html",
    "revision": "ab8cdf45c2b13bc2285e2471c0bd613a"
  },
  {
    "url": "microservice/eureka/index.html",
    "revision": "0c1fd528cfab7100f0f6666e08bba327"
  },
  {
    "url": "microservice/index.html",
    "revision": "c0fc0362f199c3bb64926a2fe517395d"
  },
  {
    "url": "microservice/ribbon/index.html",
    "revision": "bbf0a518a3c7ec21f888f527e06f8ea7"
  },
  {
    "url": "spring/index.html",
    "revision": "f3c2e62d33f950ece8e08e0976caaf3d"
  },
  {
    "url": "spring/spring/index.html",
    "revision": "baec7700f7f483155eb77314f1031555"
  },
  {
    "url": "spring/springBoot/index.html",
    "revision": "f55044b2196fbfb7548def6de5aa0844"
  },
  {
    "url": "spring/springSecurity/index.html",
    "revision": "0f321b427d2b5bcaa009855757c21b12"
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
