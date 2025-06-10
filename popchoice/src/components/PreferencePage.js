import { sanitizeInput, isValidStringInput } from '../utils/validation.js';
import { BasePage, ValidationError } from './BasePage.js';

class PreferencePage extends BasePage {
  getTemplateId() {
    return 'preference';
  }

  getPageClass() {
    return 'preference';
  }

  getFormId() {
    return 'preference-form';
  }

  validateFormData({ favorite, mood, genre, island }) {
    if (!favorite || !mood || !genre || !island) {
      throw new ValidationError('Please fill in all fields');
    }

    const moods = ['new', 'classic'];
    const genres = ['fun', 'serious', 'inspiring', 'scary'];
    if (
      !isValidStringInput(favorite) ||
      !isValidStringInput(island) ||
      !moods.includes(mood) ||
      !genres.includes(genre)
    ) {
      throw new ValidationError('Please provide a valid input');
    }

    return {
      favorite: sanitizeInput(favorite),
      mood,
      genre,
      island: sanitizeInput(island),
    };
  }

  updateGlobalState(data) {
    if (!window.state) {
      window.state = {};
    }

    if (!window.preferences) {
      window.preferences = [];
    }

    window.state.preferences.push(data);
    window.state.currentUser += 1;
    window.state.currentPage = 'preference';
  }

  navigateNext() {
    let event;
    if (window.state.currentUser-1 >= window.state.totalUsers) {
      event = new CustomEvent('movie');
    } else {
      event = new CustomEvent('next');
    }
    document.body.dispatchEvent(event);
  }
}

customElements.define('preference-page', PreferencePage);
