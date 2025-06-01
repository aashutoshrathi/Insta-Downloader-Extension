/* eslint no-undef: "error" */
/* eslint-env browser */

function escapeHTML (str) {
  return str.replace(/[&"'<>]/g, m => escapeHTML.replacements[m])
}
escapeHTML.replacements = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;'
}

const link = document.createElement('link')
link.href = chrome.extension.getURL('insta-down-css.css')
link.type = 'text/css'
link.rel = 'stylesheet'
document.getElementsByTagName('head')[0].appendChild(link)
// Remove unused 'i' and 'dlink' after refactoring
// let i = 0;
// let dlink;
// let downloadAlltrigger = true; // This was related to handleDownloadAll, removing.

console.log(
  '%c Hello Developer!\n Star us here: https://github.com/aashutoshrathi/Insta-Downloader-Extension',
  'background: #222; color: #bada55'
)

// const getHTML = function gethtml (url, callback) {
//   // Feature detection
//   if (!window.XMLHttpRequest) return
//
//   // Create new request
//   const xhr = new XMLHttpRequest()
//
//   // Setup callback
//   xhr.onload = function onload () {
//     if (callback && typeof callback === 'function') {
//       callback(this.responseXML)
//     }
//   }
//
//   // Get the HTML
//   xhr.open('GET', url)
//   xhr.responseType = 'document'
//   xhr.send()
// }

function injectButtons () {
  // General approach:
  // 1. Determine page type (Explore, Profile (self/other), Feed/Post Page)
  // 2. If Profile Page: Add "Download DP" button. Old post iteration logic in profile pages is removed.
  // 3. If Explore Page: Old logic is mostly removed/commented, relying on article processor for modals.
  // 4. Always run the generic `article` processor for posts in feed or modals.
  // 5. Handle "Saved" page specific "Download All" if on that page.

  console.log('%c InstaDownloader: Injecting buttons...', 'background: #222; color: #bada55');

  // --- Robust Page Type Detection ---
  let isExplorePage = false;
  let isOwnProfilePage = false;
  let isOtherProfilePage = false;
  let isProfilePage = false; // Generic flag for any profile page
  let isSavedPage = false;

  // Check for Explore: URL path often /explore/
  if (window.location.pathname.startsWith('/explore/')) {
    isExplorePage = true;
    console.log('%c InstaDownloader: Explore page detected.', 'background: #222; color: #bada55');
  }

  // Check for Saved page: URL path often /username/saved/
  if (window.location.pathname.includes('/saved/')) {
    isSavedPage = true;
    console.log('%c InstaDownloader: Saved page detected.', 'background: #222; color: #bada55');
  }

  // Check for Profile pages:
  // Own profile often has "Edit Profile" or "View Archive" type buttons.
  // Other's profile has "Follow", "Message".
  // A common top-level container for profile header info.
  const profileHeader = document.querySelector('header section[role="banner"], header > div:nth-child(2)'); // More generic selectors for profile header area

  if (profileHeader && !isExplorePage && !isSavedPage) { // Ensure not on explore/saved when checking for profile
      if (profileHeader.querySelector('a[href*="edit"], button[aria-label*="options"]')) { // Checking for Edit Profile link or options button
          isOwnProfilePage = true;
          isProfilePage = true;
          console.log('%c InstaDownloader: Own profile page detected.', 'background: #222; color: #bada55');
      } else if (profileHeader.querySelector('button') ) { // Generic check if any button exists (Follow, Message etc.)
          // More specific checks for "Follow", "Message" buttons if needed, e.g. by text or SVG content
          const buttonsInHeader = profileHeader.querySelectorAll('button');
          let hasFollowOrMessage = false;
          buttonsInHeader.forEach(button => {
              const buttonText = button.textContent.toLowerCase();
              if(buttonText.includes('follow') || buttonText.includes('message')) {
                  hasFollowOrMessage = true;
              }
          });
          if(hasFollowOrMessage){
            isOtherProfilePage = true;
            isProfilePage = true;
            console.log('%c InstaDownloader: Other user\'s profile page detected.', 'background: #222; color: #bada55');
          }
      }
       // Fallback if above selectors are too specific or miss some cases
      if(!isOwnProfilePage && !isOtherProfilePage && document.querySelector('main[role="main"] header img[alt*="profile photo"]')){
          // If we see a main profile photo in a header and didn't identify as own/other, it's likely a profile page.
          // This logic might need refinement to distinguish accurately if the above fail. For now, set generic profile.
          if (!isExplorePage && !isSavedPage) { // Double check not explore/saved
            isProfilePage = true;
            console.log('%c InstaDownloader: Generic profile page detected (fallback).', 'background: #222; color: #bada55');
          }
      }
  }


  // --- Action Based on Page Type ---

  if (isExplorePage) {
    // The old logic for iterating images directly on the explore page (for i = 3; i < images.length; ...)
    // is removed. The generic 'article' processor below should handle posts opened in modals from explore.
    console.log('%c InstaDownloader: Explore page specific actions (currently minimal, relies on article processor for modals).', 'background: #222; color: #bada55');
  } else if (isProfilePage) {
    console.log('%c InstaDownloader: Profile page specific actions.', 'background: #222; color: #bada55');
    // **Download Profile Picture (DP) Functionality**
    if (!document.querySelector('.download-dp-button-container')) {
      const dpImgElement = document.querySelector('main header img[draggable="false"], main header img[alt*="profile photo"], main header img[data-testid="user-avatar"]');
      let dpUrl = null;

      if (dpImgElement) {
        if (dpImgElement.srcset) {
          const sources = dpImgElement.srcset.split(',').map(s => {
            const parts = s.trim().split(/\s+/);
            return { url: parts[0], width: parseInt(parts[1]?.replace('w', ''), 10) || 0 };
          });
          sources.sort((a, b) => b.width - a.width);
          if (sources.length > 0 && sources[0].url) {
            dpUrl = sources[0].url;
          }
        }
        if (!dpUrl) {
          dpUrl = dpImgElement.src;
        }
      }

      // Check for a potentially larger image if the initial one is small (e.g. common for profile pics)
      // This is a heuristic, actual structure might vary.
      if (dpImgElement && dpUrl && (dpImgElement.naturalWidth < 200 || dpImgElement.offsetWidth < 200)) {
          const parentContainer = dpImgElement.closest('div[role="button"], div:has(> span > img)'); // Common containers for DP
          if (parentContainer) {
              const largerImg = parentContainer.querySelector('img[width="320"], img[height="320"]'); // Look for explicitly sized larger images
              if (largerImg && largerImg.src && (largerImg.naturalWidth > dpImgElement.naturalWidth || largerImg.offsetWidth > dpImgElement.offsetWidth)) {
                  dpUrl = largerImg.src; // Prefer this if it seems larger
              }
          }
      }


      if (dpUrl) {
        const profileUsernameElement = document.querySelector('main header h2, main header h1');
        const profileUsername = profileUsernameElement ? profileUsernameElement.textContent.trim() : 'instagram_profile';
        const safeProfileUsername = profileUsername.replace(/[^a-zA-Z0-9_]/g, '_');

        const dpButtonContainer = document.createElement('div');
        dpButtonContainer.className = 'download-dp-button-container';
        dpButtonContainer.style.display = 'inline-block';
        dpButtonContainer.style.marginLeft = '10px';

        const downloadLink = document.createElement('a');
        downloadLink.href = dpUrl; // No more &dl=1
        downloadLink.download = `${safeProfileUsername}_dp.jpg`;

        const button = document.createElement('button');
        button.textContent = 'Download DP';
        button.className = 'download-dp-button instanshu-unite instanshu-sm instanshu-success';
        button.style.padding = '5px 10px';

        downloadLink.appendChild(button);
        dpButtonContainer.appendChild(downloadLink);

        // Injection point: Try to append it to the div containing profile stats or action buttons
        let injectionTarget = document.querySelector('main header section ul, main header div > h1 + div, main header div > h2 + div');
        if (!injectionTarget && profileHeader) { // Fallback to profile header itself
            injectionTarget = profileHeader.querySelector('div:last-child'); // Try to append to the last div in header
        }
        if (injectionTarget) {
            injectionTarget.appendChild(dpButtonContainer);
            console.log('%c InstaDownloader: "Download DP" button injected.', 'background: #222; color: #bada55');
        } else {
            console.log('%c InstaDownloader: Could not find injection point for DP button.', 'background: #ffcc00');
        }
      } else {
        console.log('%c InstaDownloader: DP image URL not found.', 'background: #ffcc00');
      }
    }
    // The old loops for `images[i]` within `elseProfile` and `selfProfile` are removed.
    // The generic `article` processor below will handle posts when they are opened from the profile.
    if (isOwnProfilePage && isSavedPage) {
        console.log('%c InstaDownloader: On Saved page. Individual post downloads via modals are supported.', 'background: #222; color: #bada55');
        // Old handleDownloadAll logic for a global "Download All Saved" button is removed.
    }

  } else {
    // This 'else' corresponds to not being on Explore or Profile pages.
    // This is typically the main feed or a single post page.
    // The generic 'article' processor below handles these.
    console.log('%c InstaDownloader: On Main Feed or Single Post Page.', 'background: #222; color: #bada55');
  }


// --- Refactored Article Processing ---
function processArticleElement(post) { // Renamed 'articleElement' to 'post' for consistency with internal logic
    // Skip if already processed by checking for a specific class on an injected element
    const existingButtonContainer = post.querySelector('.my-download-button-container');
    const hasCarouselButton = existingButtonContainer && existingButtonContainer.querySelector('.my-download-all-carousel-button');
    // const hasSingleButton = existingButtonContainer && existingButtonContainer.querySelector('.my-download-button'); // Not needed for this check

    if (hasCarouselButton) { // If a carousel button already exists, definitely skip.
      return;
    }
    // If a single download button exists, it might be removed/replaced by a carousel button later.
    // This function might be called again on the same article if a modal re-renders,
    // so the checks for existing buttons inside media specific logic are important.

    let mediaUrl = null;
    let mediaType = null;
    let username = 'instagram_media'; // Default username

    // Try to find username
    const userLink = post.querySelector('header a[href^="/"][href$="/"]');
    if (userLink && userLink.textContent) {
      const hrefParts = userLink.getAttribute('href').split('/').filter(part => part.length > 0);
      if (hrefParts.length === 1) {
        username = hrefParts[0];
      }
    } else {
      const headerUserText = post.querySelector('header div > div > div > a');
      if (headerUserText && headerUserText.textContent){
          username = headerUserText.textContent.trim();
      }
    }

    // Try to find video (prioritize direct src)
    const videoElement = post.querySelector('video');
    if (videoElement) {
      mediaUrl = videoElement.src;
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
          const sourceElement = videoElement.querySelector('source[src]');
          if (sourceElement) {
              mediaUrl = sourceElement.src;
          } else {
              mediaUrl = null;
          }
      }
      if(mediaUrl) mediaType = 'Video';
    }

    if (!mediaUrl) {
      const imgElement = post.querySelector('div[role="img"] img, div > div > img[alt]:not([style*="height: 16px"])');
      if (imgElement) {
          if (imgElement.srcset) {
              const sources = imgElement.srcset.split(',').map(s => {
                  const parts = s.trim().split(/\s+/);
                  const url = parts[0];
                  const width = parseInt(parts[1]?.replace('w', ''), 10) || 0;
                  const density = parseFloat(parts[1]?.replace('x', '')) || 1;
                  return { url, width, density };
              });
              sources.sort((a, b) => {
                  if (b.width !== a.width) return b.width - a.width;
                  return b.density - a.density;
              });
              if (sources.length > 0 && sources[0].url) {
                  mediaUrl = sources[0].url;
              }
          }
          if (!mediaUrl && imgElement.src && imgElement.src.startsWith('http')) {
              if (!imgElement.closest('header') || imgElement.width > 100 || imgElement.height > 100) {
                   mediaUrl = imgElement.src;
              }
          }
          if(mediaUrl) mediaType = 'Image';
      }
    }

    let isCarousel = false;
    const nextButton = post.querySelector('button[aria-label*="Next"], button[aria-label*="Chevron right"]');
    const prevButton = post.querySelector('button[aria-label*="Previous"], button[aria-label*="Chevron left"]');
    const slideGroup = post.querySelector('ul[style*="transform: translateX"] li');

    if ((nextButton && prevButton) || slideGroup) {
      isCarousel = true;
    }

    const safeUsername = username.replace(/[^a-zA-Z0-9_]/g, '_');

    if (isCarousel) {
      // console.log('%c Carousel Detected for post by: ' + username, 'background: #222; color: #bada55');
      const mediaItems = [];
      const scriptTags = post.querySelectorAll('script[type="application/ld+json"], script');
      let foundJsonData = false;
      scriptTags.forEach(scriptTag => {
          if (foundJsonData) return;
          try {
              const textContent = scriptTag.textContent.trim();
              if (textContent.startsWith('{') && textContent.endsWith('}')) {
                  const jsonData = JSON.parse(textContent);
                  let itemsArray = null;
                  if (jsonData?.graphql?.shortcode_media?.edge_sidecar_to_children?.edges) {
                      itemsArray = jsonData.graphql.shortcode_media.edge_sidecar_to_children.edges;
                  } else if (jsonData?.edge_sidecar_to_children?.edges) {
                      itemsArray = jsonData.edge_sidecar_to_children.edges;
                  } else if (Array.isArray(jsonData?.items)) {
                      itemsArray = jsonData.items.map(item => ({ node: item }));
                  } else if (Array.isArray(jsonData?.['@graph'])) {
                      jsonData['@graph'].forEach(graphItem => {
                          if (graphItem['@type'] === 'ImageObject' && graphItem.contentUrl) {
                              if (!mediaItems.find(mi => mi.url === graphItem.contentUrl)) {
                                   mediaItems.push({ url: graphItem.contentUrl, type: 'image' });
                              }
                              foundJsonData = true;
                          } else if (graphItem['@type'] === 'VideoObject' && graphItem.contentUrl) {
                               if (!mediaItems.find(mi => mi.url === graphItem.contentUrl)) {
                                  mediaItems.push({ url: graphItem.contentUrl, type: 'video' });
                               }
                              foundJsonData = true;
                          }
                      });
                      if (mediaItems.length > 0) return;
                  }

                  if (itemsArray) {
                      itemsArray.forEach(item => {
                          if (item.node) {
                              if (item.node.is_video && item.node.video_url) {
                                   if (!mediaItems.find(mi => mi.url === item.node.video_url)) {
                                      mediaItems.push({ url: item.node.video_url, type: 'video' });
                                   }
                              } else if (item.node.display_url) {
                                  if (!mediaItems.find(mi => mi.url === item.node.display_url)) {
                                      mediaItems.push({ url: item.node.display_url, type: 'image' });
                                  }
                              } else if (item.node.image_versions2 && Array.isArray(item.node.image_versions2.candidates)) {
                                  item.node.image_versions2.candidates.sort((a,b) => b.width - a.width);
                                  if (item.node.image_versions2.candidates.length > 0 && !mediaItems.find(mi => mi.url === item.node.image_versions2.candidates[0].url)) {
                                      mediaItems.push({ url: item.node.image_versions2.candidates[0].url, type: 'image'});
                                  }
                              }
                          }
                      });
                      if (mediaItems.length > 0) foundJsonData = true;
                  }
              }
          } catch (e) { /* console.warn('Error parsing potential JSON for carousel', e, scriptTag.textContent); */ }
      });

      if (mediaItems.length === 0) {
          // console.log('%c Carousel: JSON data not found or unusable, falling back to DOM scan for post by: ' + username, 'background: #222; color: #ffcc00');
          const slides = post.querySelectorAll('ul li, div[role="listitem"]');
          slides.forEach(slide => {
              const videoEl = slide.querySelector('video');
              let currentSlideMediaUrl = null;
              let currentSlideMediaType = null;
              if (videoEl) {
                  currentSlideMediaUrl = videoEl.src;
                  if (currentSlideMediaUrl && currentSlideMediaUrl.startsWith('blob:')) {
                      const sourceEl = videoEl.querySelector('source[src]');
                      currentSlideMediaUrl = sourceEl ? sourceEl.src : null;
                  }
                  if(currentSlideMediaUrl) currentSlideMediaType = 'video';
              }
              if (!currentSlideMediaUrl) {
                  const imgEl = slide.querySelector('img');
                  if (imgEl) {
                      if (imgEl.srcset) {
                          const sources = imgEl.srcset.split(',').map(s => {
                              const parts = s.trim().split(/\s+/);
                              return { url: parts[0], width: parseInt(parts[1]?.replace('w', ''), 10) || 0 };
                          });
                          sources.sort((a, b) => b.width - a.width);
                          if (sources.length > 0) currentSlideMediaUrl = sources[0].url;
                      }
                      if (!currentSlideMediaUrl && imgEl.src && imgEl.src.startsWith('http')) {
                          currentSlideMediaUrl = imgEl.src;
                      }
                      if(currentSlideMediaUrl) currentSlideMediaType = 'image';
                  }
              }
              if (currentSlideMediaUrl && !mediaItems.find(item => item.url === currentSlideMediaUrl)) {
                  mediaItems.push({ url: currentSlideMediaUrl, type: currentSlideMediaType });
              }
                  }
              });
          // } // This curly brace was incorrectly placed, removing it.
      } // This is the correct end for if (mediaItems.length === 0)

      if (mediaItems.length > 0) {
          const uniqueUrls = new Set();
          const uniqueMediaItems = [];
          mediaItems.forEach(item => {
              if (item.url && !uniqueUrls.has(item.url)) { // Ensure item.url is valid
                  uniqueUrls.add(item.url);
                  uniqueMediaItems.push(item);
              }
          });
          mediaItems.splice(0, mediaItems.length, ...uniqueMediaItems);
      }

      if (mediaItems.length > 0) {
          const existingSingleButtonContainer = post.querySelector('.my-download-button-container .my-download-button');
          if (existingSingleButtonContainer && existingSingleButtonContainer.parentElement) {
            existingSingleButtonContainer.parentElement.remove(); // Remove single button container if carousel button is to be added
          }

          const injectionPoint = post.querySelector('footer section:nth-child(1)') || post.querySelector('div[role="group"]') || (post.querySelector('div > button, div > svg[aria-label="Comment"]')?.parentElement);
          if (injectionPoint && !injectionPoint.querySelector('.my-download-all-carousel-button')) {
              const downloadAllBtn = document.createElement('button');
              downloadAllBtn.textContent = `Download All (${mediaItems.length} items)`;
              downloadAllBtn.className = 'my-download-all-carousel-button instanshu-unite instanshu-sm instanshu-success';
              downloadAllBtn.style.padding = '5px 10px';
              downloadAllBtn.style.border = 'none';
              downloadAllBtn.style.borderRadius = '4px';
              downloadAllBtn.style.cursor = 'pointer';
              downloadAllBtn.style.marginLeft = '8px';

              downloadAllBtn.addEventListener('click', (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  downloadAllBtn.textContent = 'Zipping...';
                  downloadAllBtn.disabled = true;
                  var zip = new JSZip();
                  var count = 0;
                  mediaItems.forEach((item, index) => {
                      const fileExtension = item.type === 'video' ? 'mp4' : 'jpg';
                      const filename = `${safeUsername}_carousel_${index + 1}.${fileExtension}`;
                      JSZipUtils.getBinaryContent(item.url, function (err, data) {
                          if (err) {
                              console.error(`Error fetching ${item.url}:`, err);
                          } else {
                              zip.file(filename, data, { binary: true });
                          }
                          count++;
                          if (count === mediaItems.length) {
                              zip.generateAsync({ type: 'blob' }).then(function (content) {
                                  saveAs(content, `${safeUsername}_carousel_collection.zip`);
                                  downloadAllBtn.textContent = `Download All (${mediaItems.length} items)`;
                                  downloadAllBtn.disabled = false;
                              }).catch(err => {
                                  console.error("Error generating zip:", err);
                                  downloadAllBtn.textContent = 'Zip Error!';
                                  setTimeout(() => {
                                      downloadAllBtn.textContent = `Download All (${mediaItems.length} items)`;
                                      downloadAllBtn.disabled = false;
                                  }, 3000);
                              });
                          }
                      });
                  });
              });
              const btnContainer = document.createElement('div');
              btnContainer.className = 'my-download-button-container';
              btnContainer.style.marginLeft = '8px';
              btnContainer.appendChild(downloadAllBtn);
              if (!injectionPoint.querySelector('.my-download-all-carousel-button')) {
                  injectionPoint.appendChild(btnContainer);
              } else {
                   console.log("Carousel button was added by another process concurrently.");
              }
          }
      } else if (mediaUrl) {
        const injectionPoint = post.querySelector('footer section:nth-child(1)') || post.querySelector('div[role="group"]') || (post.querySelector('div > button, div > svg[aria-label="Comment"]')?.parentElement);
        if (injectionPoint && !injectionPoint.querySelector('.my-download-button') && !injectionPoint.querySelector('.my-download-all-carousel-button')) {
          const dlButtonContainer = document.createElement('div');
          dlButtonContainer.className = 'my-download-button-container';
          dlButtonContainer.style.marginLeft = '8px';
          const downloadLink = document.createElement('a');
          downloadLink.href = mediaUrl;
          const fileExtension = mediaType === 'Video' ? 'mp4' : 'jpg';
          downloadLink.download = `${safeUsername}_${mediaType.toLowerCase()}.${fileExtension}`;
          const button = document.createElement('button');
          button.textContent = `Download ${mediaType}`;
          button.className = 'my-download-button instanshu-unite instanshu-sm instanshu-success';
          button.style.padding = '5px 10px';
          button.style.border = 'none';
          button.style.borderRadius = '4px';
          button.style.cursor = 'pointer';
          downloadLink.appendChild(button);
          dlButtonContainer.appendChild(downloadLink);
          injectionPoint.appendChild(dlButtonContainer);
        }
      }
    } else if (mediaUrl) {
      const injectionPoint = post.querySelector('footer section:nth-child(1)');
      let finalInjectionPoint = injectionPoint;
      if (!finalInjectionPoint) {
          finalInjectionPoint = post.querySelector('div[role="group"]');
      }
      if (!finalInjectionPoint) {
          const buttonBar = post.querySelector('div > button, div > svg[aria-label="Comment"]');
          if (buttonBar) {
              finalInjectionPoint = buttonBar.parentElement;
          }
      }
      if (finalInjectionPoint && !finalInjectionPoint.querySelector('.my-download-button') && !finalInjectionPoint.querySelector('.my-download-all-carousel-button')) {
        const dlButtonContainer = document.createElement('div');
        dlButtonContainer.className = 'my-download-button-container';
        dlButtonContainer.style.marginLeft = '8px';
        const downloadLink = document.createElement('a');
        downloadLink.href = mediaUrl;
        const fileExtension = mediaType === 'Video' ? 'mp4' : 'jpg';
        downloadLink.download = `${safeUsername}_${mediaType.toLowerCase()}.${fileExtension}`;
        const button = document.createElement('button');
        button.textContent = `Download ${mediaType}`;
        button.className = 'my-download-button instanshu-unite instanshu-sm instanshu-success';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        downloadLink.appendChild(button);
        dlButtonContainer.appendChild(downloadLink);
        finalInjectionPoint.appendChild(dlButtonContainer);
      }
    }
}

