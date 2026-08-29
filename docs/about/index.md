---
title: 关于我
---

# 关于我

## 我是谁

**邓晖** · Golang 后端工程师

我主要关注三个方向：**可靠的后端系统、可演进的软件架构，以及真正能落地的 AI 工程**。

相比只完成某一个业务需求，我更喜欢继续追问：这个问题能不能抽象成稳定的机制？边界能不能更清楚？失败时能不能被验证和复现？这些问题也逐渐变成了我做开源项目的方向。

## 技术方向

- **Go Backend**：并发控制、数据一致性、缓存、消息系统、服务端工程化
- **Distributed Systems**：分布式协调、租约、fencing、故障语义与可观测性
- **Architecture Tooling**：模块边界、依赖约束、架构验证与工程可维护性
- **AI Platform**：Agent 编排、LLM 应用、语音链路、第三方能力接入与 AI 辅助研发

## Open Source

### [distsync](https://github.com/MouXiaoJun/distsync)

Distributed synchronization primitives for Go, backed by Redis and Valkey.

围绕 `Mutex`、`RWMutex`、`Semaphore`、`RateLimiter`、Leader Election、Lease 与 fencing token，尝试把分布式同步原语做成接近 Go `sync` 包的使用体验。

### [gomodulith](https://github.com/MouXiaoJun/gomodulith)

Architecture verification and modular monolith toolkit for Go.

目标是让模块化单体的边界不再只存在于文档和约定中，而是能够被发现、验证、测试和生成架构图。

### [specriot](https://github.com/MouXiaoJun/specriot)

Dependency-aware stateful API fuzzing from OpenAPI specs.

从 OpenAPI 推导 API 之间的 producer-consumer dependency，探索多请求状态序列，并把发现的失败缩小成可确定性重放的最小用例。

## 这个站点

- [Go 设计模式 23 讲](/design-patterns/)：23 个 GoF 模式在 Go 中的落地
- [工程随笔](/blog/)：后端架构、并发一致性、状态机、基础设施和 AI 工程实践
- [GitHub](https://github.com/MouXiaoJun)：正在维护和实验的开源项目

## 联系方式

- GitHub：[github.com/MouXiaoJun](https://github.com/MouXiaoJun)
- 邮箱：1016848185@qq.com
