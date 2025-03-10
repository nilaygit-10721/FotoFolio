import React from "react";

const ImageModal = ({ image, relatedImages, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-3/4 h-3/4 flex flex-col">
        <button onClick={onClose} className="self-end text-red-500 text-lg">✖</button>
        <img
          src={image.urls.regular}
          alt={image.alt_description}
          className="max-h-[500px] mx-auto rounded-lg shadow-md"
        />
        <a
          href={image.urls.full}
          download
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded text-center w-fit mx-auto"
        >
          Download
        </a>
        <h2 className="mt-4 text-lg font-bold">Related Images</h2>
        <div className="flex gap-2 overflow-x-auto mt-2">
          {relatedImages.map((img) => (
            <img
              key={img.id}
              src={img.urls.thumb}
              alt={img.alt_description}
              className="h-24 rounded cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