function processAllExistingArticles() {
    const articles = document.querySelectorAll('article');
    if (articles.length > 0) {
        console.log(`%c InstaDownloader: Processing ${articles.length} existing <article> elements.`, 'background: #222; color: #bada55');
    }
    articles.forEach(article => processArticleElement(article));
}

function injectButtons () {
  // ... (page type detection logic remains the same) ...
  console.log('%c InstaDownloader: Injecting buttons (initial scan)...', 'background: #222; color: #bada55');

  // --- Robust Page Type Detection ---
  let isExplorePage = false;
  let isOwnProfilePage = false;
  let isOtherProfilePage = false;
  let isProfilePage = false; // Generic flag for any profile page
  let isSavedPage = false;

  // Check for Explore: URL path often /explore/
  if (window.location.pathname.startsWith('/explore/')) {
    isExplorePage = true;
    console.log('%c InstaDownloader: Explore page detected.', 'background: #222; color: #bada55');
  }

  // Check for Saved page: URL path often /username/saved/
  if (window.location.pathname.includes('/saved/')) {
    isSavedPage = true;
    console.log('%c InstaDownloader: Saved page detected.', 'background: #222; color: #bada55');
  }

  const profileHeader = document.querySelector('header section[role="banner"], header > div:nth-child(2)');

  if (profileHeader && !isExplorePage && !isSavedPage) {
      if (profileHeader.querySelector('a[href*="edit"], button[aria-label*="options"]')) {
          isOwnProfilePage = true;
          isProfilePage = true;
          console.log('%c InstaDownloader: Own profile page detected.', 'background: #222; color: #bada55');
      } else if (profileHeader.querySelector('button') ) {
          const buttonsInHeader = profileHeader.querySelectorAll('button');
          let hasFollowOrMessage = false;
          buttonsInHeader.forEach(button => {
              const buttonText = button.textContent.toLowerCase();
              if(buttonText.includes('follow') || buttonText.includes('message')) {
                  hasFollowOrMessage = true;
              }
          });
          if(hasFollowOrMessage){
            isOtherProfilePage = true;
            isProfilePage = true;
            console.log('%c InstaDownloader: Other user\'s profile page detected.', 'background: #222; color: #bada55');
          }
      }
      if(!isOwnProfilePage && !isOtherProfilePage && document.querySelector('main[role="main"] header img[alt*="profile photo"]')){
          if (!isExplorePage && !isSavedPage) {
            isProfilePage = true;
            console.log('%c InstaDownloader: Generic profile page detected (fallback).', 'background: #222; color: #bada55');
          }
      }
  }

  // --- Action Based on Page Type (Mainly for non-article specific buttons like DP) ---
  if (isExplorePage) {
    console.log('%c InstaDownloader: Explore page specific actions (currently minimal, relies on article processor for modals).', 'background: #222; color: #bada55');
  } else if (isProfilePage) {
    console.log('%c InstaDownloader: Profile page specific actions.', 'background: #222; color: #bada55');
    if (!document.querySelector('.download-dp-button-container')) {
      const dpImgElement = document.querySelector('main header img[draggable="false"], main header img[alt*="profile photo"], main header img[data-testid="user-avatar"]');
      let dpUrl = null;
      if (dpImgElement) {
        if (dpImgElement.srcset) {
          const sources = dpImgElement.srcset.split(',').map(s => {
            const parts = s.trim().split(/\s+/);
            return { url: parts[0], width: parseInt(parts[1]?.replace('w', ''), 10) || 0 };
          });
          sources.sort((a, b) => b.width - a.width);
          if (sources.length > 0 && sources[0].url) {
            dpUrl = sources[0].url;
          }
        }
        if (!dpUrl) {
          dpUrl = dpImgElement.src;
        }
      }
      if (dpImgElement && dpUrl && (dpImgElement.naturalWidth < 200 || dpImgElement.offsetWidth < 200)) {
          const parentContainer = dpImgElement.closest('div[role="button"], div:has(> span > img)');
          if (parentContainer) {
              const largerImg = parentContainer.querySelector('img[width="320"], img[height="320"]');
              if (largerImg && largerImg.src && (largerImg.naturalWidth > dpImgElement.naturalWidth || largerImg.offsetWidth > dpImgElement.offsetWidth)) {
                  dpUrl = largerImg.src;
              }
          }
      }
      if (dpUrl) {
        const profileUsernameElement = document.querySelector('main header h2, main header h1');
        const profileUsername = profileUsernameElement ? profileUsernameElement.textContent.trim() : 'instagram_profile';
        const safeProfileUsername = profileUsername.replace(/[^a-zA-Z0-9_]/g, '_');
        const dpButtonContainer = document.createElement('div');
        dpButtonContainer.className = 'download-dp-button-container';
        dpButtonContainer.style.display = 'inline-block';
        dpButtonContainer.style.marginLeft = '10px';
        const downloadLink = document.createElement('a');
        downloadLink.href = dpUrl;
        downloadLink.download = `${safeProfileUsername}_dp.jpg`;
        const button = document.createElement('button');
        button.textContent = 'Download DP';
        button.className = 'download-dp-button instanshu-unite instanshu-sm instanshu-success';
        button.style.padding = '5px 10px';
        downloadLink.appendChild(button);
        dpButtonContainer.appendChild(downloadLink);
        let injectionTarget = document.querySelector('main header section ul, main header div > h1 + div, main header div > h2 + div');
        if (!injectionTarget && profileHeader) {
            injectionTarget = profileHeader.querySelector('div:last-child');
        }
        if (injectionTarget) {
            injectionTarget.appendChild(dpButtonContainer);
            console.log('%c InstaDownloader: "Download DP" button injected.', 'background: #222; color: #bada55');
        } else {
            console.log('%c InstaDownloader: Could not find injection point for DP button.', 'background: #ffcc00');
        }
      } else {
        console.log('%c InstaDownloader: DP image URL not found.', 'background: #ffcc00');
      }
    }
    if (isOwnProfilePage && isSavedPage) {
        console.log('%c InstaDownloader: On Saved page. Individual post downloads via modals are supported.', 'background: #222; color: #bada55');
    }
  } else {
    console.log('%c InstaDownloader: On Main Feed or Single Post Page.', 'background: #222; color: #bada55');
  }

  // Process all articles currently on the page
  processAllExistingArticles();
}
// Removed the old dlink check as it's no longer relevant.

