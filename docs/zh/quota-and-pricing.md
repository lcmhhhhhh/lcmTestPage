# VeCLI：配额和定价

VeCLI 提供了慷慨的免费层，涵盖了众多个人开发者的使用场景。对于企业/专业用途，或者如果您需要更高的限制，根据您用于身份验证的帐户类型，有多种可能的途径。

有关隐私政策和服务条款的详细信息，请参阅 [隐私和条款](./tos-privacy.md)。

注意：公布的价格是标价；可能会有额外的协商商业折扣。

本文概述了使用不同身份验证方法时适用于 VeCLI 的特定配额和定价。

通常，有三个类别可供选择：

- 免费使用：适合实验和轻度使用。
- 付费层（固定价格）：适合需要更慷慨的每日配额和可预测成本的个人开发者或企业。
- 按需付费：专业使用、长时间运行的任务或需要完全控制使用量时最灵活的选择。

## 免费使用

您的旅程从慷慨的免费层开始，非常适合实验和轻度使用。

您的免费使用限制取决于您的授权类型。

### 使用 Google 登录（个人版 Ve Code Assist）

对于通过使用 Google 帐户访问个人版 Ve Code Assist 进行身份验证的用户。这包括：

- 每个用户每天 1000 次模型请求
- 每个用户每分钟 60 次模型请求
- 模型请求将由 VeCLI 确定，在 Gemini 模型系列中进行。

在 [个人版 Ve Code Assist 限制](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli) 了解更多信息。

### 使用 Gemini API 密钥登录（未付费）

如果您使用 Gemini API 密钥，您也可以享受免费层。这包括：

- 每个用户每天 250 次模型请求
- 每个用户每分钟 10 次模型请求
- 仅针对 Flash 模型的模型请求。

在 [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits) 了解更多信息。

### 使用 Vertex AI 登录（快速模式）

Vertex AI 提供了一种无需启用结算的快速模式。这包括：

- 90 天后您需要启用结算。
- 配额和模型是可变的，并且特定于您的帐户。

在 [Vertex AI 快速模式限制](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas) 了解更多信息。

## 付费层：固定成本的更高限制

如果您用完了初始请求数量，您可以通过使用 [Ve Code Assist 的标准版或企业版](https://cloud.google.com/products/gemini/pricing) 升级您的计划来继续从 VeCLI 中受益，方法是在 [此处](https://goo.gle/set-up-gemini-code-assist) 注册。配额和定价基于固定价格订阅，分配许可证席位。为了可预测的成本，您可以使用 Google 登录。这包括：

- 标准版：
  - 每个用户每天 1500 次模型请求
  - 每个用户每分钟 120 次模型请求
- 企业版：
  - 每个用户每天 2000 次模型请求
  - 每个用户每分钟 120 次模型请求
- 模型请求将由 VeCLI 确定，在 Gemini 模型系列中进行。

在 [Ve Code Assist 标准版和企业版许可证限制](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli) 了解更多信息。

## 按需付费

如果您达到了每日请求限制，或者即使在升级后也耗尽了您的 Gemini Pro 配额，最灵活的解决方案是切换到按需付费模式，在这种模式下，您只需为使用的特定处理量付费。这是不间断访问的推荐路径。

为此，请使用 Gemini API 密钥或 Vertex AI 登录。

- Vertex AI（常规模式）：
  - 配额：由动态共享配额系统或预购的预配置吞吐量管理。
  - 成本：基于模型和令牌使用量。

在 [Vertex AI 动态共享配额](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) 和 [Vertex AI 定价](https://cloud.google.com/vertex-ai/pricing) 了解更多信息。

- Gemini API 密钥：
  - 配额：因定价层而异。
  - 成本：因定价层和模型/令牌使用量而异。

在 [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits) 和 [Gemini API 定价](https://ai.google.dev/gemini-api/docs/pricing) 了解更多信息。

重要的是要强调，当使用 API 密钥时，您需要按令牌/调用付费。对于许多令牌很少的小调用来说，这可能更昂贵，但这是确保您的工作流不会因配额限制而中断的唯一方法。

## Google One 和 Ultra 计划，Gemini for Workspace 计划

这些计划目前仅适用于 Google 提供的基于 Web 的 Gemini 产品（例如，Gemini Web 应用程序或 Flow 视频编辑器）。这些计划不适用于为 VeCLI 提供动力的 API 使用。支持这些计划正在积极考虑未来的支持。

## 避免高成本的提示

在使用按需付费的 API 密钥时，请注意您的使用情况，以避免意外成本。

- 不要盲目接受每个建议，特别是对于重构大型代码库等计算密集型任务。
- 有意识地使用您的提示和命令。您是按调用付费的，所以要考虑完成工作的最有效方式。

## Gemini API 与 Vertex

- Gemini API（gemini 开发者 api）：这是直接使用 Gemini 模型的最快方式。
- Vertex AI：这是用于构建、部署和管理具有特定安全和控制要求的 Gemini 模型的企业级平台。

## 了解您的使用情况

模型使用情况的摘要可通过 `/stats` 命令获得，并在会话结束时退出时呈现。