<script setup>
import DefaultTheme from 'vitepress/theme';
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image
      ><iframe
        id="sb-preview"
        src="https://stackblitz.com/edit/web-platform-hceprw?embed=1&file=hello.js&hideExplorer=1&hideNavigation=1"
        style="visibility:hidden;"
        onload="this.style.visibility = 'visible';"
      ></iframe
    ></template>
  </DefaultTheme.Layout>
</template>
