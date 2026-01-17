import { EmbedEZ } from "..";

export type ExtractParams<T extends string> =
  T extends `${infer Prefix}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${infer Prefix}:${infer Param}`
    ? { [K in Param]: string }
    : {};

export class Utils {
  private static apiSites: string[] | null = null;
  private static fetchPromise: Promise<void> | null = null;
  private static readonly hardcodedSites = [
    'tiktok', 'instagram', 'twitter', 'x\\.com', 'snapchat', 'reddit', 'ifunny', 
    'youtu\\w*', 'imgur', 'bsky', 'facebook', 'threads', 'bilibili', 'rule34', 
    'weibo', 'bluesky', 'pinterest'
  ];

  private static fetchApiSites(): Promise<void> {
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = fetch(EmbedEZ.config.url + '/api')
      .then(response => response.json())
      .then(data => {
        console.info(`[@embedez/downloader Fetching API sites]`, data.data);
        if (!data.success) console.error(`[@embedez/downloader Failed to fetch API sites]`, data.message);
        const sfwSites = data.data.sfw || ['TikTok', 'Instagram', 'Twitter', 'Reddit', 'iFunny', 'YouTube', 'Snapchat', 'Imgur', 'Facebook', 'Bilibili', 'Threads', 'Weibo'];
        const nsfwSites = data.data.nsfw || ['Danbooru', 'Derpibooru', 'e621', 'e926', 'Gelbooru', 'Realbooru', 'Rule34xxx', 'Safebooru', 'Hypnohub', 'Konachan', 'Yandere', 'Paheal', 'Xbooru', 'TBIB'];
        const allSites = [...sfwSites, ...nsfwSites];
        
        this.apiSites = allSites.map((site: string) => {
          let processedSite = site.toLowerCase();
          if (processedSite === 'youtube') processedSite = 'youtu\\w*';
          if (processedSite === 'twitter') processedSite = '(twitter|x\\.com)';
          if (processedSite === 'rule34xxx') processedSite = 'rule34';
          return processedSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        });

        console.info(`[@embedez/downloader Fetched API sites]`, this.apiSites);
      })
      .catch(error => {
        console.warn('[@embedez/downloader Failed to fetch API sites, using hardcoded fallback:', error);
        this.apiSites = [];
      });

    return this.fetchPromise;
  }

  checkForSocialMediaContent(input: string): boolean {
    if (Utils.apiSites === null) {
      Utils.fetchApiSites();
    }

    const apiSites = Utils.apiSites || [];
    const allSites = [...Utils.hardcodedSites, ...apiSites];
    const uniqueSites = [...new Set(allSites)];
    
    const regex = new RegExp(`(${uniqueSites.join('|')})`, 'gi');
    const check = input.match(regex);
    return check !== null;
  }

  extractIdFromUrl<Pattern extends string>(
    pattern: Pattern,
    url: string
  ): ExtractParams<Pattern> | {} {
    const paramNames = pattern.match(/:[a-zA-Z0-9_]+/g) || [];
    const regexPattern = pattern.replace(
      /:[a-zA-Z0-9_]+/g,
      "([.a-zA-Z0-9_-]+)"
    );

    const regex = new RegExp(regexPattern);
    const match = url.match(regex);

    if (match) {
      const extractedValues = match.slice(1);

      if (extractedValues.length !== paramNames.length) {
        throw new Error(
          "Mismatch in the number of extracted values and placeholders."
        );
      }

      const result = {} as any;
      paramNames.forEach((paramName: string, index: number) => {
        const paramNameKey = paramName.slice(1) as keyof ExtractParams<Pattern>;
        const extractedValue = extractedValues[index];
        result[paramNameKey] = extractedValue;
      });

      return result as ExtractParams<Pattern>;
    }

    return {};
  }

  extractKeysFromUrlTemplate(urlTemplate: string): string[] {
    const keyRegex = /{([^{}]+)}/g;
    const matches = urlTemplate.match(keyRegex);
    const result = matches ? matches.map((match) => match.slice(1, -1)) : [];
    return result;
  }

  replaceKeysWithValues(
    urlTemplate: string,
    extractedIds: Record<string, string>
  ): string {
    return urlTemplate.replace(
      /\{([^{}]+)\}/g,
      (match, key) => extractedIds[key] || match
    );
  }
}
