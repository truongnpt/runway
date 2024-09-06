document.addEventListener('DOMContentLoaded', function() {
    let page = 1;
    let isLastPage = false;
    const lastPage = parseInt(document.getElementById('ProductGridContainer').dataset.lastPage);
    const productGrid = document.getElementById('product-grid');
    const infiniteScrollTrigger = document.getElementById('infinite-scroll-trigger');
    const loadingSpinner = document.querySelector('.loading-spinner');

    function loadMoreProducts() {
      if (isLastPage) return;

      page++;
      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;
      searchParams.set('page', page);
      const url = `${window.location.pathname}?${searchParams.toString()}`;
      
      loadingSpinner.style.display = 'block';

      fetch(url)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newProducts = doc.querySelector('#product-grid');
          
          if (newProducts && page <= lastPage) {
            productGrid.insertAdjacentHTML('beforeend', newProducts.innerHTML);
          } else {
            isLastPage = true;
            infiniteScrollTrigger.style.display = 'none';
          }
          loadingSpinner.style.display = 'none';
        })
        .catch(error => {
          console.error('Error:', error);
          loadingSpinner.style.display = 'none';
        });
    }

    function handleIntersection(entries) {
      if (entries[0].isIntersecting && !isLastPage) {
        loadMoreProducts();
      }
    }

    const observer = new IntersectionObserver(handleIntersection);
    if (infiniteScrollTrigger) {
      observer.observe(infiniteScrollTrigger);
    }
  });