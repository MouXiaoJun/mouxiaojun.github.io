---
title: Go 设计模式 23 讲
description: 不背 UML，从真实 Go 后端场景理解 23 个 GoF 模式、标准库替代方案与工程取舍。
---

# Go 设计模式 23 讲

<div class="content-intro">
这不是一份背定义的目录。每篇都从 Go 后端真实问题出发，讲清楚模式解决什么、Go 里更自然的写法是什么，以及什么时候根本不该使用它。
</div>

<div class="content-strip">
  <span class="content-pill">接口</span>
  <span class="content-pill">函数值</span>
  <span class="content-pill">组合</span>
  <span class="content-pill">并发</span>
  <span class="content-pill">状态机</span>
  <span class="content-pill">标准库</span>
  <span class="content-pill">工程取舍</span>
</div>

<div class="content-kicker">01 / 创建型模式</div>
<div class="content-grid">
  <a class="content-card" href="./单例模式"><span class="content-card-index">01 / CREATIONAL</span><span class="content-card-arrow">↗</span><h3>单例模式</h3><p>sync.Once、进程级资源初始化，以及什么时候应该改用依赖注入。</p></a>
  <a class="content-card" href="./工厂模式"><span class="content-card-index">02 / CREATIONAL</span><span class="content-card-arrow">↗</span><h3>工厂模式</h3><p>把对象创建收口到 composition root，根据配置选择具体实现。</p></a>
  <a class="content-card" href="./建造者模式"><span class="content-card-index">03 / CREATIONAL</span><span class="content-card-arrow">↗</span><h3>建造者模式</h3><p>复杂对象分阶段构造、统一校验，以及 Builder 与 Functional Options。</p></a>
  <a class="content-card" href="./原型模式"><span class="content-card-index">04 / CREATIONAL</span><span class="content-card-arrow">↗</span><h3>原型模式</h3><p>深浅拷贝、不可变共享与昂贵模板对象复制。</p></a>
  <a class="content-card" href="./抽象工厂模式"><span class="content-card-index">05 / CREATIONAL</span><span class="content-card-arrow">↗</span><h3>抽象工厂模式</h3><p>多云、多厂商场景里创建一组彼此匹配的实现。</p></a>
</div>

<div class="content-kicker">02 / 结构型模式</div>
<div class="content-grid">
  <a class="content-card" href="./适配器模式"><span class="content-card-index">06 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>适配器模式</h3><p>支付、短信、OSS 等第三方 SDK 的反腐层。</p></a>
  <a class="content-card" href="./桥接模式"><span class="content-card-index">07 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>桥接模式</h3><p>两个变化维度独立演进，避免组合爆炸。</p></a>
  <a class="content-card" href="./组合模式"><span class="content-card-index">08 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>组合模式</h3><p>用统一接口处理文件树、组织树和权限树。</p></a>
  <a class="content-card" href="./装饰器模式"><span class="content-card-index">09 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>装饰器模式</h3><p>http.Handler / RoundTripper 风格的能力叠加。</p></a>
  <a class="content-card" href="./外观模式"><span class="content-card-index">10 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>外观模式</h3><p>用高层用例入口收敛复杂子系统调用。</p></a>
  <a class="content-card" href="./享元模式"><span class="content-card-index">11 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>享元模式</h3><p>共享昂贵、不可变对象，以及缓存容量与生命周期。</p></a>
  <a class="content-card" href="./代理模式"><span class="content-card-index">12 / STRUCTURAL</span><span class="content-card-arrow">↗</span><h3>代理模式</h3><p>缓存、远程、权限与延迟加载等访问控制。</p></a>
</div>

<div class="content-kicker">03 / 行为型模式</div>
<div class="content-grid">
  <a class="content-card" href="./职责链模式"><span class="content-card-index">13 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>职责链模式</h3><p>审批、风控规则按顺序执行，并允许节点终止链。</p></a>
  <a class="content-card" href="./命令模式"><span class="content-card-index">14 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>命令模式</h3><p>把调用变成可排队、重试、审计和持久化的数据。</p></a>
  <a class="content-card" href="./解释器模式"><span class="content-card-index">15 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>解释器模式</h3><p>用 AST 构造规则 DSL，同时控制执行安全边界。</p></a>
  <a class="content-card" href="./迭代器模式"><span class="content-card-index">16 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>迭代器模式</h3><p>Go 1.23+ iter.Seq 与分页 API 的懒遍历。</p></a>
  <a class="content-card" href="./中介者模式"><span class="content-card-index">17 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>中介者模式</h3><p>减少模块网状依赖，同时避免演变成 God Mediator。</p></a>
  <a class="content-card" href="./备忘录模式"><span class="content-card-index">18 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>备忘录模式</h3><p>快照、Undo、配置回滚，以及深拷贝带来的成本。</p></a>
  <a class="content-card" href="./观察者模式"><span class="content-card-index">19 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>观察者模式</h3><p>进程内事件订阅、取消订阅与同步/异步语义。</p></a>
  <a class="content-card" href="./状态模式"><span class="content-card-index">20 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>状态模式</h3><p>状态机规则组织，以及数据库并发 CAS。</p></a>
  <a class="content-card" href="./策略模式"><span class="content-card-index">21 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>策略模式</h3><p>用函数类型或小接口替换不断膨胀的算法分支。</p></a>
  <a class="content-card" href="./模板方法模式"><span class="content-card-index">22 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>模板方法模式</h3><p>Go 没有继承时，用组合与 Hook 固定流程骨架。</p></a>
  <a class="content-card" href="./访问者模式"><span class="content-card-index">23 / BEHAVIORAL</span><span class="content-card-arrow">↗</span><h3>访问者模式</h3><p>在 AST 上增加新操作，以及 Visitor 与 type switch 的取舍。</p></a>
</div>

## 先学 Go，再学模式

设计模式不是目标。真正值得掌握的是：**识别变化方向，并把变化隔离在正确边界。**

如果一个模式让代码比原来的函数、接口或组合更难读，那就先不要用。
