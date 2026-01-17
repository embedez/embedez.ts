"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const __1 = require("..");
class Utils {
    static fetchApiSites() {
        if (this.fetchPromise)
            return this.fetchPromise;
        this.fetchPromise = fetch(__1.EmbedEZ.config.url + '/api')
            .then(response => response.json())
            .then(data => {
            console.info(`[EmbedEZ.ts Fetching API sites]`, data.data);
            if (!data.success)
                console.error(`[EmbedEZ.ts Failed to fetch API sites]`, data.message);
            const sfwSites = data.data.sfw || ['TikTok', 'Instagram', 'Twitter', 'Reddit', 'iFunny', 'YouTube', 'Snapchat', 'Imgur', 'Facebook', 'Bilibili', 'Threads', 'Weibo'];
            const nsfwSites = data.data.nsfw || ['Danbooru', 'Derpibooru', 'e621', 'e926', 'Gelbooru', 'Realbooru', 'Rule34xxx', 'Safebooru', 'Hypnohub', 'Konachan', 'Yandere', 'Paheal', 'Xbooru', 'TBIB'];
            const allSites = [...sfwSites, ...nsfwSites];
            this.apiSites = allSites.map((site) => {
                let processedSite = site.toLowerCase();
                if (processedSite === 'youtube')
                    processedSite = 'youtu\\w*';
                if (processedSite === 'twitter')
                    processedSite = '(twitter|x\\.com)';
                if (processedSite === 'rule34xxx')
                    processedSite = 'rule34';
                return processedSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            });
            console.info(`[EmbedEZ.ts Fetched API sites]`, this.apiSites);
        })
            .catch(error => {
            console.warn('[EmbedEZ.ts Failed to fetch API sites, using hardcoded fallback:', error);
            this.apiSites = [];
        });
        return this.fetchPromise;
    }
    checkForSocialMediaContent(input) {
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
    extractIdFromUrl(pattern, url) {
        const paramNames = pattern.match(/:[a-zA-Z0-9_]+/g) || [];
        const regexPattern = pattern.replace(/:[a-zA-Z0-9_]+/g, "([.a-zA-Z0-9_-]+)");
        const regex = new RegExp(regexPattern);
        const match = url.match(regex);
        if (match) {
            const extractedValues = match.slice(1);
            if (extractedValues.length !== paramNames.length) {
                throw new Error("Mismatch in the number of extracted values and placeholders.");
            }
            const result = {};
            paramNames.forEach((paramName, index) => {
                const paramNameKey = paramName.slice(1);
                const extractedValue = extractedValues[index];
                result[paramNameKey] = extractedValue;
            });
            return result;
        }
        return {};
    }
    extractKeysFromUrlTemplate(urlTemplate) {
        const keyRegex = /{([^{}]+)}/g;
        const matches = urlTemplate.match(keyRegex);
        const result = matches ? matches.map((match) => match.slice(1, -1)) : [];
        return result;
    }
    replaceKeysWithValues(urlTemplate, extractedIds) {
        return urlTemplate.replace(/\{([^{}]+)\}/g, (match, key) => extractedIds[key] || match);
    }
}
exports.Utils = Utils;
Utils.apiSites = null;
Utils.fetchPromise = null;
Utils.hardcodedSites = [
    'tiktok', 'instagram', 'twitter', 'x\\.com', 'snapchat', 'reddit', 'ifunny',
    'youtu\\w*', 'imgur', 'bsky', 'facebook', 'threads', 'bilibili', 'rule34',
    'weibo', 'bluesky', 'pinterest'
];
//# sourceMappingURL=index.js.map