---
title: Import 注解 + ImportBeanDefinitionRegistrar 动态 Bean 加载通用模板
date: 2022-05-23
categories:
 - Spring 系列
tags:
 - SpringBoot
---

模板中涉及到 6 个类，分别是：

* IBeanDefinitionRegister：用于构建和注册自定义的 IServicePostProcessor，它只是一个引入辅助，真正复杂的 Bean 注册都在 IServicePostProcessor 中去实现；
* IServicePostProcessor：实现接口 BeanDefinitionRegisterPostProcessor，当容器启动时，就会调用 postProcessBeanDefinitionRegister 方法，所以自定义的 bean 加载的主要逻辑就是在这里书写；
* IBeanDefinitionScanner：Bean 定义的过滤器，主要的功能就是去声明那些 Bean 定义需要加载到容器，哪些是不需要加载的；
* IConfiguration：自定义的配置注解，参数 packages 表示需要扫描的包路径；
* IService：自定义的 Service 注解，标注使用；
* IConfig：配置类

下面是代码示例：

## IBeanDefinitionRegister
```java
public class IBeanDefinitionRegister implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

        StandardAnnotationMetadata metadata = (StandardAnnotationMetadata) importingClassMetadata;
        // 获取主程序启动类
        Class<?> introspectedClass = metadata.getIntrospectedClass();
        IConfiguration configuration = introspectedClass.getAnnotation(IConfiguration.class);

        if (configuration == null) {
            return;
        }

        // 获取扫描路径
        String[] packages = configuration.packages();
        List<String> packageList = Arrays.stream(packages).distinct().collect(Collectors.toList());

        // 构建 bean 定义
        BeanDefinitionBuilder definition = BeanDefinitionBuilder.rootBeanDefinition(IServicePostProcessor.class);

        // 添加 bean 构造函数的参数
        definition.addConstructorArgValue(packageList);

        // 获取 bean 的名称
        String beanName = BeanDefinitionReaderUtils.generateBeanName(definition.getBeanDefinition(), registry, false);

        // 注册bean
        registry.registerBeanDefinition(beanName, definition.getBeanDefinition());
    }
}
```
## IServicePostProcessor
```java
public class IServicePostProcessor implements BeanDefinitionRegistryPostProcessor, ResourceLoaderAware {

    private final List<String> packages;

    /**
     * 用于加载资源（例如，类路径或文件系统资源）的策略接口
     */
    private ResourceLoader resourceLoader;

    public IServicePostProcessor(List<String> packages) {
        this.packages = packages;
    }

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        IBeanDefinitionScanner scanner = new IBeanDefinitionScanner(registry);
        scanner.registFilters();
        scanner.setResourceLoader(this.resourceLoader);
        packages.forEach(scanner::doScan);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {

    }

    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }
}
```
## IBeanDefinitionScanner
```java
public class IBeanDefinitionScanner extends ClassPathBeanDefinitionScanner {

    public IBeanDefinitionScanner(BeanDefinitionRegistry registry) {
        super(registry);
    }

    public void registFilters() {
        // 只加载被MyService注解的bean
        addIncludeFilter(new AnnotationTypeFilter(IService.class));

        // 同样的满足任意excludeFilters不会被加载
        // addExcludeFilter(new AnnotationTypeFilter(IService.class));
    }

    /**
     * doScan方法会加载该路径下执行的类型bean
     */
    @Override
    protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
        return super.doScan(basePackages);
    }
}
```
## IService
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface IService {
}
```
## IConfiguration
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(IBeanDefinitionRegister.class)
public @interface IConfiguration {

    /**
     * 需要扫描的包路径
     */
    String[] packages();

}
```
## IConfig
```java
@IConfiguration(packages = "cn.cy.learning.spring.define.service")
public class IConfig {
}
```
## 测试用例
```java
@Slf4j
@IService
public class IServiceComponent01 {

    public IServiceComponent01() {
        log.info("Generate IServiceComponent01 bean.");
    }
}

```
```java
@Slf4j
@IService
public class IServiceComponent02 {
    public IServiceComponent02() {
        log.info("Generate IServiceComponent02 bean.");
    }
}

```
```java
@Slf4j
@IService
public class IServiceComponent03 {
    public IServiceComponent03() {
        log.info("Generate IServiceComponent03 bean.");
    }
}

```
```java
@Slf4j
public class IServiceComponent04 {
    public IServiceComponent04() {
        log.info("Generate IServiceComponent04 bean.");
    }
}

```
### IBeanDefinitionRegisterTest
```java
@Slf4j
@SpringBootTest
public class IBeanDefinitionRegisterTest {

    @Test
    public void test() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(IConfig.class);

        IServiceComponent01 component01 = context.getBean(IServiceComponent01.class);
        log.info("IServiceComponent04 is {} empty", component01 == null ? "" : "not");

        IServiceComponent04 component04 = context.getBean(IServiceComponent04.class);
        log.info("IServiceComponent04 is {} empty", component04 == null ? "" : "not");
    }

}
```
