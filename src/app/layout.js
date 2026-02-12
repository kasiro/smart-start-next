"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";

// export const metadata = {
//   title: "Smart Start Page",
//   description: "A smart start page with customizable bookmarks and themes",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Загружаем тему из localStorage
                  const savedDarkMode = localStorage.getItem('darkMode')
                  if (savedDarkMode === 'true') {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }

                  const primaryColor = localStorage.getItem('primaryColor')
                  if (primaryColor) {
                    try {
                      const color = JSON.parse(primaryColor)
                      const hue = color.hue || 250
                      const saturation = color.saturation || 79
                      const lightness = color.lightness || 59

                      document.documentElement.style.setProperty('--primary-hue', hue)
                      document.documentElement.style.setProperty('--primary-saturation', saturation + '%')
                      document.documentElement.style.setProperty('--primary-lightness', lightness + '%')

                      // Устанавливаем акцентный цвет как основной цвет, но с немного увеличенной насыщенностью и яркостью
                      // для лучшей видимости элементов интерфейса
                      const accentSaturation = Math.min(saturation + 20, 100) // Увеличиваем насыщенность, но не больше 100%
                      const accentLightness = Math.min(lightness + 10, 100) // Увеличиваем яркость, но не больше 100%

                      document.documentElement.style.setProperty('--accent-hue', hue)
                      document.documentElement.style.setProperty('--accent-saturation', accentSaturation + '%')
                      document.documentElement.style.setProperty('--accent-lightness', accentLightness + '%')
                    } catch(e) {}
                  }

                  const panelBlur = localStorage.getItem('panelBlur')
                  if (panelBlur) {
                    document.documentElement.style.setProperty('--panel-blur', panelBlur + 'px')
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        {/* Font Awesome CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
