# Authentication Setup

The VeCLI requires you to authenticate with Google's AI services. On initial startup you'll need to configure **one** of the following authentication methods:

1.  **Login with Volcengine AK/SK:**
    - Use this option to authenticate through Volcengine's Access Key (AK) and Secret Key (SK).
    - This authentication method is suitable for scenarios where VeCLI is used in server environments or automated scripts.
    - Authentication information will be securely cached locally, eliminating the need for repeated configuration in subsequent uses.

    **Obtaining AK/SK:**
    1. Log in to [Volcengine Console](https://console.volcengine.com/)
    2. Navigate to "Access Control" → "Access Keys" page
    3. Click "Create Access Key" button
    4. The system will generate a pair of AK/SK, please save them securely

    **Configuration Methods:**

    **Method 1: Environment Variable Configuration**
    ```bash
    export VOLC_ACCESS_KEY="your_access_key_here"
    export VOLC_SECRET_KEY="your_secret_key_here"
    export VOLC_REGION="cn-beijing"  # Optional, set default region
    ```

    **Method 2: Configuration File**
    Create a configuration file `~/.vecli/config.json` in the user's home directory:
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

    **Method 3: Command Line Parameters**
    ```bash
    vecli --auth-type volcengine \
          --access-key your_access_key_here \
          --secret-key your_secret_key_here \
          --region cn-beijing
    ```

    **Verifying Configuration:**
    ```bash
    # Verify authentication status
    vecli auth status
    
    # Test connection
    vecli test-connection
    ```

2.  **<a id="volcengine-api-key"></a>Login with Volcengine API key:**
    - Obtain your API key from Volcengine: [https://www.volcengine.com/](https://www.volcengine.com/)
    - Set the `VECLI_API_KEY` environment variable. In the following methods, replace `YOUR_VECLI_API_KEY` with the API key you obtained from Volcengine Ark Platform:
      - You can temporarily set the environment variable in your current shell session using the following command:
        ```bash
        export VECLI_API_KEY="YOUR_VECLI_API_KEY"
        ```
      - For repeated use, you can add the environment variable to your [.env file](#persisting-environment-variables-with-env-files).

      - Alternatively you can export the API key from your shell's configuration file (like `~/.bashrc`, `~/.zshrc`, or `~/.profile`). For example, the following command adds the environment variable to a `~/.bashrc` file:

        ```bash
        echo 'export VECLI_API_KEY="YOUR_VE_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: Be advised that when you export your API key inside your shell configuration file, any other process executed from the shell can read it.



