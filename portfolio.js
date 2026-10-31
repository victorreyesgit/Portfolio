// ============================================================
//  PORTFOLIO CONTENT: edit this file (or use admin.html) to change the page.
//  Keep it valid JSON: double quotes, no comments inside the
//  object, no trailing commas. Keep the line "window.PORTFOLIO = {".
//
//  "hero"      -> title, the grey "by" text next to it, the big
//                 intro sentence ("lead") and the smaller note under it
//  "sections"  -> the categories (Visualisations, Code, ...), in display order.
//                 Each has a title, an optional description and its projects.
//                 "visible": false hides a category or a project.
//                 A category with no visible projects is not shown.
//  project     -> title, description, url (the "Open" link), optional repo
//                 (the "Source" link) and optional "details" (small grey line)
//  "footer"    -> the link at the bottom
//
//  The schematic figure at the top lives in index.html (not here).
// ============================================================
window.PORTFOLIO = {
  "hero": {
    "title": "Visualizing Proximity",
    "byline": "— by Victor Reyes",
    "lead": "What does “nearby” mean in data? Interactive explorers compare a fixed-radius ball, the k nearest neighbours and a density-calibrated ball.",
    "note": "The schematic shows the core idea. With the same ε and the same k, a fixed radius catches many points where data is dense and almost none where it is sparse. The k-NN ball always catches exactly k points, so its size adapts."
  },
  "sections": [
    {
      "title": "Projects",
      "description": "",
      "visible": true,
      "projects": [
        {
          "title": "Manifold Neighborhoods Explorer",
          "description": "A 3D curved surface z = A·sin(k₁u)·cos(k₂v) with 100 to 5000 sample points. Compares the ε-ball, the k nearest neighbours and a closeness-ball whose radius encloses a fixed fraction of the surface area, all using straight-line distance.",
          "details": "Three.js. Sliders for the surface, a live readout at the reference point, photo and video capture.",
          "url": "https://victorreyesgit.github.io/Manifold-Balls/",
          "visible": true,
          "repo": "https://github.com/victorreyesgit/Manifold-Balls"
        },
        {
          "title": "ε-ball vs k-NN on a Manifold",
          "description": "A fixed-size ε-neighbourhood and a k-NN neighbourhood on a curved surface. Shows how the two diverge as the surface curves or the sampling becomes sparse or uneven.",
          "details": "Three.js, runs in the browser.",
          "url": "https://victorreyesgit.github.io/knn_vs_epsilon_manifold/",
          "visible": true,
          "repo": "https://github.com/victorreyesgit/knn_vs_epsilon_manifold"
        },
        {
          "title": "ε-ball vs k-NN on a Gaussian",
          "description": "A 2D normal distribution with its density heatmap and random samples. Move a reference point and compare a fixed-radius ε-ball with a k-NN ball whose radius is calibrated so it holds the probability (k+½)/N.",
          "details": "Plain HTML, CSS and JavaScript. Works on phones, with photo and video capture.",
          "url": "https://victorreyesgit.github.io/knn_vs_epsilon/",
          "visible": true,
          "repo": "https://github.com/victorreyesgit/knn_vs_epsilon"
        }
      ]
    },
    {
      "title": "Replicability",
      "description": "",
      "visible": true,
      "projects": [
        {
          "title": "Closeness",
          "description": "",
          "details": "",
          "url": "",
          "visible": true
        }
      ]
    }
  ],
  "footer": {
    "text": "GitHub profile",
    "url": "https://github.com/victorreyesgit"
  }
};
