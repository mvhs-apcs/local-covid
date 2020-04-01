# Douglas County Covid Cases

A website that pulls the latest data from [github.com/CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19) every 15 minutes to show the cases reported in Douglas County, CO.

## Setup

Download and install [nodejs](https://nodejs.org/en/).

Close and re-open your terminal.

Install `live-server` globally (for any project), an app to serve the website.
```
  $ npm install -g live-server
```

You may have to close and re-open your terminal again for `live-server` to be seen and work.

Clone the repo.

## Running

From the repo folder, run `live-server`.

```
  $ live-server
```

This will open the website in your browser. You can edit `index.html`, `styles.css`, and `app.js` to change the site. When you save, `live-server` will detect the changes and reload the site for you.