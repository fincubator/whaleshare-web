import React from 'react';

export default function ServerHTML({ body, assets, locale, title, meta }) {
    let page_title = title;
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {
                meta && meta.map(m => {
                    if (m.title) {
                        page_title = m.title;
                        return null;
                    }
                    if (m.canonical)
                        return <link key="canonical" rel="canonical" href={m.canonical} />;
                    if (m.name && m.content)
                        return <meta key={m.name} name={m.name} content={m.content} />;
                    if (m.property && m.content)
                        return <meta key={m.property} property={m.property} content={m.content} />;
                    if (m.name && m.content)
                        return <meta key={m.name} name={m.name} content={m.content} />;
                    return null;
                })
            }
            <link rel="manifest" href="/static/manifest.json" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png" />
            <link rel="shortcut icon" href="/images/favicons/favicon.ico" />
            <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,600" rel="stylesheet" type="text/css" />
            <meta name="application-name" content="Whaleshares" />
            <meta name="msapplication-TileColor" content="#FFFFFF" />
            <meta name="msapplication-config" content="/images/favicons/browserconfig.xml" />
            <meta name="theme-color" content="#ffffff" />

            { assets.style.map((href, idx) =>
                <link href={href} key={idx} rel="stylesheet" type="text/css" />) }
            <title>{page_title}</title>
        </head>
        <body>
        <div id="content" dangerouslySetInnerHTML={ { __html: body } }></div>
        {assets.script.map((href, idx) => <script key={ idx } src={ href }></script>) }



            <script src="https://beta.whaleshares.net/cryptochat/bundle.js"></script>
        </body>
        </html>
    );
}
