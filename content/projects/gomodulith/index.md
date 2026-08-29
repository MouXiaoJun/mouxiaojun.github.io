---
title: 模块化单体架构工具
description: gomodulith 利用 Go 的包模型、internal 规则和 go/packages，把模块发现、边界验证、架构图与 AI 可读契约变成可执行工具。
repo: https://github.com/MouXiaoJun/gomodulith
status: 持续构建
---

# 模块化单体架构工具

`gomodulith` 的目标不是再发明一种目录结构，而是让模块化单体的架构约束能够被发现、测试、文档化，并在 CI 中持续验证。

## 为什么需要它

一个 Go 单体通常从下面的结构开始：

```text
internal/
├── user/
├── order/
├── payment/
└── notification/
```

随着业务增长，边界逐渐只存在于人的记忆中：

- `order` 可以依赖哪些模块？
- 跨模块只能 import `api`，还是可以直接访问 `domain`？
- 最近一次提交是否引入了循环依赖？
- AI Coding Agent 修改代码前，能否读到相同的架构约束？

`gomodulith` 将这些约定变成可执行架构。

## Go 风格的模块模型

默认约定：

```text
internal/
├── user/
│   ├── api/       # 模块公开 API
│   ├── domain/
│   └── internal/  # 私有实现
├── order/
│   ├── api/
│   └── internal/
└── payment/
    └── api/
```

跨模块允许：

```go
import "example.com/app/internal/user/api"
```

但会拒绝：

```go
import "example.com/app/internal/user/domain"
```

## 架构测试

```go
package app_test

import (
    "testing"

    "github.com/MouXiaoJun/gomodulith/modulith"
)

func TestArchitecture(t *testing.T) {
    app := modulith.Scan(t, "./...")
    app.VerifyTest(t)
}
```

它可以检查：

| 检查 | 说明 |
|---|---|
| Cross-module private access | 访问了其他模块的私有包 |
| Undeclared dependency | 依赖未在 Allow List 中声明 |
| Forbidden dependency | 命中显式禁止依赖 |
| Cycle | 出现模块级循环依赖 |
| Type leakage | 公共 API 暴露了私有类型 |
| Event-driven violation | 声明事件驱动后仍直接依赖实现包 |

## CLI 与架构文档

```bash
gomodulith verify ./...
gomodulith graph --format mermaid
gomodulith explain order
gomodulith export --format sarif --verify
gomodulith contract
gomodulith diff origin/main HEAD
```

输出不仅服务人，也服务 CI、GitHub Code Scanning 和 AI Agent：

```text
源代码依赖图
    ↓
模块模型
    ↓
边界验证
    ↓
Mermaid / D2 / JSON / SARIF
    ↓
AI 可读架构契约
```

## 显式规则

不采用默认目录约定的项目，可以直接声明模块：

```go
app := modulith.New().
    Module("user", "./internal/user/...").
    Module("order", "./internal/order/...").
    Module("payment", "./internal/payment/...")

app.ModuleRules("order").AllowDependencies("user", "payment")
app.ModuleRules("order").ForbidDependencies("billing")
```

显式模式默认 fail-closed：没有声明为允许的模块依赖会被报告。

## 配置与增量使用

团队可以提交 `.gomodulith.yaml` 或 `.gomodulith.toml`，统一约定：

- Module Root；
- Public API / Event Package；
- Allowed / Forbidden Dependencies；
- Published Events；
- Orphan Package 策略；
- 默认扫描 Patterns。

重复执行还可以使用增量缓存，避免每次都完整加载 `go/packages`。

## 安装

```bash
go get github.com/MouXiaoJun/gomodulith/modulith
go install github.com/MouXiaoJun/gomodulith/cmd/gomodulith@latest
```

- [查看 GitHub 仓库](https://github.com/MouXiaoJun/gomodulith)
