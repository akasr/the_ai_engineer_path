class MoviePage extends HTMLElement{

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const template = document.getElementById('movie');
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.classList.add('movie');
  }

  setupEventListeners() {
    const nextButton = this.querySelector('#next-btn');
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.updateGlobalState();
        this.navigateNext();
      });
    } else {
      console.error('Next button not found');
    }
  }

  getMovieName() {
    return this.querySelector('h1.title').textContent;
  }
  updateGlobalState() {
    if (!window.state) {
      window.state = {};
    }

    window.state.movies.push(this.getMovieName());
    window.state.currentPage = 'movie';
  }

  navigateNext() {
    const event = new CustomEvent('next');
    document.body.dispatchEvent(event);
  }
}

customElements.define('movie-page', MoviePage);