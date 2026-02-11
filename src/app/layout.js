import "./globals.css";

export const metadata = {
  title: "Smart Start Page",
  description: "A smart start page with customizable bookmarks and themes",
};

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
                  var savedDarkMode = localStorage.getItem('darkMode')
                  if (savedDarkMode && JSON.parse(savedDarkMode)) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }

                  var primaryColor = localStorage.getItem('primaryColor')
                  if (primaryColor) {
                    try {
                      var color = JSON.parse(primaryColor)
                      document.documentElement.style.setProperty('--primary-hue', color.hue || 250)
                      document.documentElement.style.setProperty('--primary-saturation', (color.saturation || 79) + '%')
                      document.documentElement.style.setProperty('--primary-lightness', (color.lightness || 59) + '%')
                    } catch(e) {
                      console.error('Ошибка парсинга primaryColor:', e)
                    }
                  }

                  var panelBlur = localStorage.getItem('panelBlur')
                  if (panelBlur) {
                    document.documentElement.style.setProperty('--panel-blur', panelBlur + 'px')
                  }
                } catch (e) {
                  console.error('Ошибка загрузки темы:', e)
                }
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
