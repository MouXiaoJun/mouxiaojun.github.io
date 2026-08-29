---
title: 有状态 API 模糊测试
description: SpecRiot 是 Go 原生 OpenAPI Fuzzer；当前已实现 v0.2 Contract Fuzzing，并向依赖推断、有状态序列、失败缩减与重放演进。
repo: https://github.com/MouXiaoJun/specriot
status: v0.2 已实现
---

# 有状态 API 模糊测试

`SpecRiot` 把 OpenAPI 文档转换成确定、可验证的 API 测试输入。它不只随机攻击单个 Endpoint，而是沿着依赖关系逐步理解业务状态。

> 当前已实现 **v0.2 Contract Fuzzing**：OpenAPI 3 解析、合法值与边界/非法值生成、HTTP 执行和响应契约验证。Dependency Graph、Stateful Sequence、Shrinking 与 Replay 仍按 Roadmap 演进。

## 为什么单接口 Fuzz 不够

很多后端 Bug 不存在于某一个请求里，而存在于请求序列：

```text
POST /users
    ↓ response.id
POST /orders { user_id: $user.id }
    ↓ response.id
DELETE /orders/{id}
    ↓
DELETE /orders/{id}   ← 500
```

完全随机的 `GET /orders/123` 大多没有意义。真正有价值的是先创建资源、提取响应值、绑定到后续请求，再变异状态流。

## 当前能力：Contract Fuzzing

```bash
specriot run openapi.yaml \
  --url http://localhost:8080 \
  --seed 42 \
  --iterations 5 \
  --fuzz-ratio 0.3
```

`v0.2` 当前能够：

- 解析 OpenAPI 3 文档；
- 生成 string、integer、number、boolean、object、array；
- 处理 required、enum、min/max、format、oneOf、anyOf、allOf；
- 生成边界值、越界值、错误类型、缺失必填字段；
- 验证状态码、Content-Type、JSON 格式和响应 Schema；
- 报告 HTTP 5xx 与传输错误；
- 通过 Seed 确定性复现相同输入顺序。

## 失败分类

| 类型 | 含义 |
|---|---|
| `server_error` | 服务返回 HTTP 5xx |
| `request_error` | 连接失败、超时等传输问题 |
| `undocumented_status` | 返回了 OpenAPI 未声明的状态码 |
| `invalid_content_type` | Content-Type 与契约不一致 |
| `malformed_response` | 预期 JSON，但 Body 无法解析 |
| `invalid_response_body` | 响应 Body 不满足声明 Schema |

## Go Library 与 go test

```go
func TestAPI(t *testing.T) {
    spec, err := specriot.Load("openapi.yaml")
    if err != nil {
        t.Fatal(err)
    }

    report, err := spec.Run(
        context.Background(),
        server.URL,
        specriot.WithSeed(42),
        specriot.WithFuzzRatio(0.3),
    )
    if err != nil {
        t.Fatal(err)
    }

    for _, failure := range report.Failures {
        t.Errorf("%s %s: %s", failure.Method, failure.Path, failure.Class())
    }
}
```

它既是 CLI，也是一套可以直接 import 的 Go Library。

## 确定性为什么重要

同一个 Spec、配置和 Seed 必须生成相同输入：

- Operation 固定排序；
- PRNG 由 Seed 驱动；
- Object Property 固定排序；
- UUID 也来自 Seed，而不是 `crypto/rand`。

这样 CI 找到的问题不再是“偶现”，而是可以进入 Regression Corpus 的确定性失败。

## 版本走向

```text
v0.1  Spec Execution
v0.2  Contract Fuzzing        ← 当前
v0.3  Dependency Graph
v0.4  Stateful Fuzzing
v0.5  Shrink & Replay
v0.6  Real-world Extensibility
v0.7  CI & Go Testing
v0.8  Feedback-guided Exploration
v0.9  Hardening
v1.0  Stable
```

项目不会把自己变成压测工具、通用漏洞扫描器或爬虫。它的边界是：

> 从 API Specification 中发现状态与契约正确性问题。

- [查看 GitHub 仓库](https://github.com/MouXiaoJun/specriot)
- [查看完整 Roadmap](https://github.com/MouXiaoJun/specriot/blob/main/ROADMAP.md)
