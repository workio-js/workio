import DefaultTheme from 'vitepress/theme';
import './custom.css';
import custom from './custom.vue';

export default {
  extends: DefaultTheme,
  Layout: custom,
};
