function scrape() {
  console.log("TWIS: Scraping Twitter images");
  const imageElements = document.querySelectorAll(
    'img[src^="https://pbs.twimg.com/media/"]'
  );
  const imageUrls = [];
  const imageIds = [];

  console.debug("TWIS: Found " + imageElements.length + " images");
  imageElements.forEach((element) => {
    const imageURL = element.src;
    const imageId = imageURL.split("/")[4].split("?")[0];

    imageUrls.push(imageURL);
    imageIds.push(imageId);
  });

  chrome.storage.local.get("downloadedImages", function (result) {
    const downloadedImages = result.downloadedImages || [];
    const newImageUrls = [];
    const newImageIds = [];

    imageUrls.forEach((url, index) => {
      if (!downloadedImages.includes(imageIds[index])) {
        newImageUrls.push(url);
        newImageIds.push(imageIds[index]);
      }
    });

    // remove duplicates
    newImageUrls.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    newImageIds.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    chrome.runtime.sendMessage({
      action: "downloadImages",
      urls: newImageUrls,
      ids: newImageIds,
    });

    const updatedDownloadedImages = [...downloadedImages, ...newImageIds];
    chrome.storage.local.set({ downloadedImages: updatedDownloadedImages });
  });
}

function onLoad() {
  const observer = new MutationObserver(scrape);
  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener("load", onLoad);
