const fs = require('fs');
const https = require('https');

const characters = [
  { name: 'Tanjiro_Kamado', file: 'tanjiro.png' },
  { name: 'Nezuko_Kamado', file: 'nezuko.png' },
  { name: 'Zenitsu_Agatsuma', file: 'zenitsu.png' },
  { name: 'Inosuke_Hashibira', file: 'inosuke.png' },
  { name: 'Giyu_Tomioka', file: 'giyu.png' },
  { name: 'Kyojuro_Rengoku', file: 'rengoku.png' },
  { name: 'Tengen_Uzui', file: 'tengen.png' },
  { name: 'Shinobu_Kocho', file: 'shinobu.png' },
  { name: 'Muichiro_Tokito', file: 'muichiro.png' },
  { name: 'Mitsuri_Kanroji', file: 'mitsuri.png' },
  { name: 'Gyomei_Himejima', file: 'gyomei.png' },
  { name: 'Obanai_Iguro', file: 'obanai.png' },
  { name: 'Sanemi_Shinazugawa', file: 'sanemi.png' },
  { name: 'Muzan_Kibutsuji', file: 'muzan.png' },
  { name: 'Akaza', file: 'akaza_generated.png' },
  { name: 'Kokushibo', file: 'kokushibo_generated.png' },
  { name: 'Doma', file: 'douma_generated.png' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function fetchWikiImage(charName, fileName) {
  const url = `https://kimetsu-no-yaiba.fandom.com/api.php?action=query&titles=${charName}&prop=pageimages&format=json&pithumbsize=1000`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await response.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  
  if (pageId !== '-1' && pages[pageId].thumbnail) {
    const imgUrl = pages[pageId].thumbnail.source;
    console.log(`Downloading ${fileName} from ${imgUrl}...`);
    await downloadImage(imgUrl, fileName);
    console.log(`Done downloading ${fileName}`);
  } else {
    console.log(`Could not find image for ${charName}`);
  }
}

async function main() {
  for (const char of characters) {
    if (!fs.existsSync(char.file)) {
      await fetchWikiImage(char.name, char.file);
    } else {
      console.log(`${char.file} already exists.`);
    }
  }
}

main().catch(console.error);
