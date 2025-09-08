# 身份验证设置

VeCLI 需要您使用 Volcengine 的 AI 服务进行身份验证。在首次启动时，您需要配置以下**一种**身份验证方法：

**使用火山引擎 AK/SK 登录：**
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
    export VOLCENGINE_ACCESS_KEY="your_access_key_here"
    export VOLCENGINE_SECRET_KEY="your_secret_key_here"
  
    ```

    **方式二：配置文件**
    在用户主目录下创建配置文件 `~/.ve/.env`：
    ```
    "VOLCENGINE_ACCESS_KEY": "your ak",
    "VOLCENGINE_SECRET_KEY": "your sk",
    "OPENAI_API_KEY": "your api key"
    ```

    **验证配置：**
    ```bash
    # 验证认证状态
    vecli auth status
    
    # 测试连接
    vecli test-connection
    ```