// window.onscroll = function ref () { // Commenting out old scroll listener
//   refresh()
// }

// function refresh () { // Commenting out old refresh function
//   // as we only can have 8 articles at a time.
//   injectButtons();
//   // downloadAlltrigger = true; // downloadAlltrigger is removed
// }

/*
function handleDownloadAll () {
  // This function seems to be for downloading all posts from a "Saved" collection or similar.
  // It iterates global `images`. This needs careful review if it's still a desired feature
  // and how it interacts with the new per-post download logic.
  // For now, removing `&dl=1` from its image URL processing if it's still active.
  var DownloadAllButton = document.querySelectorAll('.vtbgv a'); // This selector is likely outdated.
  const mainHeader = document.querySelector('header'); // A more generic header for button injection.

  if (DownloadAllButton.length < 7 && mainHeader) { // Condition seems arbitrary, and selector is old.
    console.log('%c Adding Download All Button (handleDownloadAll - needs review)', 'background: #222; color: #bada55');
    const alldlbutton = document.createElement('a');
    alldlbutton.innerHTML = `
            <a href="javascript:void(0);">
            <button id="downloadAll" class="instanshu-unite instanshu-sm instanshu-success">Download All (Saved - Review)</button></a>`;
    // headers[0] was specific, use mainHeader if available
    mainHeader.appendChild(alldlbutton);
  }

  const downloadAllAction = document.getElementById('downloadAll');
  if (downloadAllAction) {
    downloadAllAction.addEventListener('click', downloader);
  }

  function downloader () {
    var zip = new JSZip();
    var count = 0;
    var savedPostsZipName = 'instagram_saved_collection.zip'; // More descriptive name

    // This selector is very broad and might grab unintended images.
    // This whole function needs a rethink in context of current Instagram structure and UX.
    const imagesToZip = document.querySelectorAll('article img, ._aagv img'); // Attempt to target post images better
    var urls = [];
    console.log('%c Getting Images for handleDownloadAll (needs review)', 'background: #222; color: #bada55');

    imagesToZip.forEach(imgElement => {
        let bestUrl = null;
        if (imgElement.srcset) {
            const sources = imgElement.srcset.split(',').map(s => {
                const parts = s.trim().split(/\s+/);
                return { url: parts[0], width: parseInt(parts[1]?.replace('w', ''), 10) || 0 };
            });
            sources.sort((a, b) => b.width - a.width);
            if (sources.length > 0) bestUrl = sources[0].url;
        }
        if (!bestUrl && imgElement.src && imgElement.src.startsWith('http')) {
            bestUrl = imgElement.src;
        }
        if (bestUrl && !urls.includes(bestUrl)) { // Avoid duplicates
            urls.push(bestUrl); // No &dl=1
        }
    });

    // if (downloadAlltrigger === true && urls.length > 0) { // downloadAlltrigger is removed
    if (urls.length > 0) { // Simplified condition
      console.log(`%c Zipping ${urls.length} images via handleDownloadAll...`, 'background: #222; color: #bada55');
      // downloadAlltrigger = false; // Prevent re-triggering while processing - No longer needed

      urls.forEach(function (url, index) {
        const postUsernameElement = / find username associated with this url if possible, else generic /;
        const postUsername = "instagram"; // Placeholder
        var filename = `${postUsername}_saved_${index + 1}.jpg`; // Generic filename

        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            console.error("Error fetching for zip:", url, err);
            // throw err // or handle the error by skipping
          } else {
            zip.file(filename, data, { binary: true });
          }
          count++;
          // console.log(count, urls.length);
          if (count === urls.length) {
            zip.generateAsync({ type: 'blob' }).then(function (content) {
              saveAs(content, savedPostsZipName);
              // downloadAlltrigger = true; // Reset trigger - No longer needed
            }).catch(function(zipErr){
                console.error("Error generating zip:", zipErr);
                // downloadAlltrigger = true; // Reset trigger - No longer needed
            });
          }
        });
      });
    } else if (urls.length === 0) {
        console.log('%c handleDownloadAll: No image URLs found to zip.', 'background: #ffcc00');
        // downloadAlltrigger = true; // Reset if no URLs - No longer needed
    }
  }
}
*/

