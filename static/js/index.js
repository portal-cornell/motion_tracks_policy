window.HELP_IMPROVE_VIDEOJS = false;

// Lazy loading function for videos
function lazyLoadVideos() {
  const videos = document.querySelectorAll('video[data-src]');
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.src = video.dataset.src;
        video.load();
        observer.unobserve(video);
      }
    });
  }, options);

  videos.forEach(video => {
    observer.observe(video);
  });
}

// Function to initialize carousels
function initCarousels() {
  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  var carousels = bulmaCarousel.attach('.carousel', options);

  carousels.forEach(carousel => {
    carousel.on('before:show', state => {
      console.log(state);
    });
  });
}

// Main initialization function
function init() {
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  lazyLoadVideos();
  initCarousels();

  // Adjust video playback speeds
  const videos = ['carousel-rollout', 'teaser-video', 'system-overview-video'];
  videos.forEach(id => {
    const video = document.getElementById(id);
    if (video) video.playbackRate = 0.7;
  });

  bulmaSlider.attach();
}

// Use DOMContentLoaded instead of $(document).ready for faster execution
document.addEventListener('DOMContentLoaded', init);

// Preload interpolation images in the background
function preloadInterpolationImages() {
  const INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
  const NUM_INTERP_FRAMES = 240;
  const interp_images = [];

  for (let i = 0; i < NUM_INTERP_FRAMES; i++) {
    const path = `${INTERP_BASE}/${String(i).padStart(6, '0')}.jpg`;
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }

  return interp_images;
}

// Load interpolation images after main content has loaded
window.addEventListener('load', () => {
  const interp_images = preloadInterpolationImages();
  const slider = document.getElementById('interpolation-slider');
  
  if (slider) {
    slider.max = NUM_INTERP_FRAMES - 1;
    slider.addEventListener('input', function() {
      setInterpolationImage(this.value, interp_images);
    });
  }
  
  setInterpolationImage(0, interp_images);
});

function setInterpolationImage(i, images) {
  const image = images[i];
  image.ondragstart = () => false;
  image.oncontextmenu = () => false;
  const wrapper = document.getElementById('interpolation-image-wrapper');
  if (wrapper) {
    wrapper.innerHTML = '';
    wrapper.appendChild(image);
  }
}