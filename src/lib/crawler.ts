// Sports Organization Crawler Service
// Collects notifications from multiple sources (RSS, APIs, Social Media)

export interface CrawledNotification {
  id: string;
  source: "rss" | "api" | "twitter" | "instagram" | "email";
  organizationName: string;
  title: string;
  description: string;
  content: string;
  type: "trial" | "event" | "announcement" | "update" | "news";
  url?: string;
  imageUrl?: string;
  timestamp: Date;
  category?: string;
  priority: "high" | "medium" | "low";
  verified: boolean;
}

export interface CrawlerConfig {
  sources: {
    rss: boolean;
    twitter: boolean;
    instagram: boolean;
    email: boolean;
    officialApis: boolean;
  };
  interval: 5 | 15 | 30 | 60; // minutes
  maxNotificationsPerRun: number;
  autoNotify: boolean;
}

// Sports Organizations Database
const SPORTS_ORGANIZATIONS = [
  // Cricket
  { id: "bcci", name: "BCCI", sport: "Cricket", country: "India", rssUrl: "https://www.bcci.tv/feeds", twitterHandle: "@BCCI", instagramHandle: "bcci" },
  { id: "ipl", name: "IPL", sport: "Cricket", country: "India", rssUrl: "https://www.iplt20.com/feeds", twitterHandle: "@IPL", instagramHandle: "ipl" },
  { id: "ranji", name: "Ranji Trophy", sport: "Cricket", country: "India", twitterHandle: "@RanjiTrophy", instagramHandle: "ranjitrophy" },

  // Football
  { id: "isl", name: "Indian Super League", sport: "Football", country: "India", rssUrl: "https://www.isl.org.in/feeds", twitterHandle: "@IndSuperLeague", instagramHandle: "indiansuperleague" },
  { id: "aiff", name: "AIFF", sport: "Football", country: "India", twitterHandle: "@aiff_football", instagramHandle: "aiff_football" },
  { id: "ifoot", name: "I-League", sport: "Football", country: "India", twitterHandle: "@ILeagueOfficial", instagramHandle: "ileagueofficial" },

  // Badminton
  { id: "bai", name: "Badminton Association of India", sport: "Badminton", country: "India", twitterHandle: "@BadmintonAssoc", instagramHandle: "bamindia" },

  // Athletics
  { id: "afi", name: "Athletics Federation of India", sport: "Athletics", country: "India", twitterHandle: "@afiindia", instagramHandle: "afiindia" },

  // Hockey
  { id: "hi", name: "Hockey India", sport: "Hockey", country: "India", rssUrl: "https://www.hockeyindia.org/feeds", twitterHandle: "@TheHockeyIndia", instagramHandle: "thehockeyindia" },

  // Tennis
  { id: "aita", name: "AITA", sport: "Tennis", country: "India", twitterHandle: "@aita_tennis", instagramHandle: "aita_tennis" },
];

// RSS Feed Parser
export async function parseRSSFeed(url: string, organizationName: string): Promise<CrawledNotification[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    const notifications: CrawledNotification[] = [];
    
    // Basic XML parsing for RSS feeds
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const descriptionMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      if (titleMatch) {
        const title = titleMatch[1].replace(/<[^>]*>/g, "");
        const description = descriptionMatch ? descriptionMatch[1].replace(/<[^>]*>/g, "") : "";
        const link = linkMatch ? linkMatch[1] : "";
        
        // Determine notification type
        const type = determineNotificationType(title, description);
        const priority = determinePriority(title, description);
        
        notifications.push({
          id: `rss-${Date.now()}-${Math.random()}`,
          source: "rss",
          organizationName,
          title,
          description,
          content: description,
          type,
          url: link,
          timestamp: pubDateMatch ? new Date(pubDateMatch[1]) : new Date(),
          priority,
          verified: true,
        });
      }
    }
    
    return notifications;
  } catch (error) {
    console.error(`Error parsing RSS feed for ${organizationName}:`, error);
    return [];
  }
}

// Twitter API Integration (requires Twitter API v2)
export async function fetchTwitterNotifications(handle: string, organizationName: string): Promise<CrawledNotification[]> {
  try {
    // This requires TWITTER_BEARER_TOKEN env variable
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.warn("Twitter API not configured. Skipping Twitter notifications.");
      return [];
    }
    
    const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=from:${handle}&max_results=100&tweet.fields=created_at,public_metrics`;
    
    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    
    const data = await response.json();
    const notifications: CrawledNotification[] = [];
    
    if (data.data) {
      for (const tweet of data.data) {
        const type = determineNotificationType(tweet.text, "");
        const priority = determinePriority(tweet.text, "");
        
        notifications.push({
          id: `twitter-${tweet.id}`,
          source: "twitter",
          organizationName,
          title: tweet.text.substring(0, 100),
          description: tweet.text,
          content: tweet.text,
          type,
          url: `https://twitter.com/${handle}/status/${tweet.id}`,
          timestamp: new Date(tweet.created_at),
          priority,
          verified: true,
        });
      }
    }
    
    return notifications;
  } catch (error) {
    console.error(`Error fetching Twitter notifications for ${handle}:`, error);
    return [];
  }
}

