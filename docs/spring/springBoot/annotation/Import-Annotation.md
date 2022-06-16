---
title: Import 注解使用
date: 2022-04-26
categories:
 - Spring 系列
tags:
 - SpringBoot
---

## @Import 注解

`@Import` 注解了用于导入一个或多个自定义的组件类（通常情况指的是使用 `@Configuration` 修饰的类）。

它实现了与 Spring XML 中 `<import>` 标签同样的功能，允许导入 `@Configuration` 修饰的配置类、`ImportSelector` 和 `ImportBeanDefinitionRegistrar` 的实现类，以及常规组件类。

@Import 注解的使用场景，组件类或配置类不需要使用到 SpringBoot 的全局扫描，或是 SpringBoot 自动扫描不到时，可使用 @Import 进行类的导入声明。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Import {

    /**
     * 支持 @Configuration 声明的配置类、
     * ImportSelector 和 ImportBeanDefinitionRegistrar 的接口实现类
     */
    Class<?>[] value();

}
```

下面使用 @Import 注解类实现 Bean 注入的相关功能。

## 使用 @Import 注解直接注入

### 创建两个普通的组件类

```java
public class Component1 {

    public Component1() {
        System.out.println("create Component1 bean");
    }
}
```

```java
public class Component2 {

    public Component2() {
        System.out.println("creat Component2 bean");
    }

    @Bean("useBeanAnnotationInComponent2")
    public String useBeanAnnotation() {
        System.out.println("use Bean Annotation in Component2");
        return "";
    }
}
```

### 创建一个使用 @Configuration 修饰的配置类

```java
@Configuration
public class MyConfiguration {

    public MyConfiguration() {
        System.out.println("create MyConfiguration bean");
    }

    @Bean("useBeanAnnotationInConfiguration")
    public void useBeanAnnotation() {
        System.out.println("use bean annotation in MyConfiguration");
    }
}
```

### 编写启动类

```java
@Import({Component1.class, Component2.class, MyConfiguration.class})
@SpringBootApplication
public class ApplicationStart {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationStart.class, args);
    }
}
```

### 输出结果

```bash
create MyConfiguration bean
use bean annotation in MyConfiguration
create Component1 bean
creat Component2 bean
use Bean Annotation in Component2
```

::: tip
从输出信息中分析，类 Component1、Component2、MyConfiguration 都被创建出来，其中类 Conponent2 的方法 `useBeanAnnotation` 使用了 `@Bean` 注解，在应用初始化时也同样要被执行。另外，MyConfiguration 类虽然使用了 `@Configuration` 注解，又在 @Import 注解中声明导入，但在实例化时，并不会反复创建，根据输出信息的顺序与 @Import 注解导入类的顺序可知，@Configuration 声明的类的初始化在 @Import 注解导入的类初始化之前，那么可以总结出，`@Import 声明导入的对象，在 SpringBoot 自动扫描装配之后`。
:::

## 实现 ImportBeanDefinitionRegistrar 接口

首先复用 [使用 @Import 注解直接注入](#使用-import-注解直接注入)中的 Component1 和 Component2 对象。创建 `MyBeanDefinitionRegistrar` 类，并实现 `ImportBeanDefinitionRegistrar` 接口，先看一下 `ImportBeanDefinitionRegistrar` 接口的声明：

```java
public interface ImportBeanDefinitionRegistrar {

