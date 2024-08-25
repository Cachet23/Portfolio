import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    mimeTypes: {
      'model/gltf+json': ['gltf']
    }
  }
});