// Instagram API Integration (requires Instagram Business Account)
export async function fetchInstagramNotifications(handle: string, organizationName: string): Promise<CrawledNotification[]> {
  try {
    // This requires INSTAGRAM_ACCESS_TOKEN env variable
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn("Instagram API not configured. Skipping Instagram notifications.");
      return [];
    }
    
    // Instagram Graph API endpoint
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,timestamp,media_url,permalink&access_token=${accessToken}`
    );
    
    const data = await response.json();
    const notifications: CrawledNotification[] = [];
    
    if (data.data) {
      for (const post of data.data) {
        if (post.caption) {
          const type = determineNotificationType(post.caption, "");
          const priority = determinePriority(post.caption, "");
          
          notifications.push({
            id: `instagram-${post.id}`,
            source: "instagram",
            organizationName,
            title: post.caption.substring(0, 100),
            description: post.caption,
            content: post.caption,
            type,
            url: post.permalink,
            imageUrl: post.media_url,
            timestamp: new Date(post.timestamp),
            priority,
            verified: true,
          });
        }
      }
    }
    
    return notifications;
  } catch (error) {
    console.error(`Error fetching Instagram notifications for ${handle}:`, error);
    return [];
  }
}

// Official Sports APIs
export async function fetchOfficialApiNotifications(organizationId: string, organizationName: string): Promise<CrawledNotification[]> {
  try {
    const notifications: CrawledNotification[] = [];
    
    // Mock API calls - replace with actual endpoints
    const apiEndpoint = getApiEndpointForOrganization(organizationId);
    
    if (!apiEndpoint) {
      return [];
    }
    
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    
    // Process API response based on organization type
    if (data.notifications || data.events || data.announcements) {
      const items = data.notifications || data.events || data.announcements;
      
      for (const item of items) {
        const type = determineNotificationType(item.title || item.name, item.description || "");
        const priority = determinePriority(item.title || item.name, item.description || "");
        
        notifications.push({
          id: `api-${organizationId}-${item.id}`,
          source: "api",
          organizationName,
          title: item.title || item.name || "Update",
          description: item.description || item.details || "",
          content: item.description || item.details || "",
          type,
          url: item.url || item.link,
          timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
          priority,
          verified: true,
        });
      }
    }
    
    return notifications;
  } catch (error) {
    console.error(`Error fetching API notifications for ${organizationName}:`, error);
    return [];
  }
}

// Helper function to determine notification type
function determineNotificationType(title: string, description: string): "trial" | "event" | "announcement" | "update" | "news" {
  const content = (title + " " + description).toLowerCase();
  
  if (content.includes("trial") || content.includes("selection") || content.includes("tryout")) {
    return "trial";
  }
  if (content.includes("event") || content.includes("tournament") || content.includes("match") || content.includes("league")) {
    return "event";
  }
  if (content.includes("announce")) {
    return "announcement";
  }
  if (content.includes("update") || content.includes("change")) {
    return "update";
  }
  return "news";
}

// Helper function to determine priority
function determinePriority(title: string, description: string): "high" | "medium" | "low" {
  const content = (title + " " + description).toLowerCase();
  
  if (
    content.includes("urgent") ||
    content.includes("emergency") ||
    content.includes("breaking") ||
    content.includes("final") ||
    content.includes("selection") ||
    content.includes("result")
  ) {
    return "high";
  }
  
  if (content.includes("update") || content.includes("reminder")) {
    return "medium";
  }
  
  return "low";
}

// Get API endpoint for organization
function getApiEndpointForOrganization(organizationId: string): string | null {
  const endpoints: Record<string, string> = {
    bcci: "https://api.bcci.tv/notifications",
    ipl: "https://api.iplt20.com/v1/notifications",
    isl: "https://api.isl.org.in/v2/notifications",
    aiff: "https://api.aiff.org.in/notifications",
    hi: "https://api.hockeyindia.org/notifications",
  };
  
  return endpoints[organizationId] || null;
}

// Main Crawler Function
export async function runCrawler(config: CrawlerConfig = {
  sources: {
    rss: true,
    twitter: true,
    instagram: true,
    email: false,
    officialApis: true,
  },
  interval: 5,
  maxNotificationsPerRun: 50,
  autoNotify: true,
}): Promise<CrawledNotification[]> {
  const allNotifications: CrawledNotification[] = [];
  
  console.log(`🚀 Starting crawler run at ${new Date().toISOString()}`);
  
  for (const org of SPORTS_ORGANIZATIONS) {
    // RSS Feeds
    if (config.sources.rss && org.rssUrl) {
      const rssNotifs = await parseRSSFeed(org.rssUrl, org.name);
      allNotifications.push(...rssNotifs);
    }
    
    // Twitter
    if (config.sources.twitter && org.twitterHandle) {
      const twitterNotifs = await fetchTwitterNotifications(org.twitterHandle, org.name);
      allNotifications.push(...twitterNotifs);
    }
    
    // Instagram
    if (config.sources.instagram && org.instagramHandle) {
      const instagramNotifs = await fetchInstagramNotifications(org.instagramHandle, org.name);
      allNotifications.push(...instagramNotifs);
    }
    
    // Official APIs
    if (config.sources.officialApis) {
      const apiNotifs = await fetchOfficialApiNotifications(org.id, org.name);
      allNotifications.push(...apiNotifs);
    }
  }
  
  // Sort by timestamp (newest first)
  allNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Limit results
  const limitedNotifications = allNotifications.slice(0, config.maxNotificationsPerRun);
  
  console.log(`✅ Crawler completed. Found ${limitedNotifications.length} notifications`);
  
  return limitedNotifications;
}

// Scheduled crawler runner
export function startCrawlerSchedule(interval: number = 5) {
  console.log(`⏰ Starting crawler schedule: every ${interval} minutes`);
  
  // Run immediately
  runCrawler();
  
  // Then run on interval
  setInterval(() => {
    runCrawler().catch((error) => {
      console.error("Crawler error:", error);
    });
  }, interval * 60 * 1000);
}
