import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import nailImage1 from '../assets/images/nr3d.jpeg';

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.medium};
  background: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.cardBackground};
  color: ${({ active, theme }) => 
    active ? theme.colors.background : theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const ImageGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.medium};
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3/4;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    
    img {
      transform: scale(1.05);
    }
  }
`;

const Image = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  max-width: 90vw;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.large};
  overflow: hidden;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
`;

const ModalInfo = styled.div`
  color: white;
  padding: 1rem;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1002;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.background};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
`;

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const categories = ['all', 'regular', 'gel', 'designs', 'art', '3d'];
  
  const images = [
    {
      id: 1,
      src: nailImage1,
      category: 'regular',
      title: 'Classic French',
      description: 'Elegant and timeless French manicure',
      price: '$35',
    },
    {
        id: 2,
        src: nailImage1,
        category: 'regular',
        title: 'Classic French',
        description: 'Elegant and timeless French manicure',
        price: '$35',
      },
      
  ];

  useEffect(() => {
    const loadImages = async () => {
      try {
        const preloadImages = images.map(image => {
          return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load image: ${image.src}`));
          });
        });

        await Promise.all(preloadImages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const filteredImages = images.filter(img => 
    activeCategory === 'all' || img.category === activeCategory
  );

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleCloseModal]);

  return (
    <GalleryContainer>
      <FilterContainer>
        {categories.map(category => (
          <FilterButton
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>

      <ImageGrid
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {isLoading ? (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : loadError ? (
          <div>Error loading images. Please try again later.</div>
        ) : (
          filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              layoutId={`image-${image.id}`}
              onClick={() => handleImageClick(image)}
              whileHover={{ y: -5 }}
            >
              <Image
                src={image.src}
                alt={image.title}
                effect="blur"
                width="100%"
                height="100%"
                onError={(e) => {
                  console.error(`Failed to load image: ${image.src}`);
                  e.target.parentElement.innerHTML = `
                    <div style="padding: 1rem; text-align: center;">
                      Image not available
                    </div>
                  `;
                }}
              />
            </ImageCard>
          ))
        )}
      </ImageGrid>

      <AnimatePresence>
        {selectedImage && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <CloseButton onClick={handleCloseModal}>✕</CloseButton>
            <ModalContent
              layoutId={`image-${selectedImage.id}`}
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.src} alt={selectedImage.title} />
              <ModalInfo>
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                <p>Starting at {selectedImage.price}</p>
              </ModalInfo>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
}

export default Gallery;