const Images = ({ images }) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {images.map((image) => (
          <div key={image.id} className="w-[300px] h-[400px] relative rounded-md overflow-hidden">
            <img src={image.urls.small} alt={image.alt_description} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  };
  
  export default Images;
  