    /**
     * 根据导入 @Configuration 类的给定注释元数据，根据需要注册 bean 定义
     *
     * <p>由于受到 @Configuration 类处理相关的声明周期约束，
     * BeanDefinitionRegistryPostProcessor 类型并不会在这里注册，意思就是
     * 这里注册的 Bean 提交时，BeanDefinitionRegistryPostProcessor 获取不到。
     * 
     * <p>该方法的默认实现，委托给了 registerBeanDefinitions(importingClassMetadata, registry);
     *
     * @param importingClassMetadata   注解元数据
     * @param registry                 当前自定义 Bean 注册表
     * @param importBeanNameGenerator  导入 bean 的 bean 名称生成器策略
     * 
     */
    default void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry, BeanNameGenerator importBeanNameGenerator) {
        registerBeanDefinitions(importingClassMetadata, registry);
    }

    /**
     * 根据导入 @Configuration 类的给定注释元数据，根据需要注册 bean 定义。 
     * <p>请注意，由于与 {@code @Configuration} 类处理相关的生命周期限制，
     * BeanDefinitionRegistryPostProcessor 类型可能未在此处注册。 
     *
     * <p>默认实现为空。
     * 
     * @param importingClassMetadata 导入的注解元数据
     * @param registry               当前自定义 Bean 注册表
     */
    default void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
    }

}
```

### 代码实例

```java
public class MyBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        // 获取 builder
        BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.rootBeanDefinition(MyConfiguration.class);

        // 获取注册 bean 的名称
        String beanName = BeanDefinitionReaderUtils.generateBeanName(beanDefinitionBuilder.getBeanDefinition(), registry, false);

        // 注册 Bean
        registry.registerBeanDefinition(beanName, beanDefinitionBuilder.getBeanDefinition());
    }
}
```

使用 @Import 注解加载 MyBeanDefinitionRegistrar：

```java
@Import({MyBeanDefinitionRegistrar.class})
@SpringBootApplication
public class ApplicationStart {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationStart.class, args);
    }
}
```

::: tip
通过实现 ImportBeanDefinitionRegistrar 接口就可以加载指定类，当类加载比较复杂时，可以配合自定义注解加载，通过自定义BeanDefinitionScanner，使用 addIncludeFilter 过滤出需要加载的类。可参考[@Import + ImportBeanDefinitionRegistrar 动态 Bean 加载通用模板](Dynamic-Bean-Loading.md)
:::

## 实现 ImportSelector 接口

通过实现 ImportSelector，返回类路径数组，也可以直接加载指定的 bean。

### ImportSelector 接口定义

```java
public interface ImportSelector {

    /**
         * 根据导入 @Configuration 类的 AnnotationMetadata Configuration 并返回应导入的类的名称
         *
         * @param importingClassMetadata 定义对特定类的注释的抽象访问的接口
         * @return 类名，如果没有，则为空数组
         */
    String[] selectImports(AnnotationMetadata importingClassMetadata);

    /**
         * 返回一个从导入候选中排除类的谓词，以传递地应用于通过此选择器的导入找到的所有类。
         * 如果该谓词对给定的完全限定类名返回true ，则该类将不会被视为导入的配置类，从而绕过类文件加载以及元数据自省。
         *
         * @return 传递导入配置类的完全限定候选类名称的过滤谓词，如果没有，则为null
         */
    @Nullable
    default Predicate<String> getExclusionFilter() {
        return null;
    }

}
```

### 代码实例

```java
public class MyImportSelector implements ImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        Set<String> types = importingClassMetadata.getAnnotationTypes();

        // 返回需要注册的 bean 的全限定类名数组
        return new String[]{
                "cn.cy.learning.spring.Component1",
                "cn.cy.learning.spring.Component2",
                "cn.cy.learning.spring.MyConfiguration",
        };
    }

    @Override
    public Predicate<String> getExclusionFilter() {

        return new Predicate<String>() {
            @Override
            public boolean test(String o) {

                return false;
            }
        };
    }
}
```

使用 @Import 注解加载 MyImportSelector：

```java
@Import({MyImportSelector.class})
@SpringBootApplication
public class ApplicationStart {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationStart.class, args);
    }
}
```

::: tip
ImportSelector 是 SpringBoot 自动装配的核心原理，SpringBoot 通过加载约定的配置文件 META-INF/spring.factories，文件中有需要加载的类的全路径，通过 ImportSelector 实现自动加载。
:::