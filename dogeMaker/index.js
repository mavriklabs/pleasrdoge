import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import pkg from 'canvas';
const { createCanvas, loadImage } = pkg;

const imgCache = {};
const canvas = createCanvas(800, 800);
const ctx = canvas.getContext('2d');
let cnt = 0;

const loadImg = async (path) => {
  let result = imgCache[path];

  if (!result) {
    result = await loadImage(path);

    imgCache[path] = result;
  }

  return result;
};

const skipCombo = (props) => {
  const {
    starImage,
    heartImage,
    hatImage,
    glassesImage,
    bowTieImage,
    laserImage,
    crownImage,
    chainImage,
    // mouthImage,
    diamondImage,
  } = props;

  let eyeCnt = 0;
  if (glassesImage) {
    eyeCnt++;
  }
  if (starImage) {
    eyeCnt++;
  }
  if (heartImage) {
    eyeCnt++;
  }
  if (laserImage) {
    eyeCnt++;
  }
  if (diamondImage) {
    eyeCnt++;
  }

  let hatCnt = 0;
  if (crownImage) {
    hatCnt++;
  }
  if (hatImage) {
    hatCnt++;
  }

  let neckCnt = 0;
  if (bowTieImage) {
    neckCnt++;
  }
  if (chainImage) {
    neckCnt++;
  }

  if (eyeCnt > 1 || hatCnt > 1 || neckCnt > 1) {
    return true;
  }

  return false;
};

const saveFile = async (props) => {
  if (skipCombo(props)) {
    return;
  }

  const {
    backgrounds,
    dogeImage,
    outputPath,
    starImage,
    heartImage,
    hatImage,
    glassesImage,
    bowTieImage,
    laserImage,
    crownImage,
    chainImage,
    mouthImage,
    diamondImage,
  } = props;

  ++cnt;

  if (cnt % 200 === 0) {
    console.log(cnt);
  }

  try {
    let image;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 800, 800);

    const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    image = await loadImg(bg.path);
    ctx.drawImage(image, 0, 0);

    ctx.drawImage(dogeImage, 0, 0);

    // Stars on eyes
    if (starImage) {
      image = await loadImg(starImage);
      ctx.drawImage(image, 0, 0);
    }

    // Stars on eyes
    if (heartImage) {
      image = await loadImg(heartImage);
      ctx.drawImage(image, 0, 0);
    }

    // Hats
    if (hatImage) {
      image = await loadImg(hatImage);
      ctx.drawImage(image, 0, 0);
    }

    // Glasses
    if (glassesImage) {
      image = await loadImg(glassesImage);
      ctx.drawImage(image, 0, 0);
    }

    // Bow Ties
    if (bowTieImage) {
      image = await loadImg(bowTieImage);
      ctx.drawImage(image, 0, 0);
    }

    // Mouth
    if (mouthImage) {
      image = await loadImg(mouthImage);
      ctx.drawImage(image, 0, 0);
    }

    // Diamond
    if (diamondImage) {
      image = await loadImg(diamondImage);
      ctx.drawImage(image, 0, 0);
    }

    // Crowns
    if (crownImage) {
      image = await loadImg(crownImage);
      ctx.drawImage(image, 0, 0);
    }

    // Laser eyes
    if (laserImage) {
      image = await loadImg(laserImage);
      ctx.drawImage(image, 0, 0);
    }

    // Chains
    if (chainImage) {
      image = await loadImg(chainImage);
      ctx.drawImage(image, 0, 0);
    }

    let buffer = canvas.toBuffer('image/jpeg', { quality: 0.3 });
    writeFileSync(outputPath, buffer);
    buffer = null;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const filesInDir = (path, listCode) => {
  let list = readdirSync(path, { withFileTypes: true });

  list = list.filter((entry) => {
    return entry.isFile;
  });

  list.forEach((entry, index) => {
    entry.path = `${path}/${entry.name}`;
    entry.id = `${listCode}${index}`;
  });

  return list;
};

const pathForEntries = (entries) => {
  let result = '';

  for (const e of entries) {
    if (e.id) {
      result = `${result}_${e.id}`;
    }
  }

  return result;
};

const main = async () => {
  const now = Date.now();

  mkdirSync('./output', { recursive: true });

  const backgrounds = filesInDir('./images/Backgrounds', 'star');
  const stars = filesInDir('./images/Stars', 'star');
  const hats = filesInDir('./images/Hats', 'hat');
  const glasses = filesInDir('./images/Glasses', 'gls');
  const bowTies = filesInDir('./images/Bows', 'bti');
  const hearts = filesInDir('./images/Hearts', 'hrt');
  const lasers = filesInDir('./images/Lasers', 'lsr');
  const crowns = filesInDir('./images/Crowns', 'crwn');
  const chains = filesInDir('./images/Chains', 'chn');
  const diamonds = filesInDir('./images/Diamonds', 'dia');
  const mouth = filesInDir('./images/Mouth', 'mth');

  // push blank on each list so we can have items without any hat/glasses/stars
  stars.push({});
  hats.push({});
  glasses.push({});
  bowTies.push({});
  hearts.push({});
  lasers.push({});
  crowns.push({});
  chains.push({});
  diamonds.push({});
  mouth.push({});

  const dogeImage = await loadImg('./images/Doge.png');

  let duh = 0;

  // files object contains all files names
  // log them on console
  for (const hatEntry of hats) {
    for (const starEntry of stars) {
      for (const glassesEntry of glasses) {
        for (const tiesEntry of bowTies) {
          for (const heartEntry of hearts) {
            for (const laserEntry of lasers) {
              for (const crownEntry of crowns) {
                for (const chainEntry of chains) {
                  for (const diamondEntry of diamonds) {
                    for (const mouthEntry of mouth) {
                      duh++;

                      if (cnt < 1000000000000000) {
                        const path = pathForEntries([
                          starEntry,
                          glassesEntry,
                          hatEntry,
                          tiesEntry,
                          heartEntry,
                          laserEntry,
                          crownEntry,
                          chainEntry,
                          diamondEntry,
                          mouthEntry,
                        ]);

                        await saveFile({
                          dogeImage: dogeImage,
                          backgrounds: backgrounds,
                          outputPath: `./output/${path}.jpeg`,
                          starImage: starEntry.path,
                          heartImage: heartEntry.path,
                          hatImage: hatEntry.path,
                          glassesImage: glassesEntry.path,
                          bowTieImage: tiesEntry.path,
                          laserImage: laserEntry.path,
                          crownImage: crownEntry.path,
                          chainImage: chainEntry.path,
                          diamondImage: diamondEntry.path,
                          mouthImage: mouthEntry.path,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 16×4×14×7×17×30×11×5×3×11 = 5,805,676,800
  console.log(`Total Loops: ${duh}`);
  console.log(`Total Images: ${cnt}`);

  const diff = Date.now() - now;
  console.log(diff / 1000 / 60);
};

main();