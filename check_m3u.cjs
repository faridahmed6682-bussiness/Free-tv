async function check() {
  const urls = [
    'https://iptv-org.github.io/iptv/countries/bd.m3u',
    'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/bd.m3u'
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      console.log(url, r.status);
      if (r.status === 200) {
        console.log((await r.text()).substring(0, 500));
      }
    } catch(e) {
      console.log(url, e.message);
    }
  }
}
check();
