# Canvas Switcher Privacy Policy

**Last updated: 27 November 2026**

Canvas Switcher is a Chrome extension that displays Canvas course information in Chrome's side panel and lets you navigate to course resources.

## Information the extension accesses

When the side panel checks for a Canvas session, Canvas Switcher uses your existing signed-in session to request course information from an open Canvas site hosted on `*.instructure.com`. When available, it also requests announcement, assignment and module information for those courses. This can include course names and codes; announcement titles, messages and dates; assignment names, descriptions, due dates and possible points; module and item names, types and links; and the Canvas URLs needed to open those resources.

Canvas Switcher uses this information to show your courses and resources in the side panel and to navigate to the Canvas pages you select. Requests go to the Canvas site open in your browser and use your existing Canvas session. The extension does not send this information to the developer or to developer-operated servers, and does not sell or share it with other parties. The information is held in the extension page's memory while the side panel is in use; the extension does not save it to persistent extension storage.

Canvas Switcher does not collect your Canvas password. It does not use analytics, advertising or tracking. It does not access Canvas information beyond what is needed for the course display and navigation features described here.

## Chrome permissions

- **Side Panel (`sidePanel`):** Displays the extension interface alongside your current tab.
- **Tabs (`tabs`):** Finds open Canvas tabs, sends requests to their Canvas content scripts and navigates the selected tab when you choose a destination.
- **Host access (`https://*.instructure.com/*`):** Lets the content script run on Instructure-hosted Canvas sites and make the Canvas API requests needed for the features above.

Canvas Switcher uses information accessed from Canvas only to provide and maintain its course display and navigation features. Its use of this information follows the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Data retention and sharing

Course information is kept in memory only while the extension page is running. Canvas Switcher does not maintain a developer-operated database of your courses or course resources. The extension does not send course information to the developer or other third parties. Canvas receives the requests needed to retrieve information from your account, as described above.

## Contact

For privacy questions or feedback, contact the developer through the project's GitHub repository:

https://github.com/PhanHoangKhang/Canvas-Switcher/issues

## Not affiliated

Canvas Switcher is an independent project and is not affiliated with, endorsed by, or officially associated with RMIT University, Instructure or Canvas.