// --- Main Execution ---
// Run initial button injection for content already present
injectButtons();

// Setup MutationObserver to handle dynamically loaded content
const observerCallback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Check if it's an Element node
                    // If the added node is an article itself
                    if (node.matches && node.matches('article')) {
                        // console.log('%c InstaDownloader (Observer): Article added directly.', 'background: #222; color: #90ee90');
                        processArticleElement(node);
                    } else {
                        // If the added node might contain articles (e.g., a modal, a post container, or feed updates)
                        // Check if the node itself contains articles or if it's a common wrapper for feed items/modals
                        if (node.querySelector('article')) { // Check if the new node contains articles
                           // console.log('%c InstaDownloader (Observer): Node added containing articles.', 'background: #222; color: #90ee90', node);
                           const articlesInNode = node.querySelectorAll('article');
                           articlesInNode.forEach(article => processArticleElement(article));
                        } else if (node.matches && (node.matches('div[role="dialog"]') || node.closest('div[role="dialog"]'))) {
                           // Specifically check if a dialog (modal) was added, then look for articles inside it
                           // This can be useful if articles within modals are not direct children of the added node
                           // console.log('%c InstaDownloader (Observer): Dialog (modal) added.', 'background: #222; color: #90ee90', node);
                           const articlesInModal = node.querySelectorAll('article');
                           articlesInModal.forEach(article => processArticleElement(article));
                        }
                    }
                }
            });
        }
    }
};

const observer = new MutationObserver(observerCallback);
observer.observe(document.body, { childList: true, subtree: true });
