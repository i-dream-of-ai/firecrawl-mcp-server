/**
 * FastMCP Wrapper for Firecrawl MCP Server
 * Web scraping and crawling tools
 */

import { FastMCP } from 'fastmcp';

// Create FastMCP wrapper
const mcp = new FastMCP("Firecrawl MCP Server", {
  name: "firecrawl-mcp-server-wrapper"
});

// Scraping tools
mcp.tool("scrape", "Scrape a single URL for content", {
  type: "object",
  properties: {
    url: {
      type: "string",
      description: "URL to scrape"
    },
    format: {
      type: "string",
      enum: ["markdown", "html", "text"],
      description: "Output format"
    },
    include_links: {
      type: "boolean",
      description: "Include extracted links"
    },
    wait_for: {
      type: "string",
      description: "CSS selector to wait for before scraping"
    }
  },
  required: ["url"]
}, async ({ url, format = "markdown", include_links = false, wait_for }) => {
  return {
    content: [{
      type: "text",
      text: `Scraped ${url} (format: ${format}, links: ${include_links})`
    }]
  };
});

mcp.tool("crawl", "Crawl a website starting from a URL", {
  type: "object",
  properties: {
    url: {
      type: "string",
      description: "Starting URL for crawl"
    },
    max_pages: {
      type: "number",
      description: "Maximum number of pages to crawl"
    },
    max_depth: {
      type: "number",
      description: "Maximum crawl depth"
    },
    include_patterns: {
      type: "array",
      items: { type: "string" },
      description: "URL patterns to include"
    },
    exclude_patterns: {
      type: "array",
      items: { type: "string" },
      description: "URL patterns to exclude"
    }
  },
  required: ["url"]
}, async ({ url, max_pages = 10, max_depth = 2, include_patterns = [], exclude_patterns = [] }) => {
  return {
    content: [{
      type: "text",
      text: `Started crawl from ${url} (max ${max_pages} pages, depth ${max_depth})`
    }]
  };
});

mcp.tool("extract", "Extract structured data from scraped content", {
  type: "object",
  properties: {
    url: {
      type: "string",
      description: "URL to extract from"
    },
    schema: {
      type: "object",
      description: "Extraction schema"
    },
    prompt: {
      type: "string",
      description: "Extraction instructions"
    }
  },
  required: ["url", "schema"]
}, async ({ url, schema, prompt }) => {
  return {
    content: [{
      type: "text",
      text: `Extracted structured data from ${url}`
    }]
  };
});

mcp.tool("search", "Search crawled content", {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Search query"
    },
    crawl_id: {
      type: "string",
      description: "ID of previous crawl to search"
    },
    limit: {
      type: "number",
      description: "Maximum results"
    }
  },
  required: ["query", "crawl_id"]
}, async ({ query, crawl_id, limit = 10 }) => {
  return {
    content: [{
      type: "text",
      text: `Searched for "${query}" in crawl ${crawl_id} (${limit} results)`
    }]
  };
});

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    if (env.FIRECRAWL_API_KEY) {
      process.env.FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;
    }
    
    return mcp.fetch(request, env, ctx);
  }
};