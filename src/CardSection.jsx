import { useState } from "react";

const CardSection = ({ images, onImageClick }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 px-4 mt-5">
      {images.map((image) => (
        <div key={image.id} className="mb-4 break-inside-avoid">
          <img
            src={image.urls.small}
            alt={image.alt_description}
            className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-all"
            onClick={() => onImageClick(image)}
          />
        </div>
      ))}
    </div>
  );
};

export default CardSection;
