import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import https from 'https';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary config loaded:', process.env.CLOUDINARY_CLOUD_NAME);

const ALBUM = 'holy-child-school-80-blood-donation-march-2026';
const FOLDER = 'albums';

const photos = [
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/demure.png', name: 'thumb.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/Action.png', name: '01.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-4.png', name: '02.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-5.png', name: '03.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-6.png', name: '04.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-6b.png', name: '05.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-7.png', name: '06.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-33.png', name: '07.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-34.png', name: '08.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-35.png', name: '09.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-551.png', name: '10.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-552.png', name: '11.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-554.png', name: '12.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart2.png', name: '13.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart3.png', name: '14.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/frame-heart4.png', name: '15.png' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__0287-1-scaled.jpg', name: '16.jpg' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__9848-1.jpg-scaled.jpeg', name: '17.jpeg' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/LY__9905.jpg-scaled.jpeg', name: '18.jpeg' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/WhatsApp-Image-202.jpeg', name: '19.jpeg' },
  { url: 'https://kwaabafoundation.org/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-14-at-12.22.35-PM.jpeg', name: '20.jpeg' },
];

async function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${FOLDER}/${ALBUM}`,
        public_id: publicId.replace(/\.[^.]+$/, ''),
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.write(buffer);
    stream.end();
  });
}

async function run() {
  let success = 0;
  let failed = 0;
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    console.log(`\n[${i + 1}/${photos.length}] ${photo.name}`);
    try {
      console.log('  Downloading...');
      const buffer = await fetchBuffer(photo.url);
      console.log(`  ${buffer.length} bytes`);
      console.log('  Uploading to Cloudinary...');
      const result = await uploadToCloudinary(buffer, photo.name);
      console.log(`  ✓ ${result.secure_url}`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\nDone! ${success} succeeded, ${failed} failed.`);
}

run();