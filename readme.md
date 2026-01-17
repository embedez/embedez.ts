# @embedez/downloader

@embedez/downloader is a TypeScript wrapper for the EmbedEZ API, designed to simplify the integration of rich media previews into your applications. The EmbedEZ API documentation can be found [here](https://embedez.com/docs).

## Supported Platforms

@embedez/downloader supports retrieving posts and media from the following platforms:
- TikTok
- Instagram
- Twitter
- Reddit
- YouTube
- Facebook
- Bilibili
- iFunny
- Saved posts

## Installation

To install @embedez/downloader, you can use npm:

```bash
npm install @embedez/downloader
```

## Example Usage

### Setting Up

First, import EmbedEZ and configure it with your API key and API endpoint URL:

```typescript
import { EmbedEZ } from "@embedez/downloader";

EmbedEZ.setConfig({
  apiKey: process.env.EZ_APIKEY,
  url: "https://embedez.com", // OPTIONAL: Defaults to https://embedez.com
});
```

### Using EmbedEZ Functions

Here's an example of how to use @embedez/downloader to check for social media content, retrieve a search key, and get a media preview:

```typescript
import { EmbedEZ } from "@embedez/downloader";

async function test(message: string) {
  // Check if the message contains social media content
  const isValid = EmbedEZ.utils.checkForSocialMediaContent(message);
  console.log("isValid:", isValid);

  // Get the search key from the message
  const searchKeyResponse = await EmbedEZ.getSearchKey(message);
  console.log("searchKey:", searchKeyResponse);

  if (searchKeyResponse.success) {
    // Get the media preview using the retrieved search key
    const preview = await EmbedEZ.getPreview(searchKeyResponse.data.key);
    console.log("preview:", preview);
  }
}

// Example usage
const message = "hello yall look at this tiktok video https://www.tiktok.com/@truth.filmz/video/7355123993017421089";
test(message);
```

In this example:

- **setConfig**: Configures EmbedEZ with your API key and endpoint URL.
- **checkForSocialMediaContent**: Checks if the provided message contains social media content.
- **getSearchKey**: Retrieves a search key based on the social media content found in the message.
- **getPreview**: Fetches a media preview using the search key obtained.

Make sure to replace `process.env.EZ_APIKEY` with your actual API key.

---

Please note that this is a simplified example and you may need to adjust the code to fit your specific use case. Data will be returned with no api key yet the responses will be limited.