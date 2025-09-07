# 身份验证设置

VeCLI 需要您使用 Volcengine 的 AI 服务进行身份验证。在首次启动时，您需要配置以下**一种**身份验证方法：

1.  **使用火山引擎 AK/SK 登录：**
    - 使用此选项通过火山引擎的 Access Key (AK) 和 Secret Key (SK) 进行身份认证。
    - 这种认证方式适用于服务器环境或自动化脚本中使用 VeCLI 的场景。
    - 认证信息将被安全缓存在本地，后续使用时无需重复配置。

    **获取 AK/SK：**
    1. 登录 [火山引擎控制台](https://console.volcengine.com/)
    2. 进入「访问控制」→「访问密钥」页面
    3. 点击「新建访问密钥」按钮
    4. 系统将生成一对 AK/SK，请妥善保存

    **配置方式：**

    **方式一：环境变量配置**
    ```bash
    export VOLC_ACCESS_KEY="your_access_key_here"
    export VOLC_SECRET_KEY="your_secret_key_here"
  
    ```

    **方式二：配置文件**
    在用户主目录下创建配置文件 `~/.vecli/config.json`：
    ```json
    {
      "auth": {
        "type": "volcengine",
        "access_key": "your_access_key_here",
        "secret_key": "your_secret_key_here",
        "region": "cn-beijing"
      }
    }
    ```

    **方式三：命令行参数**
    ```bash
    vecli --auth-type volcengine \
          --access-key your_access_key_here \
          --secret-key your_secret_key_here \
          --region cn-beijing
    ```

    **验证配置：**
    ```bash
    # 验证认证状态
    vecli auth status
    
    # 测试连接
    vecli test-connection
    ```

2.  **<a id="vecli-api-key"></a>火山引擎 API 密钥：**
    - 从 火山引擎 获取您的 API 密钥：[https://www.volcengine.com/](https://www.volcengine.com/)
    - 设置 `VECLI_API_KEY` 环境变量。在以下方法中，将 `YOUR_VECLI_API_KEY` 替换为您从 火山引擎方舟平台 获得的 API 密钥：
      - 您可以使用以下命令在当前 shell 会话中临时设置环境变量：
        ```bash
        export VECLI_API_KEY="YOUR_VECLI_API_KEY"
        ```
      - 对于重复使用，您可以将环境变量添加到您的 [.env 文件](#persisting-environment-variables-with-env-files) 中。

      - 或者，您可以从 shell 的配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）中导出 API 密钥。例如，以下命令将环境变量添加到 `~/.bashrc` 文件中：

        ```bash
        echo 'export VECLI_API_KEY="YOUR_VE_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: 请注意，当您在 shell 配置文件中导出 API 密钥时，从该 shell 执行的任何其他进程都可以读取它。


