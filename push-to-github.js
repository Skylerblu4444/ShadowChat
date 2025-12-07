import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = process.env.REPO_NAME;

if (!GITHUB_USERNAME || !GITHUB_TOKEN || !REPO_NAME) {
  console.error('❌ Missing environment variables. Please set GITHUB_USERNAME, GITHUB_TOKEN, and REPO_NAME.');
  process.exit(1);
}

const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;

try {
  // Initialize git if needed
  if (!fs.existsSync('.git')) {
    console.log('📝 Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Add remote if not exists
  const remotes = execSync('git remote', { encoding: 'utf8' }).split('\n');
  if (!remotes.includes('origin')) {
    console.log('🌐 Adding remote origin...');
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
  } else {
    console.log('🌐 Remote origin already exists. Skipping.');
  }

  // Add all files except node_modules and .git
  console.log('📂 Adding files...');
  execSync('git add .', { stdio: 'inherit' });

  // Commit changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "Full ShadowChat scaffold commit"', { stdio: 'inherit' });

  // Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  execSync('git push -u origin main -f', { stdio: 'inherit' });

  console.log('✅ Push complete!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
