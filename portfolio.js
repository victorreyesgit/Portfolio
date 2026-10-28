// ============================================================
//  PORTFOLIO CONTENT: edit this file (or use admin.html) to change the page.
//  Keep it valid JSON: double quotes, no comments inside the
//  object, no trailing commas. Keep the line "window.PORTFOLIO = {".
//
//  "hero"      -> title, the grey "by" text next to it, the big
//                 intro sentence ("lead") and the smaller note under it
//  "projects"  -> the list of projects, in display order
//                 "details" is the small grey line under the description
//                 "repo" is optional; "visible": false hides a project
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
  "projectsTitle": "Projects",
  "projects": [
    {
      "title": "Manifold Neighborhoods Explorer",
      "description": "A 3D curved surface z = A·sin(k₁u)·cos(k₂v) with 100 to 5000 sample points. Compares the ε-ball, the k nearest neighbours and a closeness-ball whose radius encloses a fixed fraction of the surface area, all using straight-line distance.",
      "details": "Three.js. Sliders for the surface, a live readout at the reference point, photo and video capture.",
      "url": "https://victorreyesgit.github.io/Manifold-Balls/",
      "repo": "https://github.com/victorreyesgit/Manifold-Balls",
      "visible": true
    },
    {
      "title": "ε-ball vs k-NN on a Manifold",
      "description": "A fixed-size ε-neighbourhood and a k-NN neighbourhood on a curved surface. Shows how the two diverge as the surface curves or the sampling becomes sparse or uneven.",
      "details": "Three.js, runs in the browser.",
      "url": "https://victorreyesgit.github.io/knn_vs_epsilon_manifold/",
      "repo": "https://github.com/victorreyesgit/knn_vs_epsilon_manifold",
      "visible": true
    },
    {
      "title": "ε-ball vs k-NN on a Gaussian",
      "description": "A 2D normal distribution with its density heatmap and random samples. Move a reference point and compare a fixed-radius ε-ball with a k-NN ball whose radius is calibrated so it holds the probability (k+½)/N.",
      "details": "Plain HTML, CSS and JavaScript. Works on phones, with photo and video capture.",
      "url": "https://victorreyesgit.github.io/knn_vs_epsilon/",
      "repo": "https://github.com/victorreyesgit/knn_vs_epsilon",
      "visible": true
    }
  ],
  "footer": {
    "text": "GitHub profile",
    "url": "https://github.com/victorreyesgit"
  }
};
