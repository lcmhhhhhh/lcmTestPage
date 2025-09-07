# VeCLI: Quotas and Pricing

VeCLI offers a generous free tier that covers the use cases for many individual developers. For enterprise / professional usage, or if you need higher limits, there are multiple possible avenues depending on what type of account you use to authenticate.


Note: published prices are list price; additional negotiated commercial discounting may apply.

This article outlines the specific quotas and pricing applicable to the VeCLI when using different authentication methods.

Generally, there are three categories to choose from:

- Free Usage: Ideal for experimentation and light use.
- Paid Tier (fixed price): For individual developers or enterprises who need more generous daily quotas and predictable costs.
- Pay-As-You-Go: The most flexible option for professional use, long-running tasks, or when you need full control over your usage.

## Free Usage

Your journey begins with a generous free tier, perfect for experimentation and light use.

Your free usage limits depend on your authorization type.

### Log in with Volcengine (Ve Code Assist for Individuals)

For users who authenticate by using their Volcengine account to access Ve Code Assist for individuals. This includes:

- 1000 model requests / user / day
- 60 model requests / user / minute

Learn more at [Ve Code Assist for Individuals Limits](https://developers.volcengine.com/vecli-code-assist/resources/quotas#quotas-for-agent-mode-vecli).

### Log in with Vecli API Key (Unpaid)

If you are using a Vecli API key, you can also benefit from a free tier. This includes:

- 250 model requests / user / day
- 10 model requests / user / minute
- Model requests to Flash model only.

Learn more at [Vecli API Rate Limits](https://ai.volcengine.dev/vecli/docs/rate-limits).


## Paid tier: Higher limits for a fixed cost

If you use up your initial number of requests, you can upgrade your plan to continue to benefit from VeCLI by using the [Standard or Enterprise editions of Ve Code Assist](https://volcengine.com/products/vecli/pricing) by signing up

- Standard:
  - 1500 model requests / user / day
  - 120 model requests / user / minute
- Enterprise:
  - 2000 model requests / user / day
  - 120 model requests / user / minute
- Model requests will be made across the Vecli model family as determined by VeCLI.




## Understanding your usage

A summary of model usage is available through the `/stats` command and presented on exit at the end of a session.
