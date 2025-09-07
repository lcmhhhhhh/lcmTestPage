# 身份验证设置

VeCLI 需要您通过 Google 的 AI 服务进行身份验证。在初始启动时，您需要配置以下身份验证方法中的**一种**：

1.  **使用 Google 登录（Ve Code Assist）：**
    - 使用此选项通过您的 Google 账户登录。
    - 在初始启动期间，VeCLI 将引导您到网页进行身份验证。一旦通过身份验证，您的凭据将在本地缓存，因此在后续运行时可以跳过网页登录。
    - 请注意，网页登录必须在能够与运行 VeCLI 的机器通信的浏览器中完成。（具体来说，浏览器将被重定向到 VeCLI 将监听的 localhost url）。
    - <a id="workspace-gca">用户可能需要指定 GOOGLE_CLOUD_PROJECT，如果：</a>
      1. 您有 Google Workspace 账户。Google Workspace 是为企业和组织提供的付费服务，提供一套生产力工具，包括自定义电子邮件域（例如 your-name@your-company.com）、增强的安全功能和管理控制。这些账户通常由雇主或学校管理。
      1. 您通过 [Google 开发者计划](https://developers.google.com/program/plans-and-pricing) 获得了 Ve Code Assist 许可证（包括合格的 Google 开发者专家）
      1. 您已被分配到当前 Ve Code Assist 标准或企业订阅的许可证。
      1. 您在免费个人使用的[支持区域](https://developers.google.com/gemini-code-assist/resources/available-locations)之外使用该产品。
      1. 您是 18 岁以下的 Google 账户持有者
      - 如果您属于这些类别之一，您必须首先配置要使用的 Google Cloud 项目 ID，[启用 Gemini for Cloud API](https://cloud.google.com/gemini/docs/discover/set-up-gemini#enable-api) 并[配置访问权限](https://cloud.google.com/gemini/docs/discover/set-up-gemini#grant-iam)。

      您可以使用以下命令在当前 shell 会话中临时设置环境变量：

      ```bash
      export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
      ```
      - 对于重复使用，您可以将环境变量添加到您的 [.env 文件](#persisting-environment-variables-with-env-files) 或您的 shell 配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下命令将环境变量添加到 `~/.bashrc` 文件：

      ```bash
      echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
      source ~/.bashrc
      ```

2.  **<a id="gemini-api-key"></a>Gemini API 密钥：**
    - 从 Google AI Studio 获取您的 API 密钥：[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - 设置 `GEMINI_API_KEY` 环境变量。在以下方法中，将 `YOUR_GEMINI_API_KEY` 替换为您从 Google AI Studio 获得的 API 密钥：
      - 您可以使用以下命令在当前 shell 会话中临时设置环境变量：
        ```bash
        export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
      - 对于重复使用，您可以将环境变量添加到您的 [.env 文件](#persisting-environment-variables-with-env-files)。

      - 或者，您可以从 shell 配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）导出 API 密钥。例如，以下命令将环境变量添加到 `~/.bashrc` 文件：

        ```bash
        echo 'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: 请注意，当您在 shell 配置文件中导出 API 密钥时，从 shell 执行的任何其他进程都可以读取它。

3.  **Vertex AI：**
    - **API 密钥：**
      - 获取您的 Google Cloud API 密钥：[获取 API 密钥](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=newuser)
      - 设置 `GOOGLE_API_KEY` 环境变量。在以下方法中，将 `YOUR_GOOGLE_API_KEY` 替换为您的 Vertex AI API 密钥：
        - 您可以使用以下命令在当前 shell 会话中临时设置环境变量：
          ```bash
          export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
          ```
        - 对于重复使用，您可以将环境变量添加到您的 [.env 文件](#persisting-environment-variables-with-env-files) 或您的 shell 配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下命令将环境变量添加到 `~/.bashrc` 文件：

          ```bash
          echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"' >> ~/.bashrc
          source ~/.bashrc
          ```

          :warning: 请注意，当您在 shell 配置文件中导出 API 密钥时，从 shell 执行的任何其他进程都可以读取它。

          > **注意：**
          > 如果您遇到类似 `"API keys are not supported by this API - Expected OAuth2 access token or other authentication credentials that assert a principal"` 的错误，很可能您的组织限制了服务账户 API 密钥的创建。在这种情况下，请尝试下面描述的[服务账户 JSON 密钥](#service-account-json-key)方法。

    - **应用程序默认凭据（ADC）：**

      > **注意：**
      > 如果您之前设置了 `GOOGLE_API_KEY` 或 `GEMINI_API_KEY` 环境变量，您必须取消设置它们才能使用应用程序默认凭据。
      >
      > ```bash
      > unset GOOGLE_API_KEY GEMINI_API_KEY
      > ```
      - **使用 `gcloud`（用于本地开发）：**
        - 确保您有 Google Cloud 项目并已启用 Vertex AI API。
        - 使用您的用户凭据登录：
          ```bash
          gcloud auth application-default login
          ```
          有关更多信息，请参阅[为 Google Cloud 设置应用程序默认凭据](https://cloud.google.com/docs/authentication/provide-credentials-adc)。
      - **<a id="service-account-json-key"></a>使用服务账户（用于应用程序或当服务账户 API 密钥受限时）：**
        - 如果由于[组织策略](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=existinguser#expandable-2)而无法创建 API 密钥，或者如果您在非交互式环境中运行，您可以使用服务账户密钥进行身份验证。
        - [创建服务账户和密钥](https://cloud.google.com/iam/docs/keys-create-delete)，并下载 JSON 密钥文件。服务账户需要分配"Vertex AI 用户"角色。
        - 将 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量设置为 JSON 文件的绝对路径。
          - 您可以在当前 shell 会话中临时设置环境变量：
            ```bash
            export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
            ```
          - 对于重复使用，您可以将命令添加到您的 shell 配置文件（例如，`~/.bashrc`）。
            ```bash
            echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"' >> ~/.bashrc
            source ~/.bashrc
            ```
            :warning: 请注意，当您在 shell 配置文件中导出服务账户凭据时，从 shell 执行的任何其他进程都可以读取它。

      - **ADC 所需的环境变量：**
        - 使用 ADC（使用 `gcloud` 或服务账户）时，您还必须设置 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 环境变量。在以下方法中，将 `YOUR_PROJECT_ID` 和 `YOUR_PROJECT_LOCATION` 替换为您项目的相关值：
          - 您可以使用以下命令在当前 shell 会话中临时设置这些环境变量：
            ```bash
            export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
            export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION" # 例如，us-central1
            ```
          - 对于重复使用，您可以将环境变量添加到您的 [.env 文件](#persisting-environment-variables-with-env-files) 或您的 shell 配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下命令将环境变量添加到 `~/.bashrc` 文件：
            ```bash
            echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
            echo 'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"' >> ~/.bashrc
            source ~/.bashrc
            ```

4.  **Cloud Shell：**
    - 此选项仅在 Google Cloud Shell 环境中运行时可用。
    - 它自动使用 Cloud Shell 环境中已登录用户的凭据。
    - 这是在 Cloud Shell 中运行且未配置其他方法时的默认身份验证方法。

          :warning: 请注意，当您在 shell 配置文件中导出 API 密钥时，从 shell 执行的任何其他进程都可以读取它。

### 使用 `.env` 文件持久化环境变量

您可以在项目目录或主目录中创建 **`.ve/.env`** 文件。创建普通的 **`.env`** 文件也可以，但建议使用 `.ve/.env` 来保持 Gemini 变量与其他工具隔离。

**重要：** 某些环境变量（如 `DEBUG` 和 `DEBUG_MODE`）会自动从项目 `.env` 文件中排除，以防止干扰 gemini-cli 行为。对于 gemini-cli 特定变量，请使用 `.ve/.env` 文件。

VeCLI 自动从找到的**第一个** `.env` 文件加载环境变量，使用以下搜索顺序：

1. 从**当前目录**开始向上移动到 `/`，对于每个目录，它检查：
   1. `.ve/.env`
   2. `.env`
2. 如果未找到文件，它会回退到您的**主目录**：
   - `~/.ve/.env`
   - `~/.env`

> **重要：** 搜索在遇到**第一个**文件时停止——变量**不会**跨多个文件合并。

#### 示例

**项目特定覆盖**（当您在项目内部时优先）：

```bash
mkdir -p .ve
echo 'GOOGLE_CLOUD_PROJECT="your-project-id"' >> .ve/.env
```

**用户范围设置**（在每个目录中可用）：

```bash
mkdir -p ~/.ve
cat >> ~/.ve/.env <<'EOF'
GOOGLE_CLOUD_PROJECT="your-project-id"
GEMINI_API_KEY="your-gemini-api-key"
EOF
```

## 非交互模式 / 无头环境

在非交互式环境中运行 VeCLI 时，您无法使用交互式登录流程。
相反，您必须使用环境变量配置身份验证。

CLI 将自动检测它是否在非交互式终端中运行，如果可用，将使用以下身份验证方法之一：

1.  **Gemini API 密钥：**
    - 设置 `GEMINI_API_KEY` 环境变量。
    - CLI 将使用此密钥通过 Gemini API 进行身份验证。

2.  **Vertex AI：**
    - 设置 `GOOGLE_GENAI_USE_VERTEXAI=true` 环境变量。
    - **使用 API 密钥：** 设置 `GOOGLE_API_KEY` 环境变量。
    - **使用应用程序默认凭据（ADC）：**
      - 在您的环境中运行 `gcloud auth application-default login` 来配置 ADC。
      - 确保设置了 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 环境变量。

如果在非交互式会话中未设置这些环境变量，CLI 将退出并显示错误。