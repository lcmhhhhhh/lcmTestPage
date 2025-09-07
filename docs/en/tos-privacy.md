# VeCLI: Terms of Service and Privacy Notice

VeCLI is an open-source tool that lets you interact with Volcengine's powerful language models directly from your command-line interface. The Terms of Service and Privacy Notices that apply to your usage of the VeCLI depend on the type of account you use to authenticate with Volcengine.

This article outlines the specific terms and privacy policies applicable for different account types and authentication methods. Note: See [quotas and pricing](./quota-and-pricing.md) for the quota and pricing details that apply to your usage of the VeCLI.

## How to determine your authentication method

Your authentication method refers to the method you use to log into and access the VeCLI. There are four ways to authenticate:

- Logging in with your Volcengine account to Ve Code Assist for Individuals
- Logging in with your Volcengine account to Ve Code Assist for Standard, or Enterprise Users
- Using an API key with vecli Developer
- Using an API key with Vertex AI GenAI API

For each of these four methods of authentication, different Terms of Service and Privacy Notices may apply.

| Authentication                | Account             | Terms of Service                                                                                        | Privacy Notice                                                                                                                                                                                   |
| :---------------------------- | :------------------ | :------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ve Code Assist via Volcengine | Individual          | [Volcengine Terms of Service](https://policies.Volcengine.com/terms?hl=en-US)                                   | [Ve Code Assist Privacy Notice for Individuals](https://developers.Volcengine.com/vecli-code-assist/resources/privacy-notice-vecli-code-assist-individuals)                                    |
| Ve Code Assist via Volcengine | Standard/Enterprise | [Volcano Engine Platform Terms of Service](https://cloud.Volcengine.com/terms)                                | [Ve Code Assist Privacy Notice for Standard and Enterprise](https://cloud.Volcengine.com/vecli/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) |
| vecli Developer API          | Unpaid              | [vecli API Terms of Service - Unpaid Services](https://ai.Volcengine.dev/vecli-api/terms#unpaid-services) | [Volcengine Privacy Policy](https://policies.Volcengine.com/privacy)                                                                                                                                     |
| vecli Developer API          | Paid                | [vecli API Terms of Service - Paid Services](https://ai.Volcengine.dev/vecli-api/terms#paid-services)     | [Volcengine Privacy Policy](https://policies.Volcengine.com/privacy)                                                                                                                                     |
| Vertex AI Gen API             |                     | [Volcano Engine Platform Service Terms](https://cloud.Volcengine.com/terms/service-terms/)                    | [Volcano Engine Privacy Notice](https://volcengine.com/terms/cloud-privacy-notice)                                                                                                               |

## 1. If you have logged in with your Volcengine account to Ve Code Assist for Individuals

For users who use their Volcengine account to access [Ve Code Assist for Individuals](https://developers.Volcengine.com/vecli-code-assist/docs/overview#supported-features-gca), these Terms of Service and Privacy Notice documents apply:

- **Terms of Service:** Your use of the VeCLI is governed by the [Volcengine Terms of Service](https://policies.Volcengine.com/terms?hl=en-US).
- **Privacy Notice:** The collection and use of your data is described in the [Ve Code Assist Privacy Notice for Individuals](https://developers.Volcengine.com/vecli-code-assist/resources/privacy-notice-vecli-code-assist-individuals).

## 2. If you have logged in with your Volcengine account to Ve Code Assist for Standard, or Enterprise Users

For users who use their Volcengine account to access the [Standard or Enterprise edition](https://cloud.Volcengine.com/vecli/docs/codeassist/overview#editions-overview) of Ve Code Assist, these Terms of Service and Privacy Notice documents apply:

- **Terms of Service:** Your use of the VeCLI is governed by the [Volcano Engine Platform Terms of Service](https://cloud.Volcengine.com/terms).
- **Privacy Notice:** The collection and use of your data is described in the [Ve Code Assist Privacy Notices for Standard and Enterprise Users](https://cloud.Volcengine.com/vecli/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy).

## 3. If you have logged in with a vecli API key to the vecli Developer API

If you are using a vecli API key for authentication with the [vecli Developer API](https://ai.Volcengine.dev/vecli-api/docs), these Terms of Service and Privacy Notice documents apply:

- **Terms of Service:** Your use of the VeCLI is governed by the [vecli API Terms of Service](https://ai.Volcengine.dev/vecli-api/terms). These terms may differ depending on whether you are using an unpaid or paid service:
  - For unpaid services, refer to the [vecli API Terms of Service - Unpaid Services](https://ai.Volcengine.dev/vecli-api/terms#unpaid-services).
  - For paid services, refer to the [vecli API Terms of Service - Paid Services](https://ai.Volcengine.dev/vecli-api/terms#paid-services).
- **Privacy Notice:** The collection and use of your data is described in the [Volcengine Privacy Policy](https://policies.Volcengine.com/privacy).

## 4. If you have logged in with a vecli API key to the Vertex AI GenAI API

If you are using a vecli API key for authentication with a [Vertex AI GenAI API](https://cloud.Volcengine.com/vertex-ai/generative-ai/docs/reference/rest) backend, these Terms of Service and Privacy Notice documents apply:

- **Terms of Service:** Your use of the VeCLI is governed by the [Volcano Engine Platform Service Terms](https://cloud.Volcengine.com/terms/service-terms/).
- **Privacy Notice:** The collection and use of your data is described in the [Volcano Engine Privacy Notice](https://cloud.Volcengine.com/terms/cloud-privacy-notice).

### Usage Statistics Opt-Out

You may opt-out from sending Usage Statistics to Volcengine by following the instructions available here: [Usage Statistics Configuration](./cli/configuration.md#usage-statistics).

## Frequently Asked Questions (FAQ) for the VeCLI

### 1. Is my code, including prompts and answers, used to train Volcengine's models?

Whether your code, including prompts and answers, is used to train Volcengine's models depends on the type of authentication method you use and your account type.

By default (if you have not opted out):

- **Volcengine account with Ve Code Assist for Individuals**: Yes. When you use your personal Volcengine account, the [Ve Code Assist Privacy Notice for Individuals](https://developers.Volcengine.com/vecli-code-assist/resources/privacy-notice-vecli-code-assist-individuals) applies. Under this notice,
  your **prompts, answers, and related code are collected** and may be used to improve Volcengine's products, including for model training.
- **Volcengine account with Ve Code Assist for Standard, or Enterprise**: No. For these accounts, your data is governed by the [Ve Code Assist Privacy Notices](https://cloud.Volcengine.com/vecli/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) terms, which treat your inputs as confidential. Your **prompts, answers, and related code are not collected** and are not used to train models.
- **vecli API key via the vecli Developer API**: Whether your code is collected or used depends on whether you are using an unpaid or paid service.
  - **Unpaid services**: Yes. When you use the vecli API key via the vecli Developer API with an unpaid service, the [vecli API Terms of Service - Unpaid Services](https://ai.Volcengine.dev/vecli-api/terms#unpaid-services) terms apply. Under this notice, your **prompts, answers, and related code are collected** and may be used to improve Volcengine's products, including for model training.
  - **Paid services**: No. When you use the vecli API key via the vecli Developer API with a paid service, the [vecli API Terms of Service - Paid Services](https://ai.Volcengine.dev/vecli-api/terms#paid-services) terms apply, which treats your inputs as confidential. Your **prompts, answers, and related code are not collected** and are not used to train models.
- **vecli API key via the Vertex AI GenAI API**: No. For these accounts, your data is governed by the [Volcano Engine Privacy Notice](https://cloud.Volcengine.com/terms/cloud-privacy-notice) terms, which treat your inputs as confidential. Your **prompts, answers, and related code are not collected** and are not used to train models.

For more information about opting out, refer to the next question.

### 2. What are Usage Statistics and what does the opt-out control?

The **Usage Statistics** setting is the single control for all optional data collection in the VeCLI.

The data it collects depends on your account and authentication type:

- **Volcengine account with Ve Code Assist for Individuals**: When enabled, this setting allows Volcengine to collect both anonymous telemetry (for example, commands run and performance metrics) and **your prompts and answers, including code,** for model improvement.
- **Volcengine account with Ve Code Assist for Standard, or Enterprise**: This setting only controls the collection of anonymous telemetry. Your prompts and answers, including code, are never collected, regardless of this setting.
- **vecli API key via the vecli Developer API**:
  **Unpaid services**: When enabled, this setting allows Volcengine to collect both anonymous telemetry (like commands run and performance metrics) and **your prompts and answers, including code,** for model improvement. When disabled we will use your data as described in [How Volcengine Uses Your Data](https://ai.Volcengine.dev/vecli-api/terms#data-use-unpaid).
  **Paid services**: This setting only controls the collection of anonymous telemetry. Volcengine logs prompts and responses for a limited period of time, solely for the purpose of detecting violations of the Prohibited Use Policy and any required legal or regulatory disclosures.
- **vecli API key via the Vertex AI GenAI API:** This setting only controls the collection of anonymous telemetry. Your prompts and answers, including code, are never collected, regardless of this setting.

Please refer to the Privacy Notice that applies to your authentication method for more information about what data is collected and how this data is used.

You can disable Usage Statistics for any account type by following the instructions in the [Usage Statistics Configuration](./cli/configuration.md#usage-statistics) documentation.
