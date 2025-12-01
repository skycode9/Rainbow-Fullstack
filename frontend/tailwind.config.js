/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ["Gilroy", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        neon: {
          pink: "#ff006e",
          blue: "#00d9ff",
          purple: "#7209b7",
          green: "#00ff88",
          yellow: "#ffbe0b",
          orange: "#fb5607",
        },
      },
      backgroundImage: {
        "rainbow-gradient":
          "linear-gradient(90deg, #40e0d0, #3fdfd1 0%, #3eddd1 1%, #3edcd2 1%, #3ddad2 2%, #3cd9d3 2%, #3bd8d3 2%, #3ad6d4 3%, #3ad5d5 3%, #39d4d5 4%, #38d2d6 4%, #37d1d6 4%, #37cfd7 5%, #36ced8 5%, #35cdd8 5%, #34cbd9 6%, #33cad9 6%, #33c9da 7%, #32c7da 7%, #31c6db 7%, #30c4dc 8%, #2fc3dc 8%, #2fc2dd 9%, #2ec0dd 9%, #2dbfde 9%, #2cbede 10%, #2cbcdf 10%, #2bbbe0 11%, #2ab9e0 11%, #29b8e1 11%, #28b7e1 12%, #28b5e2 12%, #27b4e2 13%, #26b3e3 13%, #25b1e4 13%, #24b0e4 14%, #24aee5 14%, #23ade5 14%, #22ace6 15%, #21aae7 15%, #21a9e7 16%, #20a8e8 16%, #1fa6e8 16%, #1ea5e9 17%, #1da3e9 17%, #1da2ea 18%, #1ca1eb 18%, #1b9feb 18%, #1a9eec 19%, #199dec 19%, #199bed 20%, #189aed 20%, #1798ee 20%, #1697ef 21%, #1696ef 21%, #1594f0 21%, #1493f0 22%, #1392f1 22%, #1290f2 23%, #128ff2 23%, #118df3 23%, #108cf3 24%, #0f8bf4 24%, #0e89f4 25%, #0e88f5 25%, #0d87f6 25%, #0c85f6 26%, #0b84f7 26%, #0b82f7 27%, #0a81f8 27%, #0980f8 27%, #087ef9 28%, #077dfa 28%, #077cfa 29%, #067afb 29%, #0579fb 29%, #0477fc 30%, #0376fc 30%, #0375fd 30%, #0273fe 31%, #0172fe 31%, #0171fe 32%, #0271fd 32%, #0473fa 32%, #0674f7 33%, #0976f4 33%, #0b78f1 34%, #0d79ee 34%, #107beb 34%, #127de8 35%, #157ee5 35%, #1780e2 36%, #1982df 36%, #1c83dc 36%, #1e85d9 37%, #2087d6 37%, #2388d4 38%, #258ad1 38%, #288cce 38%, #2a8dcb 39%, #2c8fc8 39%, #2f91c5 39%, #3192c2 40%, #3394bf 40%, #3696bc 41%, #3897b9 41%, #3b99b6 41%, #3d9bb3 42%, #3f9cb0 42%, #429ead 43%, #44a0aa 43%, #46a1a7 43%, #49a3a4 44%, #4ba5a1 44%, #4ea69e 45%, #50a89b 45%, #52aa98 45%, #55ab95 46%, #57ad92 46%, #59af8f 46%, #5cb08c 47%, #5eb289 47%, #61b486 48%, #63b583 48%, #65b780 48%, #68b97d 49%, #6aba7a 49%, #6cbc77 50%, #6fbe74 50%, #71bf71 50%, #74c16e 51%, #76c36c 51%, #78c469 52%, #7bc666 52%, #7dc863 52%, #7fc960 53%, #82cb5d 53%, #84cd5a 54%, #87ce57 54%, #89d054 54%, #8bd251 55%, #8ed34e 55%, #90d54b 55%, #93d748 56%, #95d845 56%, #97da42 57%, #9adc3f 57%, #9cdd3c 57%, #9edf39 58%, #a1e136 58%, #a3e233 59%, #a6e430 59%, #a8e62d 59%, #aae72a 60%, #ade927 60%, #afeb24 61%, #b1ec21 61%, #b4ee1e 61%, #b6f01b 62%, #b9f118 62%, #bbf315 63%, #bdf512 63%, #c0f60f 63%, #c2f80c 64%, #c4fa09 64%, #c7fb06 64%, #c9fd04 65%, #cbfd02 65%, #ccfd01 66%, #cdfb02 66%, #cdf903 66%, #cdf704 67%, #cef506 67%, #cef307 68%, #cff108 68%, #cfef09 68%, #cfed0a 69%, #d0eb0b 69%, #d0e90d 70%, #d0e70e 70%, #d1e50f 70%, #d1e310 71%, #d2e111 71%, #d2df12 71%, #d2dd14 72%, #d3db15 72%, #d3d916 73%, #d3d717 73%, #d4d518 73%, #d4d319 74%, #d4d11a 74%, #d5cf1c 75%, #d5cd1d 75%, #d6cb1e 75%, #d6c91f 76%, #d6c720 76%, #d7c521 77%, #d7c323 77%, #d7c124 77%, #d8bf25 78%, #d8bd26 78%, #d9bb27 79%, #d9b928 79%, #d9b72a 79%, #dab52b 80%, #dab32c 80%, #dab12d 80%, #dbaf2e 81%, #dbad2f 81%, #dcab30 82%, #dca932 82%, #dca733 82%, #dda534 83%, #dda335 83%, #dda136 84%, #de9f37 84%, #de9d39 84%, #df9b3a 85%, #df993b 85%, #df973c 86%, #e0953d 86%, #e0933e 86%, #e09140 87%, #e18f41 87%, #e18c42 88%, #e18a43 88%, #e28844 88%, #e28645 89%, #e38447 89%, #e38248 89%, #e38049 90%, #e47e4a 90%, #e47c4b 91%, #e47a4c 91%, #e5784d 91%, #e5764f 92%, #e67450 92%, #e67251 93%, #e67052 93%, #e76e53 93%, #e76c54 94%, #e76a56 94%, #e86857 95%, #e86658 95%, #e96459 95%, #e9625a 96%, #e9605b 96%, #ea5e5d 96%, #ea5c5e 97%, #ea5a5f 97%, #eb5860 98%, #eb5661 98%, #ec5462 98%, #ec5264 99%, #ec5065 99%, #ed4e66 100%, #ed4c67)",
        "rainbow-subtle":
          "linear-gradient(90deg, rgba(255,0,0,0.1), rgba(255,128,0,0.1), rgba(255,255,0,0.1), rgba(128,255,0,0.1), rgba(0,255,0,0.1), rgba(0,255,128,0.1), rgba(0,255,255,0.1), rgba(0,128,255,0.1), rgba(0,0,255,0.1), rgba(128,0,255,0.1), rgba(255,0,255,0.1), rgba(255,0,128,0.1))",
      },
      animation: {
        "rainbow-flow": "rainbow-flow 3s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-left": "fade-in-left 0.8s ease-out forwards",
        "fade-in-right": "fade-in-right 0.8s ease-out forwards",
      },
      keyframes: {
        "rainbow-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
