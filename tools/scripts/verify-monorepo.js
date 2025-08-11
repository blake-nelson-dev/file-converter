#!/usr/bin/env node

/**
 * Monorepo Verification Script
 * Validates the monorepo setup is working correctly
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const PACKAGES = ['shared', 'web', 'functions', 'config'];
const REQUIRED_FILES = [
  'package.json',
  'turbo.json', 
  'tsconfig.json',
  'packages/shared/lib/index.js',
  'packages/shared/lib/index.d.ts',
  'packages/web/package.json',
  'packages/functions/package.json',
  'packages/config/firebase.json'
];

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

function checkFileExists(filePath, description) {
  console.log(`\n📁 Checking ${description}...`);
  if (existsSync(filePath)) {
    const stats = statSync(filePath);
    console.log(`✅ ${description} exists (${stats.isDirectory() ? 'directory' : 'file'})`);
    return true;
  } else {
    console.log(`❌ ${description} missing: ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🚀 ConvertStudio Monorepo Verification\n');
  console.log('=' .repeat(50));

  let allPassed = true;

  // Check required files
  console.log('\n📋 FILE STRUCTURE VERIFICATION');
  for (const file of REQUIRED_FILES) {
    if (!checkFileExists(file, file)) {
      allPassed = false;
    }
  }

  // Check package directories
  console.log('\n📦 PACKAGE STRUCTURE VERIFICATION');  
  for (const pkg of PACKAGES) {
    if (!checkFileExists(`packages/${pkg}`, `packages/${pkg}`)) {
      allPassed = false;
    }
  }

  // Build verification
  console.log('\n🔨 BUILD VERIFICATION');
  if (!runCommand('npm run build', 'Build all packages')) {
    allPassed = false;
  }

  // Type check verification  
  console.log('\n🔍 TYPE CHECK VERIFICATION');
  if (!runCommand('npm run typecheck', 'Type check all packages')) {
    allPassed = false;
  }

  // Workspace dependency verification
  console.log('\n🔗 WORKSPACE DEPENDENCY VERIFICATION');
  if (!checkFileExists('node_modules/shared', 'Shared package workspace link')) {
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 ALL VERIFICATIONS PASSED!');
    console.log('\nMonorepo is properly configured and ready for development.');
    console.log('\nNext steps:');
    console.log('- Run `npm run dev` to start development servers');
    console.log('- Check `docs/monorepo-testing.md` for detailed testing guide');
  } else {
    console.log('⚠️  SOME VERIFICATIONS FAILED');
    console.log('\nPlease review the errors above and fix the issues.');
    process.exit(1);
  }
}

main();