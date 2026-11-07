// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Adresse publique du site. Elle sert à fabriquer les URL absolues
  // dont le référencement a besoin : lien canonique et aperçus de
  // partage (voir src/components/Meta.astro).
  site: 'https://carole-renaud-massage.fr',

  // Plan du site pour Google : génère sitemap-index.xml à chaque construction.
  integrations: [sitemap()],

  build: {
    // Par défaut Astro recopie les petits scripts et les petites feuilles de
    // style directement dans le HTML. C'est plus rapide d'un cheveu, mais la
    // CSP (voir public/.htaccess) refuse tout code inline : on demande donc
    // des fichiers externes, que la CSP autorise par leur origine.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
