import homeBGPhone from "./images/bg-iPhone.jpg";
import homeBGRoom from "./images/bg-sampleRoom.jpg";

type ImageCollectionKey = "home";

interface CollectionImage {
  url: string;
  creator: string;
  creditLink: string;
}

interface ImageCollection {
  key: string;
  images: CollectionImage[];
}

const imageCollectionHome: ImageCollection = {
  key: "home",
  images: [
    {
      url: homeBGPhone,
      creator: "Juja Han",
      creditLink: "https://unsplash.com/@juja_han",
    },
    {
      url: homeBGRoom,
      creator: "Andreas Forsberg",
      creditLink: "https://unsplash.com/@andreasforsberg",
    }
  ],
};

const allImageCollections: ImageCollection[] = [imageCollectionHome];

export function getImageFromCollection(collectionKey: ImageCollectionKey) {
  const list = allImageCollections.find((col) => col.key === collectionKey)?.images;
  if (!Array.isArray(list) || list.length <= 0) return null;
  return list[Math.round(Math.random() * (list.length - 1))];
}