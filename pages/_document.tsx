import { Html, Head, Main, NextScript } from "next/document";

//最外层
export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <script src="https://at.alicdn.com/t/c/font_3704886_zu0ilq58gjb.js" defer></script>
        <link href="https://cdn.bootcdn.net/ajax/libs/video.js/7.21.0/alt/video-js-cdn.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://ssl.cdn.maodouketang.com/assets/quill/1.3.4/quill.bubble.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.bootcdn.net/ajax/libs/video.js/7.21.0/alt/video.core.min.js" defer></script>
        <script src="https://cdn.bootcdn.net/ajax/libs/videojs-hotkeys/0.2.28/videojs.hotkeys.min.js" defer></script>
      </body>
    </Html>
  );
}



