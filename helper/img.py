import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse
import argparse
import time
from collections import deque

class UniqueImageCrawler:
    def __init__(self, start_url, max_depth=2, max_pages=10, max_images=20, same_domain_only=True):
        """
        Initialize the crawler for unique image URLs.
        """
        self.start_url = start_url
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.max_images = max_images
        self.same_domain_only = same_domain_only
        
        # Extract the base domain for domain filtering
        parsed_url = urlparse(start_url)
        self.base_domain = parsed_url.netloc
        
        # Track visited pages and found images
        self.visited_urls = set()
        self.image_urls = set()  # Using a set for automatic deduplication
        
        # User agent to mimic a browser
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def is_valid_image_url(self, url):
        """Check if the URL points to a common web image format."""
        # Check if URL has an image extension
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        parsed_url = urlparse(url)
        path = parsed_url.path.lower()
        
        return any(path.endswith(ext) for ext in valid_extensions)
    
    def extract_images_from_page(self, url):
        """Extract image URLs from a single page."""
        try:
            # Send request to the URL
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all image tags
            img_tags = soup.find_all('img')
            
            # Extract image URLs
            page_image_urls = set()
            
            # First pass: check explicit image tags
            for img in img_tags:
                # Try different attributes where image URLs might be stored
                for attr in ['src', 'data-src', 'data-original', 'data-lazy-src']:
                    img_url = img.get(attr)
                    if img_url:
                        # Make relative URLs absolute
                        img_url = urljoin(url, img_url)
                        if self.is_valid_image_url(img_url):
                            page_image_urls.add(img_url)
                        break
                
                # Check srcset attribute for responsive images
                srcset = img.get('srcset')
                if srcset:
                    # Get all images from srcset
                    srcset_urls = re.findall(r'(https?://[^\s]+)', srcset)
                    for srcset_url in srcset_urls:
                        # Clean up URL if it contains size descriptors
                        clean_url = re.sub(r'\s+\d+w', '', srcset_url).strip()
                        if self.is_valid_image_url(clean_url):
                            page_image_urls.add(clean_url)
            
            # Second pass: check background images in style attributes
            elements_with_style = soup.select('[style*="background"]')
            for element in elements_with_style:
                style = element.get('style', '')
                background_urls = re.findall(r'url\([\'"]?(.*?)[\'"]?\)', style)
                for bg_url in background_urls:
                    bg_url = urljoin(url, bg_url)
                    if self.is_valid_image_url(bg_url):
                        page_image_urls.add(bg_url)
            
            # Third pass: look for links to images
            a_tags = soup.find_all('a')
            for a in a_tags:
                href = a.get('href')
                if href and self.is_valid_image_url(href):
                    page_image_urls.add(urljoin(url, href))
            
            # If no images found, try a more generic approach to find any images
            if not page_image_urls:
                # Find all URLs in the page that might be images
                all_urls = re.findall(r'(https?://[^\s\'"]+)', response.text)
                for potential_url in all_urls:
                    if self.is_valid_image_url(potential_url):
                        page_image_urls.add(potential_url)
            
            # Extract links for further crawling
            links = []
            if len(self.visited_urls) < self.max_pages:
                for a in soup.find_all('a', href=True):
                    href = a.get('href')
                    if href and not href.startswith('#') and not href.startswith('javascript:'):
                        absolute_url = urljoin(url, href)
                        # Filter to same domain if needed
                        if not self.same_domain_only or urlparse(absolute_url).netloc == self.base_domain:
                            links.append(absolute_url)
            
            return page_image_urls, links
            
        except Exception as e:
            print(f"Error extracting from {url}: {e}")
            return set(), []
    
    def crawl(self):
        """Crawl the website to find unique image URLs."""
        # BFS queue with (url, depth) tuples
        queue = deque([(self.start_url, 0)])
        
        while queue and len(self.visited_urls) < self.max_pages and len(self.image_urls) < self.max_images:
            current_url, current_depth = queue.popleft()
            
            # Skip if already visited or beyond max depth
            if current_url in self.visited_urls or current_depth > self.max_depth:
                continue
            
            print(f"Visiting page {len(self.visited_urls) + 1}/{self.max_pages}: {current_url}")
            self.visited_urls.add(current_url)
            
            # Get images and links from the page
            page_images, links = self.extract_images_from_page(current_url)
            
            # Add new images to our collection
            initial_count = len(self.image_urls)
            self.image_urls.update(page_images)
            new_images = len(self.image_urls) - initial_count
            
            print(f"  Found {len(page_images)} images ({new_images} new), total unique: {len(self.image_urls)}")
            
            # Check if we've reached our image quota
            if len(self.image_urls) >= self.max_images:
                break
            
            # Add new links to the queue if we're not at max depth
            if current_depth < self.max_depth:
                for link in links:
                    if link not in self.visited_urls:
                        queue.append((link, current_depth + 1))
            
            # Be nice to the server
            time.sleep(1)
        
        # Convert set to list and limit to max images
        return list(self.image_urls)[:self.max_images]


def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Crawl a website to extract unique image URLs')
    parser.add_argument('url', help='The URL to start crawling from')
    parser.add_argument('--output', '-o', help='Output file to write image URLs to', default='image_urls.txt')
    parser.add_argument('--count', '-c', type=int, help='Maximum number of images to extract', default=20)
    parser.add_argument('--depth', '-d', type=int, help='Maximum link depth to crawl', default=2)
    parser.add_argument('--pages', '-p', type=int, help='Maximum number of pages to visit', default=10)
    parser.add_argument('--all-domains', '-a', action='store_true', help='Follow links to external domains')
    
    args = parser.parse_args()
    
    print(f"Starting image crawler at {args.url}")
    print(f"Max depth: {args.depth}, Max pages: {args.pages}, Max images: {args.count}")
    
    crawler = UniqueImageCrawler(
        args.url,
        max_depth=args.depth,
        max_pages=args.pages,
        max_images=args.count,
        same_domain_only=not args.all_domains
    )
    
    image_urls = crawler.crawl()
    
    if not image_urls:
        print("No suitable images found.")
        return
    
    # Write to file
    with open(args.output, 'w') as f:
        for url in image_urls:
            f.write(f"{url}\n")
    
    print(f"\nFound {len(image_urls)} unique images. URLs saved to {args.output}")
    print(f"Visited {len(crawler.visited_urls)} pages.")
    
    # Print the first few URLs to console
    print("\nFirst few image URLs:")
    for url in image_urls[:5]:
        print(url)

if __name__ == "__main__":
    main()